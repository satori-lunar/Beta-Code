# Sync Kajabi sessions to Supabase from a list of URLs
# Usage: Update the $sessionUrls array below with your session URLs

$functionUrl = "https://qbsrmbxuwacpqquorqaq.supabase.co/functions/v1/sync-kajabi-sessions"

# Session URLs extracted from Kajabi
$sessionUrls = @(
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766599/details",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766600/details",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766601/details",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766602/details",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766603/details",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766604/details",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766605/details",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766606/details",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766607/details",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766608/details",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766609/details",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766610/details",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766611/details",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766612/details",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766613/details",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766614/details",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766615/details",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766616/details",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766617/details",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766618/details",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766619/details",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766620/details",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766621/details",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766622/details",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766623/details",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766624/details",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766625/details",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766626/details",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766627/details",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766628/details",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766629/details",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766630/details",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766631/details",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766632/details",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766633/details",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766634/details",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766635/details",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766636/details",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766637/details",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766638/details",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766639/details",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766640/details",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766641/details",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766642/details",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766643/details",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766644/details",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766645/details",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766646/details",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766647/details",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766648/details",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766649/details",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766650/details",
    "https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions/766651/details"
)

Write-Host "=== Syncing Kajabi Sessions to Supabase ===" -ForegroundColor Cyan
Write-Host ""

if ($sessionUrls.Count -eq 0) {
    Write-Host "⚠️  No session URLs provided!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To use this script:" -ForegroundColor Cyan
    Write-Host "1. Open the sessions page in your browser (while logged in)" -ForegroundColor Gray
    Write-Host "2. Run the extract-session-urls.js script in the browser console" -ForegroundColor Gray
    Write-Host "3. Copy the session URLs and paste them into this script" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Or provide URLs directly in the `$sessionUrls array above" -ForegroundColor Gray
    exit 1
}

Write-Host "Syncing $($sessionUrls.Count) sessions..." -ForegroundColor Green
Write-Host ""

$payload = @{
    session_urls = $sessionUrls
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri $functionUrl `
        -Method Post `
        -ContentType "application/json" `
        -Body $payload `
        -ErrorAction Stop
    
    Write-Host "✅ SUCCESS!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Results:" -ForegroundColor Cyan
    Write-Host "  Total: $($response.results.total)" -ForegroundColor Gray
    Write-Host "  Synced: $($response.results.synced)" -ForegroundColor Green
    Write-Host "  Updated: $($response.results.updated)" -ForegroundColor Yellow
    Write-Host "  Errors: $($response.results.errors)" -ForegroundColor $(if ($response.results.errors -gt 0) { "Red" } else { "Gray" })
    Write-Host ""
    Write-Host "Check your Supabase database to verify the sessions were added!" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ ERROR!" -ForegroundColor Red
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
}

Write-Host ""
Write-Host "=== Complete ===" -ForegroundColor Cyan
