$nodeVersion = "v22.12.0"
$zipName = "node-$nodeVersion-win-x64.zip"
$url = "https://nodejs.org/dist/$nodeVersion/$zipName"
$destDir = "d:\website disign\ss dental cinic\code\horizons-export-dc22980f-a9df-4839-96b8-627d622e799c\.node"
$zipPath = Join-Path $env:TEMP $zipName

Write-Host "Downloading Node.js $nodeVersion from $url..."
try {
    Invoke-WebRequest -Uri $url -OutFile $zipPath -UserAgent "Mozilla/5.0"
} catch {
    Write-Error "Failed to download Node.js: $_"
    exit 1
}

Write-Host "Extracting to $destDir..."
if (Test-Path $destDir) {
    Remove-Item -Recurse -Force $destDir
}
New-Item -ItemType Directory -Path $destDir -Force | Out-Null

try {
    Expand-Archive -Path $zipPath -DestinationPath $destDir
} catch {
    Write-Error "Failed to extract Node.js zip: $_"
    exit 1
}

# Move contents out of the nested folder
$extractedFolder = Join-Path $destDir "node-$nodeVersion-win-x64"
if (Test-Path $extractedFolder) {
    Move-Item -Path "$extractedFolder\*" -Destination $destDir -Force
    Remove-Item -Recurse -Force $extractedFolder
}

# Remove downloaded zip file
if (Test-Path $zipPath) {
    Remove-Item -Force $zipPath
}

Write-Host "Node.js installation completed successfully!"
