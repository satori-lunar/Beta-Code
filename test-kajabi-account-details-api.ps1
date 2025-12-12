# Test using Account Details API Credentials (not Public API OAuth)
# These might use a different authentication method than OAuth

$kajabiApiKey = "zThg3LJbBrPS9L7BtFpzBzgm"
$kajabiApiSecret = "PxVd7iZBQ2UPymvyJ4XLaL4A"

Write-Host "=== Testing Account Details API Credentials ===" -ForegroundColor Cyan
Write-Host "These are different from Public API User API Keys!" -ForegroundColor Yellow
Write-Host ""

# The Account Details API might use a different endpoint or method
# Let's try various approaches that Zapier might use

# Test 1: Check if there's a webhook or different API endpoint
Write-Host "Test 1: Checking for webhook/legacy API endpoints..." -ForegroundColor Green

# Some older Kajabi integrations use webhook-style authentication
$testEndpoints = @(
    "https://api.kajabi.com/v1/webhooks",
    "https://app.kajabi.com/api/v1/products",
    "https://api.kajabi.com/v1/account/products"
)

foreach ($endpoint in $testEndpoints) {
    Write-Host "  Trying: $endpoint" -ForegroundColor Gray
    $response = curl.exe -X GET $endpoint `
        -H "X-Kajabi-API-Key: $kajabiApiKey" `
        -H "X-Kajabi-API-Secret: $kajabiApiSecret" `
        -s 2>&1
    Write-Host "    Response: $($response.Substring(0, [Math]::Min(100, $response.Length)))" -ForegroundColor DarkGray
}

Write-Host ""

# Test 2: Maybe Account Details API uses the keys directly as username/password
Write-Host "Test 2: Trying Basic Auth with API Key as username..." -ForegroundColor Green
$bytes = [System.Text.Encoding]::UTF8.GetBytes("${kajabiApiKey}:${kajabiApiSecret}")
$base64 = [System.Convert]::ToBase64String($bytes)
$authHeader = "Basic $base64"

# Try different endpoints that might accept Account Details credentials
$endpoints = @(
    "https://api.kajabi.com/v1/products",
    "https://api.kajabi.com/v1/contacts"
)

foreach ($endpoint in $endpoints) {
    Write-Host "  Testing: $endpoint" -ForegroundColor Gray
    $response = curl.exe -X GET $endpoint `
        -H "Authorization: $authHeader" `
        -s
    
    $data = $response | ConvertFrom-Json -ErrorAction SilentlyContinue
    if ($data -and ($data.products -or $data.contacts -or $data.data)) {
        Write-Host "  SUCCESS with $endpoint!" -ForegroundColor Green
        Write-Host "  Response preview: $($response.Substring(0, [Math]::Min(200, $response.Length)))" -ForegroundColor Yellow
    } elseif ($response -notmatch '"error"|"Invalid|"Unauthorized') {
        Write-Host "  Possible success: $($response.Substring(0, [Math]::Min(100, $response.Length)))" -ForegroundColor Yellow
    }
}

Write-Host ""

# Test 3: Check Zapier's actual implementation
Write-Host "Test 3: Important Information" -ForegroundColor Green
Write-Host "  Account Details API Credentials are for:" -ForegroundColor Yellow
Write-Host "    - Zapier integration" -ForegroundColor Gray
Write-Host "    - Third-party app connections" -ForegroundColor Gray
Write-Host ""
Write-Host "  Public API User API Keys are for:" -ForegroundColor Yellow
Write-Host "    - Direct API access via OAuth 2.0" -ForegroundColor Gray
Write-Host "    - Custom applications" -ForegroundColor Gray
Write-Host ""
Write-Host "  You need to create Public API User API Keys for the Supabase integration!" -ForegroundColor Cyan
Write-Host "  Steps:" -ForegroundColor Yellow
Write-Host "    1. Go to Kajabi Dashboard > Settings > Public API" -ForegroundColor Gray
Write-Host "    2. Click 'Create User API Key'" -ForegroundColor Gray
Write-Host "    3. Select user and permissions" -ForegroundColor Gray
Write-Host "    4. Copy the client_id and client_secret" -ForegroundColor Gray

Write-Host ""
Write-Host "=== Test Complete ===" -ForegroundColor Cyan
