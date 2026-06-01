param(
  [int]$Port = 3000
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# Ensure reports folder exists
if (-Not (Test-Path -Path "./reports")) {
  New-Item -ItemType Directory -Path "./reports" | Out-Null
}

# Install dependencies only if needed
if (-Not (Test-Path -Path "./node_modules")) {
  Write-Host "Installing dependencies (node_modules not found)..."
  try {
    npm ci
  } catch {
    Write-Host "npm install failed. Try running 'npm ci' manually (close editors/servers if file locks occur) and re-run this script." -ForegroundColor Yellow
    throw
  }
} else {
  Write-Host "Skipping install — existing node_modules detected."
}

Write-Host "Building app..."
try {
  npm run build
} catch {
  Write-Host "Build failed. Ensure dependencies are installed and Node version meets package engines (some packages require Node >=22)." -ForegroundColor Yellow
  throw
}

Write-Host "Starting app (background)..."
# Start server in background
Start-Process -FilePath "npm" -ArgumentList "run","start" -NoNewWindow

Write-Host "Waiting for app to become ready..."

# simple wait
Start-Sleep -Seconds 6

# verify Docker is available
Write-Host "Checking Docker availability..."
$dockerOk = $false
try {
  docker info > $null 2>&1
  if ($LASTEXITCODE -eq 0) { $dockerOk = $true }
} catch {
  $dockerOk = $false
}
if (-not $dockerOk) {
  Write-Host "Docker does not appear to be running or reachable. Start Docker Desktop and re-run this script." -ForegroundColor Red
  exit 1
}

Write-Host "Running OWASP ZAP baseline scan against http://host.docker.internal:$Port"
docker run --rm -v ${PWD}/reports:/zap/wrk -t owasp/zap2docker-stable `
  zap-baseline.py -t "http://host.docker.internal:$Port" -r zap-report.html

$reportPath = Join-Path -Path (Get-Location) -ChildPath "reports\zap-report.html"
if (Test-Path $reportPath) {
  Write-Host "Opening report: $reportPath"
  Start-Process $reportPath
} else {
  Write-Host "Report not found: $reportPath"
}
