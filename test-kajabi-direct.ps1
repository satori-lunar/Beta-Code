# Direct Kajabi API Test Script
# This tests the Kajabi API directly without going through Supabase

$kajabiApiKey = "zThg3LJbBrPS9L7BtFpzBzgm"
$kajabiApiSecret = "PxVd7iZBQ2UPymvyJ4XLaL4A"

Write-Host "=== Testing Kajabi API Directly ===" -ForegroundColor Cyan
Write-Host "API Key: $kajabiApiKey" -ForegroundColor Yellow
Write-Host "API Secret: $($kajabiApiSecret.Substring(0, 5))..." -ForegroundColor Yellow
Write-Host ""

# Step 1: Get OAuth Token
Write-Host "Step 1: Getting OAuth token..." -ForegroundColor Green

$tokenUrl = "https://api.kajabi.com/v1/oauth/token"
$formBody = "grant_type=client_credentials&client_id=$([System.Web.HttpUtility]::UrlEncode($kajabiApiKey))&client_secret=$([System.Web.HttpUtility]::UrlEncode($kajabiApiSecret))"

Write-Host "Request URL: $tokenUrl" -ForegroundColor Gray
Write-Host "Form body: grant_type=client_credentials&client_id=...&client_secret=..." -ForegroundColor Gray

try {
    $tokenResponse = Invoke-RestMethod -Uri $tokenUrl -Method Post -ContentType "application/x-www-form-urlencoded" -Body $formBody -ErrorAction Stop
    
    $accessToken = $tokenResponse.access_token
    Write-Host "✓ Successfully authenticated!" -ForegroundColor Green
    Write-Host "Access Token: $($accessToken.Substring(0, 20))..." -ForegroundColor Gray
    Write-Host ""
    
    # Step 2: Fetch Products
    Write-Host "Step 2: Fetching products..." -ForegroundColor Green
    $productsUrl = "https://api.kajabi.com/v1/products"
    $headers = @{
        "Authorization" = "Bearer $accessToken"
        "Content-Type" = "application/json"
    }
    
    try {
        $productsResponse = Invoke-RestMethod -Uri $productsUrl -Method Get -Headers $headers -ErrorAction Stop
        Write-Host "✓ Successfully fetched products!" -ForegroundColor Green
        Write-Host "Number of products: $($productsResponse.products.Count)" -ForegroundColor Cyan
        
        if ($productsResponse.products.Count -gt 0) {
            Write-Host ""
            Write-Host "First product:" -ForegroundColor Yellow
            $firstProduct = $productsResponse.products[0]
            Write-Host "  ID: $($firstProduct.id)" -ForegroundColor Gray
            Write-Host "  Name: $($firstProduct.name)" -ForegroundColor Gray
            Write-Host "  Type: $($firstProduct.type)" -ForegroundColor Gray
        }
    } catch {
        Write-Host "✗ Failed to fetch products: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.ErrorDetails.Message) {
            Write-Host "  Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
        }
    }
    
    Write-Host ""
    
    # Step 3: Fetch Contacts
    Write-Host "Step 3: Fetching contacts..." -ForegroundColor Green
    $contactsUrl = "https://api.kajabi.com/v1/contacts"
    
    try {
        $contactsResponse = Invoke-RestMethod -Uri $contactsUrl -Method Get -Headers $headers -ErrorAction Stop
        Write-Host "✓ Successfully fetched contacts!" -ForegroundColor Green
        Write-Host "Number of contacts: $($contactsResponse.contacts.Count)" -ForegroundColor Cyan
        
        if ($contactsResponse.contacts.Count -gt 0) {
            Write-Host ""
            Write-Host "First contact:" -ForegroundColor Yellow
            $firstContact = $contactsResponse.contacts[0]
            Write-Host "  ID: $($firstContact.id)" -ForegroundColor Gray
            Write-Host "  Email: $($firstContact.email)" -ForegroundColor Gray
            if ($firstContact.tags) {
                Write-Host "  Tags: $($firstContact.tags -join ', ')" -ForegroundColor Gray
            }
        }
    } catch {
        Write-Host "✗ Failed to fetch contacts: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.ErrorDetails.Message) {
            Write-Host "  Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
        }
    }
    
} catch {
    Write-Host "✗ Authentication failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== Test Complete ===" -ForegroundColor Cyan
