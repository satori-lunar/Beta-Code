// Browser console script to extract session title from Kajabi session page
// Run this in the browser console while on a session details page
// Finds the span element that contains the session title

(function() {
  console.log('🔍 Extracting session title...\n');
  
  // Method 1: Look for spans that might contain the title
  // Look for spans with meaningful text (not just numbers or single words)
  const allSpans = Array.from(document.querySelectorAll('span'));
  
  // Filter spans that could be titles:
  // - Length between 10-100 characters
  // - Not just numbers
  // - Not just single words
  // - Contains some meaningful text
  const potentialTitleSpans = allSpans
    .map(span => ({
      element: span,
      text: span.textContent.trim(),
      length: span.textContent.trim().length
    }))
    .filter(item => 
      item.length >= 10 && 
      item.length <= 100 &&
      !item.text.match(/^\d+$/) && // Not just numbers
      !item.text.match(/^[a-z]+$/i) && // Not just single word
      item.text.split(/\s+/).length >= 2 // Has multiple words
    )
    .sort((a, b) => b.length - a.length); // Sort by length (longer = more likely to be title)
  
  // Method 2: Look for spans in common title locations
  // Check spans near headings, in main content areas, etc.
  const titleSpan = potentialTitleSpans.length > 0 ? potentialTitleSpans[0].element : null;
  
  // Method 3: Look for spans with specific classes/attributes that might indicate title
  const spansWithClasses = allSpans.filter(span => {
    const classes = span.className || '';
    const id = span.id || '';
    return classes.includes('title') || 
           classes.includes('heading') || 
           classes.includes('name') ||
           id.includes('title') ||
           id.includes('heading');
  });
  
  // If we found spans with title-related classes, prefer those
  const classBasedTitleSpan = spansWithClasses.length > 0 
    ? spansWithClasses.find(span => {
        const text = span.textContent.trim();
        return text.length >= 10 && text.length <= 100;
      })
    : null;
  
  // Method 3: Look for h1, h2, or main heading
  const h1 = document.querySelector('h1');
  const h2 = document.querySelector('h2');
  const pageTitle = document.title;
  
  // Get the current URL
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
  } else if (potentialTitles.length > 0) {
    // Use the longest potential title
    extractedTitle = potentialTitles.sort((a, b) => b.length - a.length)[0];
  } else {
    extractedTitle = pageTitle.replace(' | Birch & Stone Coaching', '').trim();
  }
  
  const result = {
    url: currentUrl,
    session_id: sessionId,
    extracted_title: extractedTitle,
    found_in: foundSpan ? 'span' : h1 ? 'h1' : h2 ? 'h2' : 'page_title',
    title_span_text: foundSpan ? foundSpan.textContent.trim() : null,
    h1: h1 ? h1.textContent.trim() : null,
    h2: h2 ? h2.textContent.trim() : null,
    page_title: pageTitle,
    potential_titles: potentialTitleSpans.slice(0, 5).map(item => item.text), // Top 5 potential titles
  };
  
  console.log('✅ Extracted title:\n');
  console.log('Title:', extractedTitle);
  console.log('Found in:', result.found_in);
  console.log('\n📋 Full result:');
  console.log(JSON.stringify(result, null, 2));
  
  // Show the span element if found
  if (foundSpan) {
    console.log('\n📍 Found title span element:');
    console.log(foundSpan);
    foundSpan.style.outline = '3px solid green';
    foundSpan.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
    console.log('✅ Highlighted the span element on the page (green outline)');
  }
  
  // Also show all potential title spans for debugging
  if (potentialTitleSpans.length > 1) {
    console.log('\n📋 Other potential titles found:');
    potentialTitleSpans.slice(1, 6).forEach((item, i) => {
      console.log(`${i + 2}. "${item.text}" (${item.length} chars)`);
    });
  }
  
  // Copy to clipboard
  if (navigator.clipboard) {
    const sqlUpdate = `UPDATE public.recorded_sessions 
SET title = '${extractedTitle.replace(/'/g, "''")}'
WHERE video_url = '${currentUrl}';`;
    
    navigator.clipboard.writeText(sqlUpdate).then(() => {
      console.log('\n✅ Copied SQL UPDATE statement to clipboard!');
      console.log('\n📋 SQL:');
      console.log(sqlUpdate);
    }).catch(err => {
      console.error('❌ Failed to copy to clipboard:', err);
      console.log('\n📋 SQL UPDATE statement:');
      console.log(sqlUpdate);
    });
  }
  
  return result;
})();
