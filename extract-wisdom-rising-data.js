// ============================================
// EXTRACT WISDOM RISING SESSION DATA
// ============================================
// Paste this code into your browser's Developer Console (F12)
// Navigate to the Wisdom Rising class page first, then run this code

(function() {
  console.log('🔍 Starting Wisdom Rising data extraction...');
  
  // Function to extract session data from the page
  function extractSessionData() {
    const sessions = [];
    
    // Method 1: Try to find session links/buttons on the page
    const sessionElements = document.querySelectorAll('a[href*="wisdom-rising"], a[href*="session"], [data-session-id], .session-item, .session-link');
    
    sessionElements.forEach((el, index) => {
      const href = el.href || el.getAttribute('href') || '';
      const title = el.textContent?.trim() || el.getAttribute('title') || el.getAttribute('data-title') || `Session ${index + 1}`;
      const sessionId = el.getAttribute('data-session-id') || href.match(/sessions\/(\d+)/)?.[1] || '';
      
      if (href && href.includes('session')) {
        sessions.push({
          title: title,
          sessionId: sessionId,
          url: href,
          description: el.getAttribute('data-description') || 'Wisdom Rising - Session Recording'
        });
      }
    });
    
    // Method 2: Check for any data attributes or JSON in the page
    const scripts = document.querySelectorAll('script[type="application/json"], script[data-sessions]');
    scripts.forEach(script => {
      try {
        const data = JSON.parse(script.textContent);
        if (Array.isArray(data)) {
          data.forEach(item => {
            if (item.url || item.href || item.sessionId) {
              sessions.push({
                title: item.title || item.name || 'Wisdom Rising Session',
                sessionId: item.sessionId || item.id || '',
                url: item.url || item.href || '',
                description: item.description || 'Wisdom Rising - Session Recording'
              });
            }
          });
        }
      } catch (e) {
        // Not JSON, skip
      }
    });
    
    // Method 3: Monitor network requests for session data
    console.log('📡 Monitoring network requests...');
    console.log('💡 Tip: Navigate through the Wisdom Rising sessions page to capture API calls');
    
    return sessions;
  }
  
  // Function to intercept fetch requests
  const originalFetch = window.fetch;
  const capturedRequests = [];
  
  window.fetch = function(...args) {
    const url = args[0];
    if (typeof url === 'string' && (url.includes('session') || url.includes('wisdom') || url.includes('api'))) {
      console.log('🌐 Captured request:', url);
      capturedRequests.push({
        url: url,
        timestamp: new Date().toISOString()
      });
    }
    return originalFetch.apply(this, args);
  };
  
  // Function to intercept XMLHttpRequest
  const originalXHROpen = XMLHttpRequest.prototype.open;
  const originalXHRSend = XMLHttpRequest.prototype.send;
  const xhrRequests = [];
  
  XMLHttpRequest.prototype.open = function(method, url, ...rest) {
    this._url = url;
    if (typeof url === 'string' && (url.includes('session') || url.includes('wisdom') || url.includes('api'))) {
      console.log('🌐 Captured XHR:', method, url);
      xhrRequests.push({
        method: method,
        url: url,
        timestamp: new Date().toISOString()
      });
    }
    return originalXHROpen.apply(this, [method, url, ...rest]);
  };
  
  XMLHttpRequest.prototype.send = function(...args) {
    if (this._url) {
      this.addEventListener('load', function() {
        if (this.responseText) {
          try {
            const data = JSON.parse(this.responseText);
            if (data.sessions || data.data || Array.isArray(data)) {
              console.log('📦 Found session data:', data);
              window._capturedSessionData = data;
            }
          } catch (e) {
            // Not JSON
          }
        }
      });
    }
    return originalXHRSend.apply(this, args);
  };
  
  // Extract initial data from page
  const initialSessions = extractSessionData();
  
  // Create output object
  const output = {
    extractedAt: new Date().toISOString(),
    pageUrl: window.location.href,
    sessions: initialSessions,
    networkRequests: {
      fetch: capturedRequests,
      xhr: xhrRequests
    },
    capturedData: window._capturedSessionData || null
  };
  
  // Display results
  console.log('✅ Extraction complete!');
  console.log('📊 Results:', output);
  console.log('\n📋 Copy the output above and paste it into a JSON file, or use the formatted output below:\n');
  
  // Format for SQL
  if (initialSessions.length > 0 || output.capturedData) {
    console.log('📝 SQL INSERT template:');
    console.log('-- Replace the session data below with your extracted data');
    console.log('-- Course ID: Use a new UUID (generate one or use: gen_random_uuid())');
    console.log('-- Session URLs: Extract from the captured data');
    console.log('\n');
  }
  
  // Store in window for easy access
  window._wisdomRisingData = output;
  
  // Instructions
  console.log('\n📖 INSTRUCTIONS:');
  console.log('1. Navigate through all Wisdom Rising sessions on the page');
  console.log('2. Check the Network tab (F12 > Network) for API calls');
  console.log('3. Look for responses containing session data');
  console.log('4. Copy the response JSON and provide it to the assistant');
  console.log('5. Access captured data anytime with: window._wisdomRisingData');
  console.log('\n💡 TIP: Open Network tab, filter by "XHR" or "Fetch", then navigate the sessions page');
  
  return output;
})();
