# PowerShell test script for Kajabi sync function
# Run this in PowerShell to test if the function is deployed and working

$SUPABASE_URL = "https://qbsrmbxuwacpqquorqaq.supabase.co"
$ANON_KEY = "sb_publishable_7gzuByfAfjneqR2O_u-eLQ_FltzyIX3"
$FUNCTION_NAME = "sync-kajabi-products"

Write-Host "🔍 Testing Kajabi Sync Function..." -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Check if function endpoint is accessible
Write-Host "Test 1: Checking if function exists..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "${SUPABASE_URL}/functions/v1/${FUNCTION_NAME}" `
        -Method POST `
        -Headers @{
            "Authorization" = "Bearer $ANON_KEY"
            "Content-Type" = "application/json"
        } `
        -UseBasicParsing `
        -ErrorAction Stop
    
    Write-Host "✅ Function exists and is accessible (HTTP $($response.StatusCode))" -ForegroundColor Green
    Write-Host ""
    Write-Host "Response:" -ForegroundColor Yellow
    Write-Host $response.Content
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    
    if ($statusCode -eq 404) {
        Write-Host "❌ Function not found (404) - Function may not be deployed" -ForegroundColor Red
        Write-Host "   → Go to Supabase Dashboard → Edge Functions → Deploy the function" -ForegroundColor Yellow
    } elseif ($statusCode -eq 401 -or $statusCode -eq 403) {
        Write-Host "⚠️  Authentication issue ($statusCode) - Check your API key" -ForegroundColor Yellow
    } elseif ($statusCode -eq 500) {
        Write-Host "⚠️  Function exists but returned an error (500)" -ForegroundColor Yellow
        Write-Host "   → Check function logs in Supabase Dashboard" -ForegroundColor Yellow
        try {
            $errorResponse = $_.Exception.Response
            $reader = New-Object System.IO.StreamReader($errorResponse.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            Write-Host "   Error details: $responseBody" -ForegroundColor Red
        } catch {
            Write-Host "   Could not read error details" -ForegroundColor Red
        }
    } else {
        Write-Host "⚠️  Unexpected response: HTTP $statusCode" -ForegroundColor Yellow
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Test 2: Check function logs in Supabase Dashboard" -ForegroundColor Yellow
Write-Host "   → Go to: https://supabase.com/dashboard/project/qbsrmbxuwacpqquorqaq/functions/${FUNCTION_NAME}/logs" -ForegroundColor Cyan
Write-Host ""

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Troubleshooting Tips:" -ForegroundColor Yellow
Write-Host "1. Make sure the function is deployed in Supabase Dashboard" -ForegroundColor White
Write-Host "2. Check that environment secrets are set (KAJABI_API_KEY, etc.)" -ForegroundColor White
Write-Host "3. Verify the function name is exactly: sync-kajabi-products" -ForegroundColor White
Write-Host "4. Check function logs for detailed error messages" -ForegroundColor White
