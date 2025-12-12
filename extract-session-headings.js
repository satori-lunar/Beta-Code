// Browser console script to extract H1 and H2 headings from a Kajabi session page
// Run this in the browser console while on a session details page
// Then copy the result and use it to update the session title in Supabase

(function() {
  console.log('🔍 Extracting headings from session page...\n');
  
  // Extract H1 (main heading)
  const h1 = document.querySelector('h1');
  const h1Text = h1 ? h1.textContent.trim() : null;
  
  // Extract H2 (subheadings)
  const h2s = Array.from(document.querySelectorAll('h2'));
  const h2Texts = h2s.map(h2 => h2.textContent.trim()).filter(text => text.length > 0);
  
  // Try to find the most relevant heading
  // Often the page title or main content heading
  const pageTitle = document.title;
  const metaTitle = document.querySelector('meta[property="og:title"]')?.content;
  
  // Get the current URL
  const currentUrl = window.location.href;
  
  // Extract session ID from URL
  const urlMatch = currentUrl.match(/\/sessions\/(\d+)/);
  const sessionId = urlMatch ? urlMatch[1] : null;
  
  const result = {
    url: currentUrl,
    session_id: sessionId,
    h1: h1Text,
    h2s: h2Texts,
    page_title: pageTitle,
    meta_title: metaTitle,
    suggested_title: h1Text || h2Texts[0] || pageTitle || 'Session ' + sessionId
  };
  
  console.log('✅ Extracted headings:\n');
  console.log(JSON.stringify(result, null, 2));
  
  // Copy to clipboard
  if (navigator.clipboard) {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2)).then(() => {
      console.log('\n✅ Copied to clipboard!');
      console.log('\n📋 Suggested title:', result.suggested_title);
    }).catch(err => {
      console.error('❌ Failed to copy to clipboard:', err);
    });
  }
  
  return result;
})();
