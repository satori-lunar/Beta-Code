// Browser console script to extract titles from multiple session pages
// This script helps you collect titles from all sessions
// Run this on EACH session page, then copy the results

(function() {
  console.log('🔍 Extracting session title...\n');
  
  // Look for span with title
  const spans = Array.from(document.querySelectorAll('span'));
  const titleSpan = spans.find(span => {
    const text = span.textContent.trim();
    return text.includes('Plan My Week') || 
           text.includes('Weekly Work Session') ||
           (text.length > 15 && text.length < 80 && !text.match(/^\d+$/));
  });
  
  // Fallback to h1, h2, or page title
  const h1 = document.querySelector('h1');
  const h2 = document.querySelector('h2');
  const pageTitle = document.title;
  
  const currentUrl = window.location.href;
  const urlMatch = currentUrl.match(/\/sessions\/(\d+)/);
  const sessionId = urlMatch ? urlMatch[1] : null;
  
  // Extract title
  let extractedTitle = null;
  
  if (titleSpan) {
    extractedTitle = titleSpan.textContent.trim();
  } else if (h1) {
    extractedTitle = h1.textContent.trim();
  } else if (h2) {
    extractedTitle = h2.textContent.trim();
  } else {
    extractedTitle = pageTitle.replace(' | Birch & Stone Coaching', '').trim();
  }
  
  // Create result object
  const result = {
    session_id: sessionId,
    url: currentUrl,
    title: extractedTitle,
    found_in: titleSpan ? 'span' : h1 ? 'h1' : h2 ? 'h2' : 'page_title'
  };
  
  console.log('✅ Extracted:');
  console.log(`Session ${sessionId}: ${extractedTitle}`);
  console.log('\n📋 JSON:');
  console.log(JSON.stringify(result, null, 2));
  
  // Highlight the found element
  if (titleSpan) {
    titleSpan.style.outline = '3px solid green';
    titleSpan.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
    console.log('\n📍 Highlighted the title span element on the page');
  }
  
  // Copy SQL to clipboard
  if (navigator.clipboard) {
    const sqlUpdate = `UPDATE public.recorded_sessions 
SET title = '${extractedTitle.replace(/'/g, "''")}'
WHERE video_url = '${currentUrl}';`;
    
    navigator.clipboard.writeText(sqlUpdate).then(() => {
      console.log('\n✅ Copied SQL UPDATE to clipboard!');
    }).catch(() => {
      console.log('\n📋 SQL UPDATE:');
      console.log(sqlUpdate);
    });
  }
  
  return result;
})();
