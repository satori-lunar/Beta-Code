# Google Maps API Setup Guide

To use the map feature in outdoor workouts, you'll need to set up a Google Maps API key.

## Step 1: Get a Google Cloud Account
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Create a new project (or select an existing one)

## Step 2: Enable Required APIs
1. In the Google Cloud Console, go to **APIs & Services** > **Library**
2. Search for and enable these APIs:
   - **Maps JavaScript API**
   - **Places API**

## Step 3: Create API Key
1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **API Key**
3. Copy your API key
4. (Recommended) Click **Restrict Key** to:
   - Restrict to specific APIs (Maps JavaScript API and Places API)
   - Restrict to HTTP referrers (your domain)

## Step 4: Add to Your Project
1. Create a `.env` file in the root of your project (if it doesn't exist)
2. Add this line:
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```
3. Replace `your_api_key_here` with your actual API key

## Step 5: Restart Your Dev Server
After adding the API key, restart your development server:
```bash
npm run dev
```

## Cost Information
- Google Maps offers a **$200 free credit per month**
- This covers approximately:
  - 28,000 map loads
  - 40,000 place autocomplete requests
- For most personal/small projects, this should be sufficient

## Troubleshooting
- **Map not showing?** Check that the API key is correct and APIs are enabled
- **Search not working?** Make sure Places API is enabled
- **"This page can't load Google Maps correctly"** - Check API key restrictions

## Security Note
Never commit your `.env` file to version control. The `.env` file is already in `.gitignore`.

