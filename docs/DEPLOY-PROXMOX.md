# Putting the website on the college Proxmox server

The whole site runs in **one container** on `pve1`:

- **Strapi**, the admin panel where staff edit content, runs all the time.
- **The website** is built from Strapi's content and served by **nginx**.
- **Automatic updates.** When someone publishes a change in Strapi, the website rebuilds itself about two minutes later. It also rebuilds every night at 00:05, so expired notices and past events drop off.
- **The “Ask Sherubtse” AI chat** runs next to the website. It answers from the published pages using Google Gemini (free key, Step 9).

There are two stages:

1. **Stage 1 (testing):** reach everything by the container's IP address. No DNS or HTTPS needed.
2. **Stage 2 (real addresses):** `new.sherubtse.edu.bt` for the website and `cms.sherubtse.edu.bt` for the admin, both with HTTPS.

Everything below that's in a grey box is a command. Type or paste it into the container's console, one box at a time.

---

## Before you start (on your PC)

1. **Stop Strapi** on your PC: press <kbd>Ctrl</kbd>+<kbd>C</kbd> in its terminal.
2. **Push the latest code and database to GitHub's `main` branch.** The server downloads the project from there, including the `deploy/` folder these steps use. In the `sherubtse-college` folder, run:

   ```bash
   git add -A
   git commit -m "Prepare for Proxmox deployment"
   git push
   ```

   If you work on another branch, merge it into `main` afterwards (a pull request on GitHub). If it says "nothing to commit", that's fine; it's already pushed.

3. **Keep two files open in VS Code.** You'll copy their contents to the server in Step 5:
   - `cms/.env`
   - `web/.env`

---

## Step 1: Create the container

In Proxmox, select **pve1**, click **Create CT**, and fill in the wizard:

| Tab | Setting |
|---|---|
| General | CT ID `119`, Hostname `strapi-cms`, Unprivileged ✅, Nesting ✅, a strong root **password** (write it down) |
| Template | `debian-12-standard`. If none is listed, download it first: **local (pve1) → CT Templates → Templates**. |
| Disks | Storage `local-zfs`, size **30** GB |
| CPU | **2** cores |
| Memory | **4096** MB, swap **1024** MB |
| Network | Bridge `vmbr0`. For IPv4, copy what container 116 (Lab-web) uses: DHCP, or a **free** static IP with the same `/24` and gateway. |
| DNS | Leave empty |
| Confirm | Tick **Start after created**, then **Finish** |

**Write down the container's IP address.** It's shown under **119 → Network**. Below it's written as `<IP>`. Replace that with the real address, for example `103.133.218.95`.

## Step 2: Open the console

1. Click **119** in the left list.
2. Click the small arrow next to **Console** at the top and choose **xterm.js**. This console lets you paste with right-click or <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>V</kbd>.
3. Log in as `root` with the password from Step 1.

## Step 3: Install the software

```bash
apt update && apt upgrade -y
```

