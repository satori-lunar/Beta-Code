# Fetch all replay products from Kajabi
$kajabiApiKey = "zThg3LJbBrPS9L7BtFpzBzgm"
$kajabiApiSecret = "PxVd7iZBQ2UPymvyJ4XLaL4A"

Write-Host "=== Fetching Replay Products ===" -ForegroundColor Cyan

# Get OAuth Token
Write-Host "Authenticating..." -ForegroundColor Green
$tokenResponse = curl.exe -X POST "https://api.kajabi.com/v1/oauth/token" -H "Content-Type: application/x-www-form-urlencoded" -d "grant_type=client_credentials" -d "client_id=$kajabiApiKey" -d "client_secret=$kajabiApiSecret" -s
$tokenData = $tokenResponse | ConvertFrom-Json -ErrorAction SilentlyContinue

if (-not $tokenData -or -not $tokenData.access_token) {
    Write-Host "ERROR: $tokenResponse" -ForegroundColor Red
    exit 1
}

$accessToken = $tokenData.access_token
Write-Host "Authenticated!" -ForegroundColor Green

# Fetch Products
Write-Host "Fetching products..." -ForegroundColor Green
$productsResponse = curl.exe -X GET "https://api.kajabi.com/v1/products" -H "Authorization: Bearer $accessToken" -H "Content-Type: application/json" -s
$productsData = $productsResponse | ConvertFrom-Json -ErrorAction SilentlyContinue

$allProducts = $productsData.products
if (-not $allProducts) { $allProducts = $productsData.data }
if (-not $allProducts) { $allProducts = @($productsData) }

Write-Host "Found $($allProducts.Count) total products" -ForegroundColor Green

# Filter Replay Products
$replayProducts = @()
foreach ($product in $allProducts) {
    $name = if ($product.name) { $product.name.ToString().ToLower() } else { "" }
    $type = if ($product.product_type) { $product.product_type.ToString().ToLower() } else { "" }
    if ($name -match "replay" -or $type -match "replay") {
        $replayProducts += $product
    }
}

Write-Host "Found $($replayProducts.Count) replay products" -ForegroundColor Green
Write-Host ""

# Display Results
if ($replayProducts.Count -gt 0) {
    for ($i = 0; $i -lt $replayProducts.Count; $i++) {
        $p = $replayProducts[$i]
        Write-Host "[$($i+1)] $($p.name)" -ForegroundColor Yellow
        Write-Host "    ID: $($p.id)" -ForegroundColor Gray
        Write-Host "    Type: $($p.product_type)" -ForegroundColor Gray
        if ($p.url) { Write-Host "    URL: $($p.url)" -ForegroundColor Cyan }
        Write-Host ""
    }
    
    # Export JSON
    $json = $replayProducts | ConvertTo-Json -Depth 10
    $file = "replay-products-$(Get-Date -Format 'yyyyMMdd-HHmmss').json"
    $json | Out-File -FilePath $file -Encoding UTF8
    Write-Host "Exported to: $file" -ForegroundColor Green
} else {
    Write-Host "No replay products found. All products:" -ForegroundColor Yellow
    foreach ($p in $allProducts) {
        Write-Host "  - $($p.name) (Type: $($p.product_type))" -ForegroundColor Gray
    }
}

Write-Host "Complete!" -ForegroundColor Cyan
