# Fetch all replay products from Kajabi
# Using Account Details API credentials

$kajabiApiKey = "zThg3LJbBrPS9L7BtFpzBzgm"
$kajabiApiSecret = "PxVd7iZBQ2UPymvyJ4XLaL4A"

Write-Host "=== Fetching Replay Products from Kajabi ===" -ForegroundColor Cyan
Write-Host "Account: Birch and Stone Coaching Collective" -ForegroundColor Gray
Write-Host ""

# Step 1: Get OAuth Token
Write-Host "Step 1: Authenticating with Kajabi..." -ForegroundColor Green

$tokenResponse = curl.exe -X POST "https://api.kajabi.com/v1/oauth/token" `
    -H "Content-Type: application/x-www-form-urlencoded" `
    -d "grant_type=client_credentials" `
    -d "client_id=$kajabiApiKey" `
    -d "client_secret=$kajabiApiSecret" `
    -s

$tokenData = $tokenResponse | ConvertFrom-Json -ErrorAction SilentlyContinue

if (-not $tokenData -or -not $tokenData.access_token) {
    Write-Host "ERROR: Authentication failed!" -ForegroundColor Red
    Write-Host "Response: $tokenResponse" -ForegroundColor Red
    exit 1
}

$accessToken = $tokenData.access_token
Write-Host "✓ Successfully authenticated!" -ForegroundColor Green
Write-Host ""

# Step 2: Fetch All Products
Write-Host "Step 2: Fetching all products..." -ForegroundColor Green

$productsResponse = curl.exe -X GET "https://api.kajabi.com/v1/products" `
    -H "Authorization: Bearer $accessToken" `
    -H "Content-Type: application/json" `
    -s

$productsData = $productsResponse | ConvertFrom-Json -ErrorAction SilentlyContinue

if (-not $productsData) {
    Write-Host "ERROR: Failed to fetch products!" -ForegroundColor Red
    Write-Host "Response: $productsResponse" -ForegroundColor Red
    exit 1
}

$allProducts = $productsData.products
if (-not $allProducts) {
    $allProducts = $productsData.data
}
if (-not $allProducts) {
    $allProducts = @($productsData)
}

Write-Host "✓ Found $($allProducts.Count) total products" -ForegroundColor Green
Write-Host ""

# Step 3: Filter for Replay Products
Write-Host "Step 3: Filtering for replay products..." -ForegroundColor Green

$replayProducts = @()
foreach ($product in $allProducts) {
    $productName = if ($product.name) { $product.name.ToString() } else { "" }
    $productType = if ($product.product_type) { $product.product_type.ToString() } else { "" }
    $description = if ($product.description) { $product.description.ToString() } else { "" }
    
    # Check if product is a replay (case-insensitive search)
    $isReplay = $false
    if ($productName -match "replay" -or 
        $productType -match "replay" -or 
        $description -match "replay" -or
        ($product.type -and $product.type.ToString() -match "replay")) {
        $isReplay = $true
    }
    
    if ($isReplay) {
        $replayProducts += $product
    }
}

Write-Host "✓ Found $($replayProducts.Count) replay products" -ForegroundColor Green
Write-Host ""

# Step 4: Display Results
if ($replayProducts.Count -eq 0) {
    Write-Host "No replay products found." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "All products found:" -ForegroundColor Cyan
    foreach ($product in $allProducts) {
        $name = if ($product.name) { $product.name } else { "Unnamed" }
        $type = if ($product.product_type) { $product.product_type } else { "Unknown" }
        Write-Host "  - $name (ID: $($product.id), Type: $type)" -ForegroundColor Gray
    }
} else {
    Write-Host "=== REPLAY PRODUCTS ===" -ForegroundColor Cyan
    Write-Host ""
    
    for ($i = 0; $i -lt $replayProducts.Count; $i++) {
        $product = $replayProducts[$i]
        $name = if ($product.name) { $product.name } else { "Unnamed" }
        Write-Host "[$($i + 1)] $name" -ForegroundColor Yellow
        Write-Host "    ID: $($product.id)" -ForegroundColor Gray
        $type = if ($product.product_type) { $product.product_type } else { "Unknown" }
        Write-Host "    Type: $type" -ForegroundColor Gray
        if ($product.description) {
            $desc = $product.description.ToString()
            if ($desc.Length -gt 100) {
                $desc = $desc.Substring(0, 100) + "..."
            }
            Write-Host "    Description: $desc" -ForegroundColor Gray
        }
        if ($product.url) {
            Write-Host "    URL: $($product.url)" -ForegroundColor Cyan
        }
        if ($product.permalink) {
            Write-Host "    Permalink: $($product.permalink)" -ForegroundColor Cyan
        }
        if ($product.hero_image_url) {
            Write-Host "    Hero Image: $($product.hero_image_url)" -ForegroundColor Gray
        }
        Write-Host ""
    }
    
    # Step 5: Fetch Offerings for Each Replay Product
    Write-Host "=== FETCHING OFFERINGS FOR REPLAY PRODUCTS ===" -ForegroundColor Cyan
    Write-Host ""
    
    foreach ($product in $replayProducts) {
        $name = if ($product.name) { $product.name } else { "Unnamed" }
        Write-Host "Fetching offerings for: $name..." -ForegroundColor Green
        try {
            $offeringsResponse = curl.exe -X GET "https://api.kajabi.com/v1/products/$($product.id)/offerings" `
                -H "Authorization: Bearer $accessToken" `
                -H "Content-Type: application/json" `
                -s
            
            $offeringsData = $offeringsResponse | ConvertFrom-Json -ErrorAction SilentlyContinue
            $offerings = $null
            if ($offeringsData) {
                $offerings = $offeringsData.offerings
                if (-not $offerings) {
                    $offerings = $offeringsData.data
                }
                if (-not $offerings) {
                    $offerings = @($offeringsData)
                }
            }
            
            if ($offerings -and $offerings.Count -gt 0) {
                Write-Host "  Found $($offerings.Count) offerings:" -ForegroundColor Cyan
                foreach ($offering in $offerings) {
                    $offeringName = if ($offering.name) { $offering.name } else { "Unnamed" }
                    Write-Host "    - $offeringName (ID: $($offering.id))" -ForegroundColor Gray
                    if ($offering.url) {
                        Write-Host "      URL: $($offering.url)" -ForegroundColor DarkGray
                    }
                }
            } else {
                Write-Host "  No offerings found" -ForegroundColor DarkGray
            }
        } catch {
            Write-Host "  Could not fetch offerings: $($_.Exception.Message)" -ForegroundColor Yellow
        }
        Write-Host ""
    }
}

# Export to JSON file (if we found any replay products)
if ($replayProducts.Count -gt 0) {
    $jsonOutput = $replayProducts | ConvertTo-Json -Depth 10
    $outputFile = "replay-products-$(Get-Date -Format 'yyyyMMdd-HHmmss').json"
    $jsonOutput | Out-File -FilePath $outputFile -Encoding UTF8
    Write-Host "✓ Exported replay products to: $outputFile" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Complete ===" -ForegroundColor Cyan
