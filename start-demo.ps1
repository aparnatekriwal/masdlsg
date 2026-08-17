# Start the full demo: Vite dev server + persistent Serveo tunnel
# Usage: powershell -ExecutionPolicy Bypass -File start-demo.ps1
#
# This script:
#   1. Starts the Vite dev server on port 5173
#   2. Starts a Serveo SSH tunnel that auto-reconnects
#   3. Writes the tunnel URL to .env so the QR code is correct
#   4. Keeps both alive indefinitely (designed to run for weeks/months)
#
# To stop: Ctrl+C or close the terminal window.

$ErrorActionPreference = "Continue"
$SSH = "C:\Windows\System32\OpenSSH\ssh.exe"
$LOCAL_PORT = 5173
$ENV_FILE = Join-Path $PSScriptRoot ".env"
$RETRY_DELAY_SEC = 5

# Ensure bun is on PATH
$env:PATH = "$env:USERPROFILE\.bun\bin;$env:PATH"

function Write-Status($msg, $color = "Cyan") {
    $ts = Get-Date -Format "HH:mm:ss"
    Write-Host "[$ts] $msg" -ForegroundColor $color
}

# --- Step 1: Kill any existing Vite/tunnel processes on our port ---
Write-Status "Cleaning up old processes..."
Get-NetTCPConnection -LocalPort $LOCAL_PORT -ErrorAction SilentlyContinue |
    ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }

# --- Step 2: Start Vite dev server as a background job ---
function Start-Vite {
    Write-Status "Starting Vite dev server..."
    $viteJob = Start-Job -ScriptBlock {
        param($dir, $bunPath)
        $env:PATH = "$bunPath;$env:PATH"
        Set-Location $dir
        & bun run dev --host 2>&1
    } -ArgumentList $PSScriptRoot, "$env:USERPROFILE\.bun\bin"
    return $viteJob
}

$viteJob = Start-Vite
Start-Sleep -Seconds 3
Write-Status "Vite dev server started (Job ID: $($viteJob.Id))" "Green"

# --- Step 3: Run Serveo tunnel in a reconnection loop ---
Write-Status "Starting persistent tunnel..."
Write-Host ""
Write-Host "============================================" -ForegroundColor Yellow
Write-Host "  DEMO SERVER - Designed to run for 1 month" -ForegroundColor Yellow
Write-Host "  Keep this window open (or use Task Scheduler)" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Yellow
Write-Host ""

$tunnelAttempt = 0

while ($true) {
    $tunnelAttempt++

    # Check if Vite is still alive, restart if needed
    if ($viteJob.State -ne "Running") {
        Write-Status "Vite died, restarting..." "Red"
        Remove-Job $viteJob -Force -ErrorAction SilentlyContinue
        $viteJob = Start-Vite
        Start-Sleep -Seconds 3
    }

    Write-Status "Connecting to Serveo (attempt #$tunnelAttempt)..."

    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = $SSH
    $psi.Arguments = "-o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 -o ExitOnForwardFailure=yes -o TCPKeepAlive=yes -R 80:localhost:${LOCAL_PORT} serveo.net"
    $psi.UseShellExecute = $false
    $psi.RedirectStandardOutput = $true
    $psi.RedirectStandardError = $true
    $psi.CreateNoWindow = $false

    $process = New-Object System.Diagnostics.Process
    $process.StartInfo = $psi

    try {
        $process.Start() | Out-Null

        while (-not $process.HasExited) {
            $line = $process.StandardOutput.ReadLine()
            if ($null -eq $line) {
                Start-Sleep -Milliseconds 200
                continue
            }
            Write-Host $line

            if ($line -match '(https://[^\s]+serveousercontent\.com[^\s]*)') {
                $url = $Matches[1]
                Write-Host ""
                Write-Host "  TUNNEL LIVE: $url" -ForegroundColor Green
                Write-Host ""

                # Write .env for Vite
                Set-Content -Path $ENV_FILE -Value "VITE_PUBLIC_URL=$url" -Encoding UTF8

                # Restart Vite so it picks up the new URL
                Write-Status "Restarting Vite with new URL..."
                Stop-Job $viteJob -ErrorAction SilentlyContinue
                Remove-Job $viteJob -Force -ErrorAction SilentlyContinue
                Start-Sleep -Seconds 1
                $viteJob = Start-Vite
                Start-Sleep -Seconds 3
                Write-Status "Vite restarted. QR code will show: $url" "Green"
                Write-Host ""
                Write-Host "  Open http://localhost:5173 on this PC to see the QR." -ForegroundColor Yellow
                Write-Host "  Scan the QR with your phone to access the demo." -ForegroundColor Yellow
                Write-Host ""
            }

            if ($line -match 'expired|refused|denied') {
                Write-Status "Tunnel issue detected: $line" "Red"
            }
        }

        $stderr = $process.StandardError.ReadToEnd()
        if ($stderr) { Write-Host $stderr -ForegroundColor Red }
        Write-Status "Tunnel disconnected (exit: $($process.ExitCode)). Reconnecting..." "Yellow"
    }
    catch {
        Write-Status "Error: $_" "Red"
    }
    finally {
        if ($process -and -not $process.HasExited) {
            $process.Kill()
        }
    }

    Start-Sleep -Seconds $RETRY_DELAY_SEC
}
