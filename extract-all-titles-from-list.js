// Browser console script to extract ALL session titles from the sessions list page
// Run this on: https://www.birchandstonecoaching.com/coaching/groups/plan-your-week-sundays-730am-et/sessions
// This extracts all 53 titles at once!

(function() {
  console.log('🔍 Extracting all session titles from list page...\n');
  
  // Find all session list items
  const sessionLinks = Array.from(document.querySelectorAll('a.coaching-programs__session-list-item'));
  
  if (sessionLinks.length === 0) {
    console.error('❌ No session links found! Make sure you are on the sessions list page.');
    return;
  }
  
  console.log(`✅ Found ${sessionLinks.length} sessions\n`);
  
  // Extract title and URL for each session
  const sessions = sessionLinks.map((link, index) => {
    // Get the span text (title)
    const span = link.querySelector('span');
    const title = span ? span.textContent.trim() : 'No title found';
    
    // Get the href and extract session ID
    const href = link.getAttribute('href') || '';
    const urlMatch = href.match(/\/sessions\/(\d+)/);
    const sessionId = urlMatch ? urlMatch[1] : null;
    
    // Build full URL
    const fullUrl = href.startsWith('http') 
      ? href 
      : `https://www.birchandstonecoaching.com${href}`;
    
    return {
      index: index + 1,
      session_id: sessionId,
      title: title,
      url: fullUrl,
      href: href
    };
  });
  
  // Display results
  console.log('📋 Extracted Sessions:\n');
  sessions.forEach(session => {
    console.log(`${session.index}. [${session.session_id}] ${session.title}`);
  });
  
  // Generate SQL UPDATE statements
  console.log('\n\n📝 SQL UPDATE Statements:\n');
  const sqlStatements = sessions.map(session => {
    const escapedTitle = session.title.replace(/'/g, "''");
    return `UPDATE public.recorded_sessions 
SET title = '${escapedTitle}'
WHERE video_url LIKE '%${session.session_id}%';`;
  });
  
  console.log(sqlStatements.join('\n\n'));
  
  // Generate batch SQL (CASE statement)
  console.log('\n\n📝 Batch SQL (Single Statement):\n');
  const batchSql = `UPDATE public.recorded_sessions 
SET title = CASE 
${sessions.map(session => {
    const escapedTitle = session.title.replace(/'/g, "''");
    return `  WHEN video_url LIKE '%${session.session_id}%' THEN '${escapedTitle}'`;
  }).join('\n')}
  ELSE title
END
WHERE course_id = '00000000-0000-0000-0000-000000000001'::uuid;`;
  
  console.log(batchSql);
  
  // Create JSON for easy copying
  const jsonData = {
    total_sessions: sessions.length,
    sessions: sessions,
    sql_batch: batchSql
  };
  
  console.log('\n\n📋 JSON Data:\n');
  console.log(JSON.stringify(jsonData, null, 2));
  
  // Copy batch SQL to clipboard
  if (navigator.clipboard) {
    navigator.clipboard.writeText(batchSql).then(() => {
      console.log('\n✅ Copied batch SQL to clipboard!');
      console.log('You can now paste it directly into Supabase SQL Editor.');
    }).catch(err => {
      console.error('❌ Failed to copy to clipboard:', err);
      console.log('\n📋 Copy the batch SQL above manually');
    });
  }
  
  // Highlight all session links
  sessionLinks.forEach(link => {
    link.style.outline = '2px solid green';
    link.style.backgroundColor = 'rgba(0, 255, 0, 0.1)';
  });
  console.log('\n✅ Highlighted all session links on the page (green outline)');
  
  return {
    sessions,
    sql_batch: batchSql,
    sql_statements: sqlStatements
  };
})();
