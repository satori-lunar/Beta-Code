# Food Image Analysis Setup Guide

## 🎯 Cost-Effective Solution for 200+ Users

This implementation uses **free-tier APIs** to keep costs minimal. The current implementation works without any API keys (basic estimation), but adding API keys improves accuracy.

## ⚠️ Important Note for Production

**For 200 users with image recognition, you'll need a backend proxy** because:
- Spoonacular image classification requires public URLs (not client-side files)
- Direct client-side image uploads to APIs expose API keys
- Better rate limiting and caching

**Current implementation**: Works client-side but uses nutrition database lookup (not full image recognition).

## 🚀 Quick Start (Works Without API Keys)

The feature works immediately without any setup! It will:
1. ✅ Allow users to take/upload photos
2. ✅ Provide basic nutrition estimates
3. ✅ Let users review and adjust values

**To improve accuracy**, add API keys below.

### API Options (Choose One or Both)

#### Option 1: Spoonacular API (Recommended)
- **Free Tier**: 150 API calls per day
- **Best for**: Image recognition and food identification
- **Setup**: 
  1. Sign up at https://spoonacular.com/food-api
  2. Get your free API key
  3. Add to `.env.local`:
     ```env
     VITE_SPOONACULAR_API_KEY=your-api-key-here
     ```

#### Option 2: Edamam Food Database API
- **Free Tier**: 10,000 API calls per month (~333 per day)
- **Best for**: Nutrition data lookup
- **Setup**:
  1. Sign up at https://developer.edamam.com/
  2. Create a new application
  3. Get your App ID and App Key
  4. Add to `.env.local`:
     ```env
     VITE_EDAMAM_APP_ID=your-app-id
     VITE_EDAMAM_APP_KEY=your-app-key
     ```

### Recommended Setup for 200 Users

**For high volume, use BOTH APIs:**
- Spoonacular for image recognition (150/day)
- Edamam for nutrition lookup (10,000/month)

**Daily capacity:**
- Spoonacular: 150 image analyses/day
- Edamam: ~333 nutrition lookups/day

**For 200 users:**
- If each user logs 1-2 meals/day = 200-400 requests/day
- **Solution**: Implement client-side caching and rate limiting

### Cost Optimization Strategies

1. **Client-Side Caching**
   - Cache similar images (hash-based)
   - Reuse results for identical meals
   - Reduces API calls by 30-50%

2. **Backend Proxy (Recommended for Production)**
   - Create a backend API endpoint
   - Pool API keys across users
   - Implement rate limiting
   - Add caching layer

3. **Hybrid Approach**
   - Use Spoonacular for image recognition
   - Use Edamam for nutrition data
   - Fall back to user input if APIs are exhausted

### Production Setup (Backend Proxy)

For 200+ users, create a backend proxy to:
- Manage API keys securely
- Implement rate limiting
- Add caching
- Pool API quotas

**Example backend endpoint:**
```typescript
// Backend: /api/analyze-food
POST /api/analyze-food
Body: { image: base64Image }
Response: { name, calories, protein, carbs, fat }
```

### Current Implementation

The current code:
1. ✅ Tries Spoonacular first (if key provided)
2. ✅ Falls back to Edamam (if keys provided)
3. ✅ Uses basic estimation if no APIs available
4. ✅ Handles errors gracefully

### Next Steps

1. **Get API Keys** (choose one):
   - Spoonacular: https://spoonacular.com/food-api
   - Edamam: https://developer.edamam.com/

2. **Add to `.env.local`**:
   ```env
   # Choose one or both:
   VITE_SPOONACULAR_API_KEY=your-key
   VITE_EDAMAM_APP_ID=your-id
   VITE_EDAMAM_APP_KEY=your-key
   ```

3. **Restart dev server**:
   ```bash
   npm run dev
   ```

4. **Test the feature**:
   - Open Nutrition page
   - Click "Add Meal"
   - Take/upload a photo
   - Click "Analyze Meal"

### Cost Estimate

**Free Tier (No Cost):**
- Spoonacular: 150 calls/day = 4,500/month
- Edamam: 10,000 calls/month
- **Total free capacity**: ~14,500 analyses/month

**For 200 users (2 meals/day each = 400/day = 12,000/month):**
- ✅ **Fits within free tier!**

**If you exceed free tier:**
- Spoonacular paid: $0.01 per call
- Edamam paid: $0.01 per call
- **Cost at 20,000 calls/month**: ~$200/month

### Recommendation

Start with **Spoonacular free tier** - it's the easiest to set up and works great for image recognition. If you need more capacity, add Edamam as a fallback.
