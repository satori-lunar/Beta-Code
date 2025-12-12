# Test the direct Kajabi sync function
$functionUrl = "https://qbsrmbxuwacpqquorqaq.supabase.co/functions/v1/sync-kajabi-direct"

Write-Host "=== Testing Direct Kajabi Sync Function ===" -ForegroundColor Cyan
Write-Host "URL: $functionUrl" -ForegroundColor Gray
Write-Host ""
Write-Host "Note: Make sure you've set KAJABI_API_KEY and KAJABI_API_SECRET in Supabase Edge Function secrets!" -ForegroundColor Yellow
Write-Host ""

try {
    Write-Host "Calling function..." -ForegroundColor Green
    $response = Invoke-RestMethod -Uri $functionUrl `
        -Method Get `
        -ContentType "application/json" `
        -ErrorAction Stop
    
    Write-Host "SUCCESS!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Response:" -ForegroundColor Yellow
    $response | ConvertTo-Json -Depth 10 | Write-Host
    
    if ($response.results) {
        Write-Host ""
        Write-Host "Sync Results:" -ForegroundColor Cyan
        Write-Host "  Total products: $($response.results.total)" -ForegroundColor Gray
        Write-Host "  Products with URLs: $($response.results.withUrls)" -ForegroundColor Gray
        Write-Host "  Newly synced: $($response.results.synced)" -ForegroundColor Green
        Write-Host "  Updated: $($response.results.updated)" -ForegroundColor Yellow
        Write-Host "  Errors: $($response.results.errors)" -ForegroundColor $(if ($response.results.errors -gt 0) { "Red" } else { "Gray" })
        Write-Host "  Skipped (no URL): $($response.results.skipped)" -ForegroundColor Gray
    }
    
    Write-Host ""
    Write-Host "Check your Supabase database:" -ForegroundColor Cyan
    Write-Host "  SELECT * FROM recorded_sessions WHERE synced_from_kajabi = true ORDER BY created_at DESC LIMIT 10;" -ForegroundColor Gray
    
} catch {
    Write-Host "ERROR!" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Message: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.ErrorDetails.Message) {
        Write-Host ""
        Write-Host "Error Details:" -ForegroundColor Red
        $errorData = $_.ErrorDetails.Message | ConvertFrom-Json -ErrorAction SilentlyContinue
        if ($errorData) {
            $errorData | ConvertTo-Json -Depth 10 | Write-Host
        } else {
            Write-Host $_.ErrorDetails.Message -ForegroundColor Red
        }
    }
    
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "  1. Check that KAJABI_API_KEY and KAJABI_API_SECRET are set in Supabase Edge Function secrets" -ForegroundColor Gray
    Write-Host "  2. Verify your API credentials are correct in Kajabi Dashboard" -ForegroundColor Gray
    Write-Host "  3. Check Supabase function logs for more details" -ForegroundColor Gray
}

Write-Host ""
Write-Host "=== Test Complete ===" -ForegroundColor Cyan
