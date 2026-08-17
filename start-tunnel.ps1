# Persistent Serveo tunnel with auto-reconnect
# Usage: powershell -ExecutionPolicy Bypass -File start-tunnel.ps1
# Keep this terminal open. The tunnel auto-reconnects if it drops.

$SSH = "C:\Windows\System32\OpenSSH\ssh.exe"
$LOCAL_PORT = 5173
$ENV_FILE = Join-Path $PSScriptRoot ".env"
$MAX_RETRIES = 0  # 0 = infinite
$RETRY_DELAY_SEC = 5
$attempt = 0

function Write-Status($msg) {
    $ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$ts] $msg" -ForegroundColor Cyan
}

function Extract-Url($line) {
    if ($line -match '(https?://[^\s]+serveousercontent\.com[^\s]*)') {
        return $Matches[1]
    }
    return $null
}

function Update-EnvFile($url) {
    $envContent = "VITE_PUBLIC_URL=$url"
    Set-Content -Path $ENV_FILE -Value $envContent -Encoding UTF8
    Write-Status "Updated .env -> $url"
}

Write-Status "Starting persistent Serveo tunnel (port $LOCAL_PORT)..."
Write-Status "Press Ctrl+C to stop."
Write-Host ""

while ($true) {
    $attempt++
    if ($MAX_RETRIES -gt 0 -and $attempt -gt $MAX_RETRIES) {
        Write-Status "Max retries ($MAX_RETRIES) reached. Exiting."
        break
    }

    Write-Status "Connecting to Serveo (attempt #$attempt)..."

    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = $SSH
    $psi.Arguments = "-o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ServerAliveCountMax=3 -o ExitOnForwardFailure=yes -R 80:localhost:${LOCAL_PORT} serveo.net"
    $psi.UseShellExecute = $false
    $psi.RedirectStandardOutput = $true
    $psi.RedirectStandardError = $true
    $psi.CreateNoWindow = $false

    $process = New-Object System.Diagnostics.Process
    $process.StartInfo = $psi

    try {
        $process.Start() | Out-Null
        Write-Status "SSH process started (PID: $($process.Id))"

        # Read output line by line looking for the URL
        while (-not $process.HasExited) {
            $line = $process.StandardOutput.ReadLine()
            if ($null -eq $line) {
                Start-Sleep -Milliseconds 500
                continue
            }
            Write-Host $line

            $url = Extract-Url $line
            if ($url) {
                Write-Status "TUNNEL ACTIVE: $url"
                Update-EnvFile $url
                Write-Host ""
                Write-Host "  === QR code will use: $url ===" -ForegroundColor Green
                Write-Host "  Restart Vite dev server to pick up the new URL," -ForegroundColor Yellow
                Write-Host "  or it will auto-detect on next page load." -ForegroundColor Yellow
                Write-Host ""
            }
        }

        # Read any remaining stderr
        $stderr = $process.StandardError.ReadToEnd()
        if ($stderr) { Write-Host $stderr -ForegroundColor Red }

        $exitCode = $process.ExitCode
        Write-Status "SSH disconnected (exit code: $exitCode)"
    }
    catch {
        Write-Status "Error: $_"
    }
    finally {
        if ($process -and -not $process.HasExited) {
            $process.Kill()
        }
    }

    Write-Status "Reconnecting in $RETRY_DELAY_SEC seconds..."
    Start-Sleep -Seconds $RETRY_DELAY_SEC
}
