[CmdletBinding()]
param(
    [switch]$FailOnDrift
)

$ErrorActionPreference = 'Stop'
$headers = @{ 'User-Agent' = 'mubi-stremio-catalogs-maintenance' }

function Get-Json {
    param([Parameter(Mandatory)][string]$Uri)

    Invoke-RestMethod -Uri $Uri -Headers $headers -TimeoutSec 20
}

function Get-LatestRelease {
    param([Parameter(Mandatory)][string]$Repository)

    $release = Get-Json -Uri "https://api.github.com/repos/$Repository/releases/latest"
    [pscustomobject]@{
        repository = $Repository
        tag = $release.tag_name
        publishedAt = $release.published_at
        url = $release.html_url
    }
}

function Remove-VersionPrefix {
    param([AllowNull()][string]$Version)

    if (-not $Version) {
        return $null
    }

    $Version -replace '^v', ''
}

function Test-VersionAtLeast {
    param(
        [AllowNull()][string]$Current,
        [Parameter(Mandatory)][string]$Minimum
    )

    if (-not $Current) {
        return $false
    }

    try {
        return [version](Remove-VersionPrefix $Current) -ge [version]$Minimum
    }
    catch {
        return $false
    }
}

$aioManifest = Get-Json -Uri 'https://aiostreams.elfhosted.com/stremio/manifest.json'
$metadataManifest = Get-Json -Uri 'https://aiometadata.elfhosted.com/manifest.json'
$watchlyHealth = Get-Json -Uri 'https://watchly.elfhosted.com/health'
$watchlyStats = Get-Json -Uri 'https://watchly.elfhosted.com/stats'
$watchlyHtml = (Invoke-WebRequest -Uri 'https://watchly.elfhosted.com/' -Headers $headers -TimeoutSec 20 -UseBasicParsing).Content
$watchlyVersionMatch = [regex]::Match($watchlyHtml, 'v\d+\.\d+\.\d+')
$watchlyVersion = if ($watchlyVersionMatch.Success) { Remove-VersionPrefix $watchlyVersionMatch.Value } else { $null }
$catalogManifest = Get-Json -Uri 'https://yashgurbani.github.io/mubi-stremio-catalogs/manifest.json'
$curatedManifest = Get-Json -Uri 'https://yashgurbani.github.io/mubi-stremio-catalogs/curated/manifest.json'

$letterboxdUrlImportReady = Test-VersionAtLeast -Current $metadataManifest.version -Minimum '2.16.3'

$releaseRepositories = @(
    'Viren070/AIOStreams',
    'cedya77/aiometadata',
    'TimilsinaBimal/Watchly',
    'NuvioMedia/NuvioTV',
    'mhdzumair/MediaFusion',
    'sooti/sootio-stremio-addon'
)

$releases = @{}
foreach ($repository in $releaseRepositories) {
    $releases[$repository] = Get-LatestRelease -Repository $repository
}

$drift = [System.Collections.Generic.List[object]]::new()

$comparisons = @(
    [pscustomobject]@{
        service = 'AIOStreams'
        deployed = $aioManifest.version
        latest = Remove-VersionPrefix $releases['Viren070/AIOStreams'].tag
    },
    [pscustomobject]@{
        service = 'AIOMetadata'
        deployed = $metadataManifest.version
        latest = Remove-VersionPrefix $releases['cedya77/aiometadata'].tag
    },
    [pscustomobject]@{
        service = 'Watchly'
        deployed = $watchlyVersion
        latest = Remove-VersionPrefix $releases['TimilsinaBimal/Watchly'].tag
    }
)

foreach ($comparison in $comparisons) {
    if ($comparison.deployed -ne $comparison.latest) {
        $drift.Add([pscustomobject]@{
            service = $comparison.service
            deployed = $comparison.deployed
            latest = $comparison.latest
        })
    }
}

$catalogChecks = foreach ($catalog in $catalogManifest.catalogs) {
    $catalogUrl = "https://yashgurbani.github.io/mubi-stremio-catalogs/catalog/$($catalog.type)/$($catalog.id).json"
    $catalogPayload = Get-Json -Uri $catalogUrl
    [pscustomobject]@{
        id = $catalog.id
        type = $catalog.type
        name = $catalog.name
        items = @($catalogPayload.metas).Count
    }
}

$curatedLiveAudit = & node (Join-Path $PSScriptRoot 'audit-curated-live.mjs') | ConvertFrom-Json
$curatedCatalogChecks = @($curatedLiveAudit.catalogs)

$result = [pscustomobject]@{
    generatedAt = [DateTimeOffset]::UtcNow.ToString('o')
    publicServices = [pscustomobject]@{
        aiostreams = [pscustomobject]@{
            healthy = $true
            version = $aioManifest.version
        }
        aiometadata = [pscustomobject]@{
            healthy = $true
            version = $metadataManifest.version
            letterboxdUrlImportReady = $letterboxdUrlImportReady
            movieLensCapabilityObservable = $false
            movieLensCapabilityStatus = 'unknown'
        }
        watchly = [pscustomobject]@{
            healthy = $watchlyHealth.status -eq 'healthy'
            version = $watchlyVersion
            users = $watchlyStats.total_users
        }
        mubiCatalogAddon = [pscustomobject]@{
            healthy = $true
            version = $catalogManifest.version
            catalogs = @($catalogChecks)
        }
        curatedDiscoveryAddon = [pscustomobject]@{
            healthy = $curatedLiveAudit.healthy
            version = $curatedManifest.version
            catalogs = @($curatedCatalogChecks)
        }
    }
    latestReleases = @($releaseRepositories | ForEach-Object { $releases[$_] })
    releaseDrift = @($drift)
    upgradeGates = [pscustomobject]@{
        aiometadataReinstallReady = $letterboxdUrlImportReady
        letterboxdUrlImportReady = $letterboxdUrlImportReady
        movieLensPublicIntegrationReady = $null
        recommendedAction = if (-not $letterboxdUrlImportReady) {
            'Wait for the public AIOMetadata instance to deploy v2.16.3 or later.'
        }
        else {
            'Letterboxd URL imports are ready. Test MovieLens in the configuration UI because the public config endpoint does not expose its server-side capability.'
        }
    }
}

$result | ConvertTo-Json -Depth 8

if ($FailOnDrift -and $drift.Count -gt 0) {
    exit 2
}
