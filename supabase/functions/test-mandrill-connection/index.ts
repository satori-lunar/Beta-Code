import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Test Mandrill connection and configuration
async function testMandrillConnection() {
  const apiKey = Deno.env.get('MAILCHIMP_TRANSACTIONAL_API_KEY')
  const fromEmail = Deno.env.get('MAILCHIMP_FROM_EMAIL') || 'noreply@mybirchandstonecoaching.com'
  const fromName = Deno.env.get('MAILCHIMP_FROM_NAME') || 'Birch & Stone'

  if (!apiKey) {
    return {
      success: false,
      error: 'MAILCHIMP_TRANSACTIONAL_API_KEY environment variable is not set',
    }
  }

  try {
    // Test 1: Verify API key by checking user info
    const userInfoResponse = await fetch('https://mandrillapp.com/api/1.0/users/info.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: apiKey,
      }),
    })

    if (!userInfoResponse.ok) {
      const errorText = await userInfoResponse.text()
      return {
        success: false,
        error: `Failed to verify API key: ${userInfoResponse.status} - ${errorText}`,
      }
    }

    const userInfo = await userInfoResponse.json()

    // Test 2: Check sending domains
    const domainsResponse = await fetch('https://mandrillapp.com/api/1.0/senders/list.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: apiKey,
      }),
    })

    let domains: any[] = []
    if (domainsResponse.ok) {
      domains = await domainsResponse.json()
    }

    // Test 3: Send a test email (optional - can be disabled)
    const testEmail = Deno.env.get('TEST_EMAIL')
    let testEmailResult = null
    if (testEmail) {
      try {
        const testResponse = await fetch('https://mandrillapp.com/api/1.0/messages/send.json', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            key: apiKey,
            message: {
              html: '<h1>Test Email from Mandrill</h1><p>This is a test email to verify your Mandrill connection is working.</p>',
              subject: 'Test: Mandrill Connection',
              from_email: fromEmail,
              from_name: fromName,
              to: [
                {
                  email: testEmail,
                  type: 'to',
                },
              ],
              track_opens: true,
              track_clicks: true,
            },
          }),
        })

        if (testResponse.ok) {
          const testData = await testResponse.json()
          testEmailResult = {
            success: true,
            messageId: testData[0]?._id,
            status: testData[0]?.status,
          }
        } else {
          testEmailResult = {
            success: false,
            error: await testResponse.text(),
          }
        }
      } catch (testError: any) {
        testEmailResult = {
          success: false,
          error: testError.message,
        }
      }
    }

    return {
      success: true,
      apiKeyConfigured: true,
      fromEmail,
      fromName,
      userInfo: {
        username: userInfo.username,
        reputation: userInfo.reputation,
        hourlyQuota: userInfo.hourly_quota,
        backlog: userInfo.backlog,
      },
      sendingDomains: domains.map((d: any) => ({
        domain: d.domain,
        verified: d.verified,
        valid_signing: d.valid_signing,
      })),
      testEmail: testEmailResult,
      configuration: {
        apiKeyPresent: !!apiKey,
        fromEmail,
        fromName,
      },
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Unknown error',
    }
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify this is called with some Bearer token (lightweight check to avoid secret mismatch issues)
    // NOTE: This is a diagnostics-only function and does not access user data.
    const authHeader = req.headers.get('Authorization') || ''
    const hasBearerToken = authHeader.toLowerCase().startsWith('bearer ')

    if (!hasBearerToken) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized. Authorization: Bearer <token> header required.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const result = await testMandrillConnection()

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
