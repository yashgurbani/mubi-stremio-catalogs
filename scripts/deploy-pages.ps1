[CmdletBinding()]
param(
  [string] $Repository = "yashgurbani/mubi-stremio-catalogs"
)

$ErrorActionPreference = "Stop"

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  throw "GitHub CLI is required."
}

gh auth status
if ($LASTEXITCODE -ne 0) {
  throw "GitHub CLI is not authenticated."
}

node "$PSScriptRoot\validate.mjs"
if ($LASTEXITCODE -ne 0) {
  throw "Catalog validation failed."
}

gh repo view $Repository --json nameWithOwner *> $null
if ($LASTEXITCODE -eq 0) {
  throw "Repository already exists: $Repository"
}

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
Push-Location $root
try {
  git init -b main
  git add .
  git commit -m "Publish verified MUBI editorial catalogs"

  gh repo create $Repository `
    --public `
    --source . `
    --remote origin `
    --description "Source-faithful MUBI editorial collection catalogs for Stremio"

  gh api `
    --method POST `
    -H "Accept: application/vnd.github+json" `
    "repos/$Repository/pages" `
    -f build_type=workflow

  git push --set-upstream origin main
}
finally {
  Pop-Location
}

$owner, $name = $Repository -split "/", 2
Write-Output "Manifest: https://$owner.github.io/$name/manifest.json"
