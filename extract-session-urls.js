// Browser console script to extract session URLs from Kajabi sessions page
// Run this in the browser console while on the sessions page

(function() {
  console.log('🔍 Extracting session URLs...\n');
  
  // Method 1: Find all links containing "/sessions/"
  const sessionLinks = Array.from(document.querySelectorAll('a[href*="/sessions/"]'));
  
  // Method 2: Find links in session cards/containers
  const sessionCards = document.querySelectorAll('[class*="session"], [id*="session"], [data-session]');
  
  // Method 3: Find all links and filter for session URLs
  const allLinks = Array.from(document.querySelectorAll('a[href]'));
  const sessionUrls = allLinks
    .map(link => link.href)
    .filter(url => url.includes('/sessions/') && !url.includes('/sessions') || url.match(/\/sessions\/[^\/]+$/))
    .filter((v, i, a) => a.indexOf(v) === i); // Remove duplicates
  
  // Combine all methods
  const allSessionUrls = [
    ...sessionLinks.map(link => link.href),
    ...sessionUrls
  ].filter((v, i, a) => a.indexOf(v) === i); // Remove duplicates
  
  console.log(`✅ Found ${allSessionUrls.length} unique session URLs:\n`);
  allSessionUrls.forEach((url, i) => {
    console.log(`${i + 1}. ${url}`);
  });
  
  // Create JSON payload for Supabase function
  const payload = {
    session_urls: allSessionUrls
  };
  
  const jsonPayload = JSON.stringify(payload, null, 2);
  
  // Copy to clipboard
  if (navigator.clipboard) {
    navigator.clipboard.writeText(jsonPayload).then(() => {
      console.log('\n✅ Copied JSON payload to clipboard!');
      console.log('\n📋 You can now paste this into the sync function or use it in PowerShell/curl');
    }).catch(err => {
      console.error('❌ Failed to copy to clipboard:', err);
      console.log('\n📋 JSON payload:');
      console.log(jsonPayload);
    });
  } else {
    console.log('\n📋 JSON payload:');
    console.log(jsonPayload);
  }
  
  // Also create a simple array for easy copying
  const simpleArray = JSON.stringify(allSessionUrls, null, 2);
  console.log('\n📋 Simple array format:');
  console.log(simpleArray);
  
  return allSessionUrls;
})();
