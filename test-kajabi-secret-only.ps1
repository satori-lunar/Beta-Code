# Test Kajabi API with only the secret key
$kajabiApiKey = "zThg3LJbBrPS9L7BtFpzBzgm"
$kajabiApiSecret = "PxVd7iZBQ2UPymvyJ4XLaL4A"

Write-Host "=== Testing Kajabi API with Secret Key Only ===" -ForegroundColor Cyan
Write-Host ""

# Test 1: Using secret as client_id
Write-Host "Test 1: Using secret as client_id..." -ForegroundColor Green
$tokenResponse1 = curl.exe -X POST "https://api.kajabi.com/v1/oauth/token" `
    -H "Content-Type: application/x-www-form-urlencoded" `
    -d "grant_type=client_credentials" `
    -d "client_id=$kajabiApiSecret" `
    -d "client_secret=$kajabiApiSecret" `
    -s

Write-Host "Response:" -ForegroundColor Yellow
Write-Host $tokenResponse1
Write-Host ""

# Test 2: Using secret as both client_id and client_secret, but also try with empty client_id
Write-Host "Test 2: Using secret as client_secret only (no client_id)..." -ForegroundColor Green
$tokenResponse2 = curl.exe -X POST "https://api.kajabi.com/v1/oauth/token" `
    -H "Content-Type: application/x-www-form-urlencoded" `
    -d "grant_type=client_credentials" `
    -d "client_secret=$kajabiApiSecret" `
    -s

Write-Host "Response:" -ForegroundColor Yellow
Write-Host $tokenResponse2
Write-Host ""

# Test 3: Using secret in Authorization header (Bearer token style)
Write-Host "Test 3: Using secret as Bearer token..." -ForegroundColor Green
$tokenResponse3 = curl.exe -X POST "https://api.kajabi.com/v1/oauth/token" `
    -H "Content-Type: application/x-www-form-urlencoded" `
    -H "Authorization: Bearer $kajabiApiSecret" `
    -d "grant_type=client_credentials" `
    -s

Write-Host "Response:" -ForegroundColor Yellow
Write-Host $tokenResponse3
Write-Host ""

# Test 4: Using secret in Basic Auth (secret as password, empty username)
Write-Host "Test 4: Using secret in Basic Auth (empty username)..." -ForegroundColor Green
$bytes = [System.Text.Encoding]::UTF8.GetBytes(":$kajabiApiSecret")
$base64 = [System.Convert]::ToBase64String($bytes)
$authHeader = "Basic $base64"

$tokenResponse4 = curl.exe -X POST "https://api.kajabi.com/v1/oauth/token" `
    -H "Authorization: $authHeader" `
    -H "Content-Type: application/x-www-form-urlencoded" `
    -d "grant_type=client_credentials" `
    -s

Write-Host "Response:" -ForegroundColor Yellow
Write-Host $tokenResponse4
Write-Host ""

# Test 5: Using secret as client_id, empty client_secret
Write-Host "Test 5: Using secret as client_id, empty client_secret..." -ForegroundColor Green
$tokenResponse5 = curl.exe -X POST "https://api.kajabi.com/v1/oauth/token" `
    -H "Content-Type: application/x-www-form-urlencoded" `
    -d "grant_type=client_credentials" `
    -d "client_id=$kajabiApiSecret" `
    -s

Write-Host "Response:" -ForegroundColor Yellow
Write-Host $tokenResponse5
Write-Host ""

# Check if any succeeded
$allResponses = @($tokenResponse1, $tokenResponse2, $tokenResponse3, $tokenResponse4, $tokenResponse5)
$success = $false

foreach ($response in $allResponses) {
    $data = $response | ConvertFrom-Json -ErrorAction SilentlyContinue
    if ($data -and $data.access_token) {
        $success = $true
        Write-Host "SUCCESS! Found working method!" -ForegroundColor Green
        Write-Host "Access Token: $($data.access_token.Substring(0, 20))..." -ForegroundColor Gray
        break
    }
}

if (-not $success) {
    Write-Host "All methods failed. Secret-only authentication is not supported." -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Test Complete ===" -ForegroundColor Cyan
