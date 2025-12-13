# Import Contacts Script for PowerShell
# This script imports contacts from CSV into Supabase

param(
    [Parameter(Mandatory=$true)]
    [string]$ServiceRoleKey,
    
    [Parameter(Mandatory=$false)]
    [string]$CsvPath = "C:\Users\jenni\Downloads\site_2147540980_contacts_d082236a-ec76-4857-aae5-097a32e2a0ce_complete.csv"
)

# Set the environment variable
$env:SUPABASE_SERVICE_ROLE_KEY = $ServiceRoleKey

# Run the import script
Write-Host "Starting contact import..." -ForegroundColor Green
Write-Host "CSV Path: $CsvPath" -ForegroundColor Cyan
Write-Host ""

npm run import-contacts $CsvPath
