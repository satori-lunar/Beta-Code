# Simple Kajabi API Test using curl
$kajabiApiKey = "zThg3LJbBrPS9L7BtFpzBzgm"
$kajabiApiSecret = "PxVd7iZBQ2UPymvyJ4XLaL4A"

Write-Host "=== Testing Kajabi API Directly ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Get OAuth Token
Write-Host "Step 1: Getting OAuth token..." -ForegroundColor Green

$body = "grant_type=client_credentials&client_id=$kajabiApiKey&client_secret=$kajabiApiSecret"

$tokenResponse = curl.exe -X POST "https://api.kajabi.com/v1/oauth/token" `
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
    
    Write-Host "Products Response:" -ForegroundColor Yellow
    Write-Host $productsResponse
    Write-Host ""
    
    # Step 3: Fetch Contacts
    Write-Host "Step 3: Fetching contacts..." -ForegroundColor Green
    $contactsResponse = curl.exe -X GET "https://api.kajabi.com/v1/contacts" `
        -H "Authorization: Bearer $accessToken" `
        -H "Content-Type: application/json" `
        -s
    
    Write-Host "Contacts Response:" -ForegroundColor Yellow
    Write-Host $contactsResponse
} else {
    Write-Host "Authentication failed!" -ForegroundColor Red
    Write-Host "Check the response above for error details." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Test Complete ===" -ForegroundColor Cyan
