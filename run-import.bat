@echo off
echo ========================================
echo Import Contacts to Supabase
echo ========================================
echo.
echo Please enter your Supabase Service Role Key:
echo (You can find this in Supabase Dashboard - Settings - API)
echo.
set /p SERVICE_KEY="Service Role Key: "

if "%SERVICE_KEY%"=="" (
    echo Error: Service Role Key is required!
    pause
    exit /b 1
)

echo.
echo Setting environment variable...
set SUPABASE_SERVICE_ROLE_KEY=%SERVICE_KEY%

echo.
echo Starting import...
call npm run import-contacts-csv

echo.
echo ========================================
echo Import completed!
echo ========================================
pause
