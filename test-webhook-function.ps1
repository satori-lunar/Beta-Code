# Test the Supabase webhook function directly
# Replace [your-project] with your actual Supabase project reference

$supabaseUrl = "https://qbsrmbxuwacpqquorqaq.supabase.co"
$functionUrl = "$supabaseUrl/functions/v1/receive-kajabi-webhook"

Write-Host "=== Testing Supabase Webhook Function ===" -ForegroundColor Cyan
Write-Host "URL: $functionUrl" -ForegroundColor Gray
Write-Host ""

# Test payload (simulating what Zapier would send)
$testPayload = @{
    product = @{
        id = "test-product-123"
        name = "Test Product from Zapier"
        description = "This is a test product to verify the webhook works"
        url = "https://example.com/products/test-product"
        hero_image_url = "https://example.com/image.jpg"
        thumbnail_url = "https://example.com/thumb.jpg"
    }
} | ConvertTo-Json -Depth 10

Write-Host "Sending test payload..." -ForegroundColor Green
Write-Host "Payload: $testPayload" -ForegroundColor Gray
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $functionUrl `
        -Method Post `
        -ContentType "application/json" `
        -Body $testPayload `
        -ErrorAction Stop
    
    Write-Host "SUCCESS!" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Yellow
    $response | ConvertTo-Json -Depth 10 | Write-Host
    
    Write-Host ""
    Write-Host "Check your Supabase database:" -ForegroundColor Cyan
    Write-Host "  SELECT * FROM recorded_sessions WHERE kajabi_product_id = 'test-product-123';" -ForegroundColor Gray
    
} catch {
    Write-Host "ERROR!" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Message: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.ErrorDetails.Message) {
        Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== Test Complete ===" -ForegroundColor Cyan
