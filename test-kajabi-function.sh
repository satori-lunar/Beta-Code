#!/bin/bash
# Test script for Kajabi sync function
# Run this to test if the function is deployed and working

SUPABASE_URL="https://qbsrmbxuwacpqquorqaq.supabase.co"
ANON_KEY="sb_publishable_7gzuByfAfjneqR2O_u-eLQ_FltzyIX3"
FUNCTION_NAME="sync-kajabi-products"

echo "🔍 Testing Kajabi Sync Function..."
echo "=================================="
echo ""

# Test 1: Check if function endpoint is accessible
echo "Test 1: Checking if function exists..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
  -X POST \
  "${SUPABASE_URL}/functions/v1/${FUNCTION_NAME}" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json")

if [ "$RESPONSE" == "404" ]; then
  echo "❌ Function not found (404) - Function may not be deployed"
  echo "   → Go to Supabase Dashboard → Edge Functions → Deploy the function"
  exit 1
elif [ "$RESPONSE" == "401" ] || [ "$RESPONSE" == "403" ]; then
  echo "⚠️  Authentication issue ($RESPONSE) - Check your API key"
elif [ "$RESPONSE" == "200" ] || [ "$RESPONSE" == "500" ]; then
  echo "✅ Function exists and is accessible (HTTP $RESPONSE)"
else
  echo "⚠️  Unexpected response: HTTP $RESPONSE"
fi

echo ""

# Test 2: Try to invoke the function
echo "Test 2: Invoking the function..."
echo "--------------------------------"
FULL_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" \
  -X POST \
  "${SUPABASE_URL}/functions/v1/${FUNCTION_NAME}" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json")

HTTP_CODE=$(echo "$FULL_RESPONSE" | grep "HTTP_CODE:" | cut -d: -f2)
BODY=$(echo "$FULL_RESPONSE" | sed '/HTTP_CODE:/d')

echo "HTTP Status: $HTTP_CODE"
echo ""
echo "Response Body:"
echo "$BODY" | jq . 2>/dev/null || echo "$BODY"
echo ""

# Test 3: Check function logs (if possible)
echo "Test 3: Check function logs in Supabase Dashboard"
echo "   → Go to: https://supabase.com/dashboard/project/qbsrmbxuwacpqquorqaq/functions/${FUNCTION_NAME}/logs"
echo ""

# Summary
if [ "$HTTP_CODE" == "200" ]; then
  echo "✅ SUCCESS: Function is working!"
elif [ "$HTTP_CODE" == "500" ]; then
  echo "⚠️  Function exists but returned an error (500)"
  echo "   → Check the response body above for error details"
  echo "   → Check function logs in Supabase Dashboard"
elif [ "$HTTP_CODE" == "404" ]; then
  echo "❌ Function not deployed"
  echo "   → Follow DEPLOY_KAJABI_FUNCTION.md to deploy it"
else
  echo "⚠️  Unexpected status: $HTTP_CODE"
  echo "   → Check the response body above"
fi
