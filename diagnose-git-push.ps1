# Diagnostic script for Git push timeout issue
$logPath = "c:\Users\Wisdom Femi Kayode\Desktop\Happy_Birthday-2\.cursor\debug.log"

function Log-Debug {
    param($location, $message, $data, $hypothesisId)
    $logEntry = @{
        id = "log_$(Get-Date -Format 'yyyyMMddHHmmss')_$(Get-Random)"
        timestamp = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
        location = $location
        message = $message
        data = $data
        sessionId = "debug-session"
        runId = "run1"
        hypothesisId = $hypothesisId
    } | ConvertTo-Json -Compress
    Add-Content -Path $logPath -Value $logEntry
}

# #region agent log - Hypothesis A: Large image files causing timeout
$imageFiles = Get-ChildItem -Path "birthday" -File
$totalSize = ($imageFiles | Measure-Object -Property Length -Sum).Sum
$totalSizeMB = [math]::Round($totalSize / 1MB, 2)
$largestFile = $imageFiles | Sort-Object Length -Descending | Select-Object -First 1
Log-Debug -location "diagnose-git-push.ps1:14" -message "Image file sizes analysis" -data @{
    totalFiles = $imageFiles.Count
    totalSizeMB = $totalSizeMB
    totalSizeBytes = $totalSize
    largestFileName = $largestFile.Name
    largestFileSizeMB = [math]::Round($largestFile.Length / 1MB, 2)
    largestFileSizeBytes = $largestFile.Length
} -hypothesisId "A"
# #endregion

# #region agent log - Hypothesis B: Git HTTP buffer too small
$currentBufferOutput = git config --get http.postBuffer 2>&1
$currentBuffer = if ($LASTEXITCODE -eq 0 -and $currentBufferOutput -match '^\d+$') { $currentBufferOutput } else { "default (1MB)" }
$currentBufferBytes = if ($currentBuffer -match '^\d+$') { [int]$currentBuffer } else { 1048576 }
Log-Debug -location "diagnose-git-push.ps1:27" -message "Git HTTP buffer configuration" -data @{
    currentBuffer = $currentBuffer
    currentBufferMB = [math]::Round($currentBufferBytes / 1MB, 2)
    bufferSufficient = $currentBufferBytes -gt $totalSize
    needsIncrease = $currentBufferBytes -lt $totalSize
} -hypothesisId "B"
# #endregion

# #region agent log - Hypothesis C: Network/timeout configuration
$lowSpeedLimit = git config --get http.lowSpeedLimit
$lowSpeedTime = git config --get http.lowSpeedTime
if ($LASTEXITCODE -ne 0) { $lowSpeedLimit = "default" }
git config --get http.lowSpeedTime | Out-Null
if ($LASTEXITCODE -ne 0) { $lowSpeedTime = "default" }
Log-Debug -location "diagnose-git-push.ps1:38" -message "Git timeout configuration" -data @{
    lowSpeedLimit = $lowSpeedLimit
    lowSpeedTime = $lowSpeedTime
} -hypothesisId "C"
# #endregion

# #region agent log - Hypothesis D: Push data size vs buffer
$gitStatus = git status --porcelain
$stagedFiles = git diff --cached --name-only
$pushSize = 0
foreach ($file in $stagedFiles) {
    $fileInfo = Get-Item $file -ErrorAction SilentlyContinue
    if ($fileInfo) { $pushSize += $fileInfo.Length }
}
$pushSizeMB = [math]::Round($pushSize / 1MB, 2)
Log-Debug -location "diagnose-git-push.ps1:51" -message "Staged files for push" -data @{
    stagedFileCount = $stagedFiles.Count
    pushSizeMB = $pushSizeMB
    pushSizeBytes = $pushSize
    exceedsDefaultBuffer = $pushSize -gt 1048576
} -hypothesisId "D"
# #endregion

# #region agent log - Post-fix verification
$newBuffer = git config --get http.postBuffer
$newBufferBytes = if ($newBuffer -match '^\d+$') { [int]$newBuffer } else { 1048576 }
Log-Debug -location "diagnose-git-push.ps1:65" -message "Post-fix buffer verification" -data @{
    newBuffer = $newBuffer
    newBufferMB = [math]::Round($newBufferBytes / 1MB, 2)
    fixApplied = $newBufferBytes -gt 1048576
    bufferSufficientAfterFix = $newBufferBytes -gt $totalSize
} -hypothesisId "B" -runId "post-fix"
# #endregion

Write-Host "Diagnostic complete. Check $logPath for detailed logs."