```bash
apt install -y curl git rsync nginx sudo build-essential python3 sqlite3
```

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
```

```bash
apt install -y nodejs
```

```bash
node -v
```

The last command should print `v22.` followed by more numbers.

## Step 4: Create the app user and download the project

The website runs as its own user, `sherubtse`, not as root.

```bash
adduser --system --group --home /home/sherubtse --shell /bin/bash sherubtse
```

```bash
mkdir -p /opt/sherubtse /opt/sherubtse-data /var/www/sherubtse
```

```bash
chown sherubtse:sherubtse /opt/sherubtse /opt/sherubtse-data /var/www/sherubtse
```

```bash
sudo -u sherubtse git clone https://github.com/sharma10052003/sherubtse-college.git /opt/sherubtse
```

Copy the database to its permanent place, outside the code folder, so code updates never overwrite it:

```bash
sudo -u sherubtse cp /opt/sherubtse/cms/.tmp/data.db /opt/sherubtse-data/data.db
```

The uploaded photos come with the project, in `cms/public/uploads`.

## Step 5: Add the settings files

These files hold passwords and keys, so they aren't on GitHub. You copy them from your PC.

**Strapi settings:**

```bash
sudo -u sherubtse nano /opt/sherubtse/cms/.env
```

1. Paste the **whole contents** of `cms/.env` from your PC.
2. Change or add these lines, replacing `<IP>` with the container's address:

   ```
   HOST=0.0.0.0
   DATABASE_CLIENT=sqlite
   DATABASE_FILENAME=../../sherubtse-data/data.db
   FRONTEND_URL=http://<IP>
   SITE_REBUILD_WEBHOOK_URL=http://127.0.0.1:4500/rebuild
   ```

3. Save with <kbd>Ctrl</kbd>+<kbd>O</kbd> then <kbd>Enter</kbd>, and close with <kbd>Ctrl</kbd>+<kbd>X</kbd>.

**Website settings:**

```bash
sudo -u sherubtse nano /opt/sherubtse/web/.env
```

1. Paste the contents of `web/.env` from your PC.
2. Change these two lines to use the container's address:

   ```
   STRAPI_URL=http://<IP>:1337
   PUBLIC_STRAPI_URL=http://<IP>:1337
   ```

3. Keep `STRAPI_API_TOKEN` exactly as it is on your PC. Save and close as before.

Then make both files readable only by the app user:

```bash
chmod 600 /opt/sherubtse/cms/.env /opt/sherubtse/web/.env
```

## Step 6: Install and build

This step takes several minutes; the Strapi build is the slow part.

```bash
sudo -u sherubtse bash -c 'cd /opt/sherubtse/cms && npm ci && NODE_ENV=production npm run build'
```

```bash
sudo -u sherubtse bash -c 'cd /opt/sherubtse/web && npm ci'
```

## Step 7: Start Strapi and the auto-rebuilder

```bash
cp /opt/sherubtse/deploy/sherubtse-cms.service /opt/sherubtse/deploy/sherubtse-rebuild.service /opt/sherubtse/deploy/sherubtse-chat.service /etc/systemd/system/
```

```bash
systemctl daemon-reload
```

```bash
systemctl enable --now sherubtse-cms sherubtse-rebuild
```

```bash
systemctl status sherubtse-cms --no-pager
```

The status should say **active (running)**. Wait about 30 seconds for Strapi to finish starting.

**Check it:** on your PC, open **http://&lt;IP&gt;:1337/admin** and log in with the **same email and password** you use on your PC, since the database is the same.

## Step 8: Build the website and switch on nginx

Build the site for the first time (about a minute):

```bash
sudo -u sherubtse sh /opt/sherubtse/deploy/rebuild.sh
```

It should end with `published to /var/www/sherubtse`. Now tell nginx to serve it:

```bash
cp /opt/sherubtse/deploy/nginx-test-by-ip.conf /etc/nginx/sites-available/sherubtse
```

```bash
ln -s /etc/nginx/sites-available/sherubtse /etc/nginx/sites-enabled/sherubtse
```

```bash
rm -f /etc/nginx/sites-enabled/default
```

```bash
nginx -t && systemctl reload nginx
```

**Check it:** on your PC, open **http://&lt;IP&gt;**. You should see the full website with menus, photos and news.

## Step 9: Switch on the AI chat

The chat works without this step: it then shows matching pages. With a free Gemini key it writes proper answers.

1. **Create the key (on your PC).** Go to **https://aistudio.google.com**, sign in with a Google account, click **Get API key → Create API key**, and copy it. Treat it like a password: don't email it, and don't put it on GitHub.
2. **Check your free limit.** Open **https://aistudio.google.com/rate-limit** and note the requests per day for the Flash-Lite model (Google sets this per account).
3. **Put the key on the server:**

   ```bash
   sudo -u sherubtse cp /opt/sherubtse/chat-server/.env.example /opt/sherubtse/chat-server/.env
   ```

   ```bash
   sudo -u sherubtse nano /opt/sherubtse/chat-server/.env
   ```

   - Paste the key after `GEMINI_API_KEY=`.
   - Set `DAILY_LIMIT` a little under your free limit from point 2.
   - Set `SITE_DIR=/var/www/sherubtse`.
   - Save and close.

   ```bash
   chmod 600 /opt/sherubtse/chat-server/.env
   ```

4. **Start it:**

   ```bash
   systemctl enable --now sherubtse-chat
   ```

   ```bash
   journalctl -u sherubtse-chat -n 5 --no-pager
   ```

   It should say `AI on` and `knowledge loaded: … pages`.

**Check it:** open the website, click **Ask a question** in the bottom-right corner and ask *“What are the admission fees?”*. You should get a written answer with the pages it came from.

## Step 10: Test that editing updates the site

1. In the admin panel (`http://<IP>:1337/admin`), change something small, such as a notice title, and click **Publish**.
2. Wait 2 to 3 minutes: 1 minute of waiting for more changes, then about 1 minute of building.
3. Refresh the website. The change should be there.

To watch the rebuild as it happens:

```bash
journalctl -u sherubtse-rebuild -f
```

Press <kbd>Ctrl</kbd>+<kbd>C</kbd> to stop watching.

**Stage 1 is done.** Everything works by IP address.

---

## Stage 2: Real addresses with HTTPS

Do this once the testing is finished.

