# Test Kajabi API with swapped keys (maybe they're reversed)
$key1 = "zThg3LJbBrPS9L7BtFpzBzgm"
$key2 = "PxVd7iZBQ2UPymvyJ4XLaL4A"

Write-Host "=== Testing Kajabi API with Swapped Keys ===" -ForegroundColor Cyan
Write-Host ""

# Test 1: Original order (key1 as client_id, key2 as client_secret)
Write-Host "Test 1: Original order (key1=client_id, key2=client_secret)..." -ForegroundColor Green
$tokenResponse1 = curl.exe -X POST "https://api.kajabi.com/v1/oauth/token" `
    -H "Content-Type: application/x-www-form-urlencoded" `
    -d "grant_type=client_credentials" `
    -d "client_id=$key1" `
    -d "client_secret=$key2" `
    -s

Write-Host "Response:" -ForegroundColor Yellow
Write-Host $tokenResponse1
Write-Host ""

# Test 2: Swapped order (key2 as client_id, key1 as client_secret)
Write-Host "Test 2: Swapped order (key2=client_id, key1=client_secret)..." -ForegroundColor Green
$tokenResponse2 = curl.exe -X POST "https://api.kajabi.com/v1/oauth/token" `
    -H "Content-Type: application/x-www-form-urlencoded" `
    -d "grant_type=client_credentials" `
    -d "client_id=$key2" `
    -d "client_secret=$key1" `
    -s

Write-Host "Response:" -ForegroundColor Yellow
Write-Host $tokenResponse2
Write-Host ""

# Check results
$data1 = $tokenResponse1 | ConvertFrom-Json -ErrorAction SilentlyContinue
$data2 = $tokenResponse2 | ConvertFrom-Json -ErrorAction SilentlyContinue

if ($data1 -and $data1.access_token) {
    Write-Host "SUCCESS with original order!" -ForegroundColor Green
    Write-Host "Access Token: $($data1.access_token.Substring(0, 20))..." -ForegroundColor Gray
} elseif ($data2 -and $data2.access_token) {
    Write-Host "SUCCESS with swapped order!" -ForegroundColor Green
    Write-Host "Access Token: $($data2.access_token.Substring(0, 20))..." -ForegroundColor Gray
    Write-Host ""
    Write-Host "NOTE: Your keys were swapped! Use:" -ForegroundColor Yellow
    Write-Host "  client_id = $key2" -ForegroundColor Gray
    Write-Host "  client_secret = $key1" -ForegroundColor Gray
} else {
    Write-Host "Both orders failed. The credentials are invalid." -ForegroundColor Red
    Write-Host ""
    Write-Host "Please verify in Kajabi Dashboard:" -ForegroundColor Yellow
    Write-Host "  Settings > Public API > Check your API keys" -ForegroundColor Gray
    Write-Host "  Make sure you copied the correct client_id and client_secret" -ForegroundColor Gray
}

Write-Host ""
Write-Host "=== Test Complete ===" -ForegroundColor Cyan
