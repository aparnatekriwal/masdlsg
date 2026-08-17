# Run this ONCE in an elevated (Admin) PowerShell to register a scheduled task
# that starts the demo server on login and keeps it running.
#
# Usage (Admin PowerShell):
#   powershell -ExecutionPolicy Bypass -File setup-scheduled-task.ps1

$TaskName = "PayNow Demo Server"
$ScriptPath = Join-Path $PSScriptRoot "start-demo.ps1"
$Username = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name

# Remove existing task if present
Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue

$Action = New-ScheduledTaskAction `
    -Execute "powershell.exe" `
    -Argument "-ExecutionPolicy Bypass -WindowStyle Minimized -File `"$ScriptPath`"" `
    -WorkingDirectory $PSScriptRoot

$Trigger = New-ScheduledTaskTrigger -AtLogOn -User $Username

$Settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -RestartCount 999 `
    -RestartInterval (New-TimeSpan -Minutes 1) `
    -ExecutionTimeLimit (New-TimeSpan -Days 31) `
    -StartWhenAvailable

Register-ScheduledTask `
    -TaskName $TaskName `
    -Action $Action `
    -Trigger $Trigger `
    -Settings $Settings `
    -RunLevel Highest `
    -Description "Runs the PayNow prototype Vite server + Serveo tunnel persistently"

Write-Host ""
Write-Host "Scheduled task '$TaskName' registered successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "The demo will start automatically on login."
Write-Host "To start it immediately:  Start-ScheduledTask -TaskName '$TaskName'"
Write-Host "To remove it later:       Unregister-ScheduledTask -TaskName '$TaskName'"
Write-Host ""
