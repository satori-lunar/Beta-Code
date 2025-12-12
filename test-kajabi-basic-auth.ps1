# Test Kajabi API with Basic Auth
$kajabiApiKey = "zThg3LJbBrPS9L7BtFpzBzgm"
$kajabiApiSecret = "PxVd7iZBQ2UPymvyJ4XLaL4A"

Write-Host "=== Testing Kajabi API with Basic Auth ===" -ForegroundColor Cyan
Write-Host ""

# Create Basic Auth header
$bytes = [System.Text.Encoding]::UTF8.GetBytes("${kajabiApiKey}:${kajabiApiSecret}")
$base64 = [System.Convert]::ToBase64String($bytes)
$authHeader = "Basic $base64"

Write-Host "Step 1: Getting OAuth token with Basic Auth..." -ForegroundColor Green

$body = "grant_type=client_credentials"

$tokenResponse = curl.exe -X POST "https://api.kajabi.com/v1/oauth/token" `
    -H "Authorization: $authHeader" `
    -H "Content-Type: application/x-www-form-urlencoded" `
    -d $body `
    -s

Write-Host "Response:" -ForegroundColor Yellow
Write-Host $tokenResponse
Write-Host ""

# Parse the token if successful
$tokenData = $tokenResponse | ConvertFrom-Json -ErrorAction SilentlyContinue

if ($tokenData -and $tokenData.access_token) {
    $accessToken = $tokenData.access_token
    Write-Host "Successfully authenticated!" -ForegroundColor Green
    Write-Host "Access Token: $($accessToken.Substring(0, 20))..." -ForegroundColor Gray
    Write-Host ""
    
    # Step 2: Fetch Products
    Write-Host "Step 2: Fetching products..." -ForegroundColor Green
    $productsResponse = curl.exe -X GET "https://api.kajabi.com/v1/products" `
        -H "Authorization: Bearer $accessToken" `
        -H "Content-Type: application/json" `
        -s
    
    Write-Host "Products Response (first 500 chars):" -ForegroundColor Yellow
    Write-Host $productsResponse.Substring(0, [Math]::Min(500, $productsResponse.Length))
    Write-Host ""
    
    # Step 3: Fetch Contacts
    Write-Host "Step 3: Fetching contacts..." -ForegroundColor Green
    $contactsResponse = curl.exe -X GET "https://api.kajabi.com/v1/contacts" `
        -H "Authorization: Bearer $accessToken" `
        -H "Content-Type: application/json" `
        -s
    
    Write-Host "Contacts Response (first 500 chars):" -ForegroundColor Yellow
    Write-Host $contactsResponse.Substring(0, [Math]::Min(500, $contactsResponse.Length))
} else {
    Write-Host "Authentication failed!" -ForegroundColor Red
    Write-Host "The API keys may be incorrect or the format is wrong." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Test Complete ===" -ForegroundColor Cyan