### Step 11: DNS and network (ask the network administrator)

1. Add two DNS **A records** on the college DNS server (container 102, ns1):
   - `new.sherubtse.edu.bt` pointing to the public IP that reaches container 119
   - `cms.sherubtse.edu.bt` pointing to the same IP
2. Make sure ports **80** and **443** from the internet reach container 119.

`new.` is a suggestion: it keeps the old site on `www` running until launch day. The names are set in `deploy/nginx-domains.conf`; change them there if you choose others.

### Step 12: Switch nginx to the real addresses and add HTTPS

```bash
cp /opt/sherubtse/deploy/nginx-domains.conf /etc/nginx/sites-available/sherubtse
```

```bash
nginx -t && systemctl reload nginx
```

```bash
apt install -y certbot python3-certbot-nginx
```

```bash
certbot --nginx -d new.sherubtse.edu.bt -d cms.sherubtse.edu.bt
```

Certbot asks for an email address (for expiry warnings) and to accept its terms. It then sets up HTTPS and renews it automatically.

### Step 13: Point everything at the new addresses

Open the Strapi settings:

```bash
sudo -u sherubtse nano /opt/sherubtse/cms/.env
```

Change these lines:

```
HOST=127.0.0.1
FRONTEND_URL=https://new.sherubtse.edu.bt
PUBLIC_URL=https://cms.sherubtse.edu.bt
IS_PROXIED=true
```

`HOST=127.0.0.1` closes port 1337 to the outside, so the admin is only reachable through HTTPS.

Open the website settings:

```bash
sudo -u sherubtse nano /opt/sherubtse/web/.env
```

Change these lines:

```
STRAPI_URL=https://cms.sherubtse.edu.bt
PUBLIC_STRAPI_URL=https://cms.sherubtse.edu.bt
```

Let the container reach its own addresses directly when it builds:

```bash
echo "127.0.0.1 new.sherubtse.edu.bt cms.sherubtse.edu.bt" >> /etc/hosts
```

Restart Strapi, wait 30 seconds, then rebuild:

```bash
systemctl restart sherubtse-cms
```

```bash
sudo -u sherubtse sh /opt/sherubtse/deploy/rebuild.sh
```

The website is now at **https://new.sherubtse.edu.bt** and the admin panel at **https://cms.sherubtse.edu.bt/admin**.

---

## Later: installing code updates

When new code has been pushed to GitHub's `main` branch:

```bash
sudo -u sherubtse git -C /opt/sherubtse pull
```

```bash
sudo -u sherubtse bash -c 'cd /opt/sherubtse/cms && npm ci && NODE_ENV=production npm run build'
```

```bash
systemctl restart sherubtse-cms sherubtse-chat
```

```bash
sudo -u sherubtse bash -c 'cd /opt/sherubtse/web && npm ci' && sudo -u sherubtse sh /opt/sherubtse/deploy/rebuild.sh
```

**The server's database is now the master copy.** Content edited on the server lives in `/opt/sherubtse-data/data.db`. The `cms/.tmp/data.db` in GitHub is no longer used by the server, so pulling code never touches live content.

## Backups

In Proxmox, go to **Datacenter → Backup** and make sure a scheduled job includes **CT 119**. That one backup covers the database, the uploaded photos, the settings and the website.

## If something goes wrong

| Problem | What to check |
|---|---|
| `http://<IP>` or the admin won't open from your PC | **119 → Firewall**: allow ports 80, 443 and (Stage 1 only) 1337. Then run `systemctl status sherubtse-cms nginx --no-pager`. |
| Strapi isn't running | `journalctl -u sherubtse-cms -n 50 --no-pager` shows the error. |
| The website is empty (no menu, no news) | The website can't read Strapi. Check `STRAPI_URL` and `STRAPI_API_TOKEN` in `web/.env`, then rebuild. The build output shows `[strapi] … 401` or `failed` lines. |
| A build stops with "Killed" | The container ran out of memory. Raise it to 6144 MB under **119 → Resources**. |
| Admin login fails after Stage 2 | Check `IS_PROXIED=true` and `PUBLIC_URL` in `cms/.env`, then run `systemctl restart sherubtse-cms`. |
| The chat only shows pages, no written answers | Run `journalctl -u sherubtse-chat -n 30 --no-pager`. `AI off` means the key is missing from `chat-server/.env`. `Gemini 429` means the free daily limit is used up; it resets at midnight Pacific time, and pages are shown meanwhile. |
| An edit doesn't show on the website | Run `journalctl -u sherubtse-rebuild -n 50 --no-pager`. Check that `SITE_REBUILD_WEBHOOK_URL` is set in `cms/.env`. |
