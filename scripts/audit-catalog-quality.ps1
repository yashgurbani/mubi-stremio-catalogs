[CmdletBinding()]
param(
    [ValidateRange(5, 50)]
    [int]$SampleSize = 20,
    [switch]$FailOnQualityRisk
)

$ErrorActionPreference = 'Stop'
$headers = @{ 'User-Agent' = 'mubi-stremio-catalogs-quality-audit' }
$baseUri = 'https://indian-regional-catalog.vercel.app'

function Get-Json {
    param([Parameter(Mandatory)][string]$Uri)

    Invoke-RestMethod -Uri $Uri -Headers $headers -TimeoutSec 20
}

function Get-Year {
    param([AllowNull()]$ReleaseInfo)

    $match = [regex]::Match([string]$ReleaseInfo, '\b(19|20)\d{2}\b')
    if ($match.Success) {
        return [int]$match.Value
    }

    return $null
}

$manifest = Get-Json -Uri "$baseUri/manifest.json"
$currentYear = [DateTimeOffset]::UtcNow.Year
$rows = [System.Collections.Generic.List[object]]::new()
$sampledItems = [System.Collections.Generic.List[object]]::new()

foreach ($catalog in $manifest.catalogs) {
    $uri = "$baseUri/catalog/$($catalog.type)/$($catalog.id).json?skip=0"
    $payload = Get-Json -Uri $uri
    $items = @($payload.metas | Select-Object -First $SampleSize)
    $ratings = @($items | Where-Object { -not [string]::IsNullOrWhiteSpace([string]$_.imdbRating) })
    $promoItems = @($items | Where-Object { [string]$_.id -like 'ir:promo-*' })
    $syntheticIds = @($items | Where-Object { [string]$_.id -match '^tmdb:\d+\|\|' })
    $nameDuplicates = @(
        $items |
            Group-Object { ([string]$_.name).Trim().ToLowerInvariant() } |
            Where-Object Count -gt 1 |
            ForEach-Object Name
    )
    $currentYearItems = @($items | Where-Object { (Get-Year $_.releaseInfo) -eq $currentYear })

    foreach ($item in $items) {
        $sampledItems.Add([pscustomobject]@{
            catalog = $catalog.id
            type = $catalog.type
            name = ([string]$item.name).Trim()
            normalizedName = ([string]$item.name).Trim().ToLowerInvariant()
        })
    }

    $ratingCoverage = if ($items.Count -eq 0) { 0 } else { $ratings.Count / $items.Count }
    $rows.Add([pscustomobject]@{
        id = $catalog.id
        type = $catalog.type
        name = $catalog.name
        sampledItems = $items.Count
        ratingCoverage = [math]::Round($ratingCoverage, 3)
        currentYearShare = if ($items.Count -eq 0) { 0 } else { [math]::Round($currentYearItems.Count / $items.Count, 3) }
        promoItems = $promoItems.Count
        syntheticIds = $syntheticIds.Count
        duplicateNames = @($nameDuplicates)
        firstFive = @($items | Select-Object -First 5 | ForEach-Object { $_.name })
        qualityRole = 'freshness-and-language-coverage'
        qualityRisk = $ratingCoverage -lt 0.25 -or $promoItems.Count -gt 0 -or $nameDuplicates.Count -gt 0
    })
}

$crossCatalogDuplicates = @(
    $sampledItems |
        Group-Object normalizedName |
        Where-Object { $_.Count -gt 1 -and -not [string]::IsNullOrWhiteSpace($_.Name) } |
        ForEach-Object {
            [pscustomobject]@{
                name = $_.Group[0].name
                occurrences = $_.Count
                catalogs = @($_.Group.catalog | Select-Object -Unique)
            }
        } |
        Sort-Object -Property @(
            @{ Expression = 'occurrences'; Descending = $true },
            @{ Expression = 'name'; Descending = $false }
        )
)

$riskRows = @($rows | Where-Object qualityRisk)
$result = [pscustomobject]@{
    generatedAt = [DateTimeOffset]::UtcNow.ToString('o')
    addon = [pscustomobject]@{
        id = $manifest.id
        name = $manifest.name
        version = $manifest.version
        catalogs = @($manifest.catalogs).Count
    }
    methodology = [pscustomobject]@{
        sampleSizePerCatalog = $SampleSize
        qualityDefinition = 'This audit measures rating metadata, duplication, promotional entries, identifier quality, and recency concentration. It does not treat popularity as artistic quality.'
    }
    catalogs = @($rows)
    crossCatalogDuplicates = @($crossCatalogDuplicates)
    summary = [pscustomobject]@{
        catalogsWithQualityRisk = $riskRows.Count
        totalCatalogs = $rows.Count
        conclusion = 'Use this addon for broad and recent regional coverage. Do not use its raw ordering as the primary quality-curated discovery layer.'
        recommendedPlacement = 'Keep selected regional rows late on Home. Place critic, festival, award, and personalized Indian rows earlier.'
    }
}

$result | ConvertTo-Json -Depth 10

if ($FailOnQualityRisk -and $riskRows.Count -gt 0) {
    exit 3
}
