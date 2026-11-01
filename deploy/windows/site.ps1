# Runs the whole Sherubtse site on THIS Windows computer, reached by its IP address (no domain).
#   powershell -ExecutionPolicy Bypass -File deploy\windows\site.ps1 start     start everything
#   powershell -ExecutionPolicy Bypass -File deploy\windows\site.ps1 rebuild   rebuild the website from Strapi
#   powershell -ExecutionPolicy Bypass -File deploy\windows\site.ps1 stop      stop Strapi and the chat server
# Website: http://<IP>/   Admin: http://<IP>:1337/admin
# Needs: Node 22+, XAMPP's Apache (C:\xampp), and cms\.env / web\.env / chat-server\.env filled in.
param([Parameter(Position = 0)][ValidateSet('start', 'rebuild', 'stop')][string]$Action = 'start')

$ErrorActionPreference = 'Stop'
$Root = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$Logs = Join-Path $Root 'deploy\windows\logs'
New-Item -ItemType Directory -Force -Path $Logs | Out-Null

# The address other devices use to reach this computer.
$IP = (Get-NetIPAddress -AddressFamily IPv4 |
  Where-Object { $_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.254.*' -and $_.PrefixOrigin -ne 'WellKnown' } |
  Select-Object -First 1).IPAddress
if (-not $IP) { throw 'No network address found. Connect to Wi-Fi or a cable first.' }

function Wait-Port($port, $seconds = 120) {
  for ($i = 0; $i -lt $seconds; $i += 2) {
    if (Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue) { return $true }
    Start-Sleep -Seconds 2
  }
  return $false
}

function Stop-Port($port) {
  Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue |
    ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
}

function Start-Strapi {
  if (Get-NetTCPConnection -State Listen -LocalPort 1337 -ErrorAction SilentlyContinue) { Write-Host 'Strapi already running.'; return }
  Write-Host 'Starting Strapi...'
  $env:NODE_ENV = 'production'; $env:HOST = '0.0.0.0'; $env:FRONTEND_URL = "http://$IP"; $env:PUBLIC_URL = ''
  Start-Process -FilePath 'cmd.exe' -ArgumentList '/c', "npm start > `"$Logs\strapi.log`" 2>&1" -WorkingDirectory (Join-Path $Root 'cms') -WindowStyle Hidden
  if (-not (Wait-Port 1337)) { throw "Strapi did not start. See $Logs\strapi.log" }
}

function Start-Chat {
  if (Get-NetTCPConnection -State Listen -LocalPort 4600 -ErrorAction SilentlyContinue) { Write-Host 'Chat already running.'; return }
  Write-Host 'Starting the chat server...'
  Start-Process -FilePath 'cmd.exe' -ArgumentList '/c', "node server.mjs > `"$Logs\chat.log`" 2>&1" -WorkingDirectory (Join-Path $Root 'chat-server') -WindowStyle Hidden
}

function Start-Apache {
  if (Get-NetTCPConnection -State Listen -LocalPort 80 -ErrorAction SilentlyContinue) { Write-Host 'Something already listens on port 80 (Apache?).'; return }
  Write-Host 'Starting Apache...'
  Start-Process -FilePath 'C:\xampp\apache\bin\httpd.exe' -WorkingDirectory 'C:\xampp\apache' -WindowStyle Hidden
}

function Build-Site {
  Write-Host "Building the website for http://$IP ..."
  $env:STRAPI_URL = "http://$IP`:1337"; $env:PUBLIC_STRAPI_URL = "http://$IP`:1337"
  Push-Location (Join-Path $Root 'web')
  try { npm run build } finally { Pop-Location }
}

switch ($Action) {
  'start' {
    Start-Strapi
    $dist = Join-Path $Root 'web\dist\index.html'
    if (-not (Test-Path $dist)) { Build-Site }
    Start-Chat
    Start-Apache
    Write-Host "`nWebsite:  http://$IP/`nAdmin:    http://$IP`:1337/admin"
  }
  'rebuild' { Start-Strapi; Build-Site; Write-Host "Done. Website: http://$IP/" }
  'stop' { Stop-Port 1337; Stop-Port 4600; Write-Host 'Stopped Strapi and the chat server. (Apache: stop it from the XAMPP control panel.)' }
}
