#!/bin/bash
# One-paste installer for Stage 1 of docs/DEPLOY-PROXMOX.md — the whole site on one Debian 12
# container, reached by the container's IP address (no domain, no HTTPS).
#
# Before running it, put your two settings files on the container:
#   nano /root/cms.env     (paste the contents of cms/.env from your PC)
#   nano /root/web.env     (paste the contents of web/.env from your PC)
# Then, as root:
#   bash /opt/sherubtse/deploy/install-by-ip.sh        (if the project is already there), or
#   curl -fsSL https://raw.githubusercontent.com/sharma10052003/sherubtse-college/main/deploy/install-by-ip.sh | bash
#
# Safe to run again: it updates the code, keeps the database and uploads, and rebuilds.
set -euo pipefail

REPO="${REPO:-https://github.com/sharma10052003/sherubtse-college.git}"
APP=/opt/sherubtse
DATA=/opt/sherubtse-data
SITE=/var/www/sherubtse
IP="${SITE_IP:-$(hostname -I | awk '{print $1}')}"

say() { printf '\n\033[1;33m== %s\033[0m\n' "$*"; }
[ "$(id -u)" -eq 0 ] || { echo "Run this as root."; exit 1; }
[ -f /root/cms.env ] && [ -f /root/web.env ] || { echo "Create /root/cms.env and /root/web.env first (see the top of this file)."; exit 1; }
echo "Using IP address: $IP"

say "1/7  Installing the software"
export DEBIAN_FRONTEND=noninteractive
apt-get update -y && apt-get upgrade -y
apt-get install -y curl git rsync nginx sudo build-essential python3 sqlite3
if ! command -v node >/dev/null || ! node -v | grep -q '^v22\.'; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi
node -v

say "2/7  App user and project"
id sherubtse >/dev/null 2>&1 || adduser --system --group --home /home/sherubtse --shell /bin/bash sherubtse
mkdir -p "$APP" "$DATA" "$SITE"
chown sherubtse:sherubtse "$APP" "$DATA" "$SITE"
if [ -d "$APP/.git" ]; then
  sudo -u sherubtse git -C "$APP" pull --ff-only
else
  sudo -u sherubtse git clone "$REPO" "$APP"
fi
# The database lives outside the code folder, so updates never overwrite it.
[ -f "$DATA/data.db" ] || sudo -u sherubtse cp "$APP/cms/.tmp/data.db" "$DATA/data.db"

say "3/7  Settings files"
setvar() { # file KEY VALUE
  if grep -q "^$2=" "$1"; then sed -i "s|^$2=.*|$2=$3|" "$1"; else echo "$2=$3" >> "$1"; fi
}
cp /root/cms.env "$APP/cms/.env"
cp /root/web.env "$APP/web/.env"
setvar "$APP/cms/.env" HOST 0.0.0.0
setvar "$APP/cms/.env" DATABASE_CLIENT sqlite
setvar "$APP/cms/.env" DATABASE_FILENAME ../../sherubtse-data/data.db
setvar "$APP/cms/.env" FRONTEND_URL "http://$IP"
setvar "$APP/cms/.env" SITE_REBUILD_WEBHOOK_URL http://127.0.0.1:4500/rebuild
setvar "$APP/web/.env" STRAPI_URL "http://$IP:1337"
setvar "$APP/web/.env" PUBLIC_STRAPI_URL "http://$IP:1337"
chown sherubtse:sherubtse "$APP/cms/.env" "$APP/web/.env"
chmod 600 "$APP/cms/.env" "$APP/web/.env"

say "4/7  Installing packages and building Strapi (the slow part)"
sudo -u sherubtse bash -c "cd $APP/cms && npm ci && NODE_ENV=production npm run build"
sudo -u sherubtse bash -c "cd $APP/web && npm ci"

say "5/7  Starting Strapi and the auto-rebuilder"
cp "$APP"/deploy/sherubtse-cms.service "$APP"/deploy/sherubtse-rebuild.service "$APP"/deploy/sherubtse-chat.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable sherubtse-cms sherubtse-rebuild
systemctl restart sherubtse-cms sherubtse-rebuild
echo "Waiting for Strapi to start…"
for i in $(seq 1 60); do
  curl -fs -o /dev/null "http://127.0.0.1:1337/_health" && break
  sleep 3
done
curl -fs -o /dev/null "http://127.0.0.1:1337/_health" || { echo "Strapi did not start. See: journalctl -u sherubtse-cms -n 50"; exit 1; }

say "6/7  Building the website"
sudo -u sherubtse sh "$APP/deploy/rebuild.sh"

say "7/7  Switching on nginx"
cp "$APP/deploy/nginx-test-by-ip.conf" /etc/nginx/sites-available/sherubtse
ln -sf /etc/nginx/sites-available/sherubtse /etc/nginx/sites-enabled/sherubtse
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

cat <<DONE

Done.
  Website:  http://$IP/
  Admin:    http://$IP:1337/admin   (same email and password as on your PC)

The AI chat is optional — see Step 9 of docs/DEPLOY-PROXMOX.md.
DONE
