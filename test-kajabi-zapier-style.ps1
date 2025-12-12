# Test Kajabi API using the same method Zapier might use
# Zapier might use a different endpoint or authentication method

$kajabiApiKey = "zThg3LJbBrPS9L7BtFpzBzgm"
$kajabiApiSecret = "PxVd7iZBQ2UPymvyJ4XLaL4A"

Write-Host "=== Testing Kajabi API (Zapier-style) ===" -ForegroundColor Cyan
Write-Host ""

# Test 1: Try direct API calls without OAuth (maybe Zapier uses API key directly)
Write-Host "Test 1: Direct API call with API key in header..." -ForegroundColor Green
$productsResponse1 = curl.exe -X GET "https://api.kajabi.com/v1/products" `
    -H "X-API-Key: $kajabiApiKey" `
    -H "X-API-Secret: $kajabiApiSecret" `
    -s

Write-Host "Response:" -ForegroundColor Yellow
Write-Host $productsResponse1
Write-Host ""

# Test 2: Try with API key as Bearer token
Write-Host "Test 2: Using API key as Bearer token..." -ForegroundColor Green
$productsResponse2 = curl.exe -X GET "https://api.kajabi.com/v1/products" `
    -H "Authorization: Bearer $kajabiApiKey" `
    -H "X-API-Secret: $kajabiApiSecret" `
    -s

Write-Host "Response:" -ForegroundColor Yellow
Write-Host $productsResponse2
Write-Host ""

# Test 3: Try Basic Auth with API key and secret
Write-Host "Test 3: Basic Auth with API key and secret..." -ForegroundColor Green
$bytes = [System.Text.Encoding]::UTF8.GetBytes("${kajabiApiKey}:${kajabiApiSecret}")
$base64 = [System.Convert]::ToBase64String($bytes)
$authHeader = "Basic $base64"

$productsResponse3 = curl.exe -X GET "https://api.kajabi.com/v1/products" `
    -H "Authorization: $authHeader" `
    -s

Write-Host "Response:" -ForegroundColor Yellow
Write-Host $productsResponse3
Write-Host ""

# Test 4: Try different OAuth endpoint or format
Write-Host "Test 4: OAuth with different parameter names (api_key/api_secret)..." -ForegroundColor Green
$tokenResponse4 = curl.exe -X POST "https://api.kajabi.com/v1/oauth/token" `
    -H "Content-Type: application/x-www-form-urlencoded" `
    -d "grant_type=client_credentials" `
    -d "api_key=$kajabiApiKey" `
    -d "api_secret=$kajabiApiSecret" `
    -s

Write-Host "Response:" -ForegroundColor Yellow
Write-Host $tokenResponse4
Write-Host ""

# Test 5: Check if there's a different base URL or endpoint
Write-Host "Test 5: Try alternative endpoints..." -ForegroundColor Green
$endpoints = @(
    "https://app.kajabi.com/api/v1/products",
    "https://api.kajabi.com/api/v1/products",
    "https://kajabi.com/api/v1/products"
)

foreach ($endpoint in $endpoints) {
    Write-Host "  Trying: $endpoint" -ForegroundColor Gray
    $response = curl.exe -X GET $endpoint `
        -H "Authorization: Bearer $kajabiApiKey" `
        -s
    if ($response -and $response -notmatch "error|404|401") {
        Write-Host "  Possible success!" -ForegroundColor Green
        Write-Host "  Response: $($response.Substring(0, [Math]::Min(200, $response.Length)))" -ForegroundColor Yellow
    }
}

Write-Host ""

# Check results
$success = $false
$responses = @($productsResponse1, $productsResponse2, $productsResponse3, $tokenResponse4)

foreach ($response in $responses) {
    if ($response -and $response -notmatch '"error"|"Invalid|"Missing') {
        $data = $response | ConvertFrom-Json -ErrorAction SilentlyContinue
        if ($data -and ($data.products -or $data.access_token)) {
            $success = $true
            Write-Host "SUCCESS! Found working method!" -ForegroundColor Green
            break
        }
    }
}

if (-not $success) {
    Write-Host "Note: Zapier might use a different authentication method or endpoint." -ForegroundColor Yellow
    Write-Host "Please check in Zapier:" -ForegroundColor Yellow
    Write-Host "  1. Go to your Zapier account" -ForegroundColor Gray
    Write-Host "  2. Check the Kajabi connection settings" -ForegroundColor Gray
    Write-Host "  3. See what authentication method it shows" -ForegroundColor Gray
}

Write-Host ""
Write-Host "=== Test Complete ===" -ForegroundColor Cyan
