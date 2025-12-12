# Test Kajabi API with correct format (separate --data parameters)
$kajabiApiKey = "zThg3LJbBrPS9L7BtFpzBzgm"
$kajabiApiSecret = "PxVd7iZBQ2UPymvyJ4XLaL4A"

Write-Host "=== Testing Kajabi API (Correct Format) ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 1: Getting OAuth token..." -ForegroundColor Green
Write-Host "Using format: --data 'client_id=...' --data 'client_secret=...' --data 'grant_type=client_credentials'" -ForegroundColor Gray
Write-Host ""

# Use curl with separate --data parameters (as per Kajabi docs)
$tokenResponse = curl.exe -X POST "https://api.kajabi.com/v1/oauth/token" `
    -H "Content-Type: application/x-www-form-urlencoded" `
    -d "client_id=$kajabiApiKey" `
    -d "client_secret=$kajabiApiSecret" `
    -d "grant_type=client_credentials" `
    -s

Write-Host "Response:" -ForegroundColor Yellow
Write-Host $tokenResponse
Write-Host ""

# Parse the token if successful
$tokenData = $tokenResponse | ConvertFrom-Json -ErrorAction SilentlyContinue

if ($tokenData -and $tokenData.access_token) {
    $accessToken = $tokenData.access_token
    Write-Host "SUCCESS! Authenticated!" -ForegroundColor Green
    Write-Host "Access Token: $($accessToken.Substring(0, 20))..." -ForegroundColor Gray
    Write-Host ""
    
    # Step 2: Fetch Products
    Write-Host "Step 2: Fetching products..." -ForegroundColor Green
    $productsResponse = curl.exe -X GET "https://api.kajabi.com/v1/products" `
        -H "Authorization: Bearer $accessToken" `
        -H "Content-Type: application/json" `
        -s
    
    $productsData = $productsResponse | ConvertFrom-Json -ErrorAction SilentlyContinue
    if ($productsData -and $productsData.products) {
        Write-Host "SUCCESS! Fetched $($productsData.products.Count) products" -ForegroundColor Green
        if ($productsData.products.Count -gt 0) {
            Write-Host "First product: $($productsData.products[0].name) (ID: $($productsData.products[0].id))" -ForegroundColor Cyan
        }
    } else {
        Write-Host "Products response:" -ForegroundColor Yellow
        Write-Host $productsResponse.Substring(0, [Math]::Min(500, $productsResponse.Length))
    }
    Write-Host ""
    
    # Step 3: Fetch Contacts
    Write-Host "Step 3: Fetching contacts..." -ForegroundColor Green
    $contactsResponse = curl.exe -X GET "https://api.kajabi.com/v1/contacts" `
        -H "Authorization: Bearer $accessToken" `
        -H "Content-Type: application/json" `
        -s
    
    $contactsData = $contactsResponse | ConvertFrom-Json -ErrorAction SilentlyContinue
    if ($contactsData -and $contactsData.contacts) {
        Write-Host "SUCCESS! Fetched $($contactsData.contacts.Count) contacts" -ForegroundColor Green
        if ($contactsData.contacts.Count -gt 0) {
            Write-Host "First contact: $($contactsData.contacts[0].email) (ID: $($contactsData.contacts[0].id))" -ForegroundColor Cyan
            if ($contactsData.contacts[0].tags) {
                Write-Host "Tags: $($contactsData.contacts[0].tags -join ', ')" -ForegroundColor Gray
            }
        }
    } else {
        Write-Host "Contacts response:" -ForegroundColor Yellow
        Write-Host $contactsResponse.Substring(0, [Math]::Min(500, $contactsResponse.Length))
    }
} else {
    Write-Host "Authentication FAILED!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Possible issues:" -ForegroundColor Yellow
    Write-Host "1. The API keys may be incorrect" -ForegroundColor Gray
    Write-Host "2. The API keys may have been deleted/rotated" -ForegroundColor Gray
    Write-Host "3. The API keys may not have the correct permissions" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Please verify in Kajabi Dashboard:" -ForegroundColor Yellow
    Write-Host "  Settings > Public API > Check your API keys" -ForegroundColor Gray
}

Write-Host ""
Write-Host "=== Test Complete ===" -ForegroundColor Cyan
