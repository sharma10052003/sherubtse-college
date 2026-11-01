#!/bin/sh
# Builds the website from Strapi and publishes it to the folder nginx serves.
# Run as the sherubtse user. A failed build leaves the live site untouched.
# See docs/DEPLOY-PROXMOX.md.
set -eu

APP_DIR="${APP_DIR:-/opt/sherubtse}"
SITE_DIR="${SITE_DIR:-/var/www/sherubtse}"

cd "$APP_DIR/web"
echo "[rebuild] building website $(date '+%F %T')"
npm run build
rsync -a --delete dist/ "$SITE_DIR/"
echo "[rebuild] published to $SITE_DIR $(date '+%F %T')"
