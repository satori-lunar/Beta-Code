// Direct Kajabi API Test Script (Node.js version)
// Run with: node test-kajabi-direct.js

const kajabiApiKey = "zThg3LJbBrPS9L7BtFpzBzgm";
const kajabiApiSecret = "PxVd7iZBQ2UPymvyJ4XLaL4A";

console.log("=== Testing Kajabi API Directly ===");
console.log(`API Key: ${kajabiApiKey}`);
console.log(`API Secret: ${kajabiApiSecret.substring(0, 5)}...`);
console.log("");

async function testKajabiAPI() {
  // Step 1: Get OAuth Token
  console.log("Step 1: Getting OAuth token...");
  
  const tokenUrl = "https://api.kajabi.com/v1/oauth/token";
  const formBody = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: kajabiApiKey.trim(),
    client_secret: kajabiApiSecret.trim(),
  }).toString();
  
  console.log(`Request URL: ${tokenUrl}`);
  console.log(`Form body: grant_type=client_credentials&client_id=...&client_secret=...`);
  
  try {
    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBody,
    });
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      throw new Error(`HTTP ${tokenResponse.status}: ${errorText}`);
    }
    
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    
    console.log("✓ Successfully authenticated!");
    console.log(`Access Token: ${accessToken.substring(0, 20)}...`);
    console.log("");
    
    // Step 2: Fetch Products
    console.log("Step 2: Fetching products...");
    const productsUrl = "https://api.kajabi.com/v1/products";
    
    try {
      const productsResponse = await fetch(productsUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!productsResponse.ok) {
        const errorText = await productsResponse.text();
        throw new Error(`HTTP ${productsResponse.status}: ${errorText}`);
      }
      
      const productsData = await productsResponse.json();
      console.log("✓ Successfully fetched products!");
      console.log(`Number of products: ${productsData.products?.length || 0}`);
      
      if (productsData.products && productsData.products.length > 0) {
        console.log("");
        console.log("First product:");
        const firstProduct = productsData.products[0];
        console.log(`  ID: ${firstProduct.id}`);
        console.log(`  Name: ${firstProduct.name}`);
        console.log(`  Type: ${firstProduct.type}`);
      }
    } catch (error) {
      console.log(`✗ Failed to fetch products: ${error.message}`);
    }
    
    console.log("");
    
    // Step 3: Fetch Contacts
    console.log("Step 3: Fetching contacts...");
    const contactsUrl = "https://api.kajabi.com/v1/contacts";
    
    try {
      const contactsResponse = await fetch(contactsUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!contactsResponse.ok) {
        const errorText = await contactsResponse.text();
        throw new Error(`HTTP ${contactsResponse.status}: ${errorText}`);
      }
      
      const contactsData = await contactsResponse.json();
      console.log("✓ Successfully fetched contacts!");
      console.log(`Number of contacts: ${contactsData.contacts?.length || 0}`);
      
      if (contactsData.contacts && contactsData.contacts.length > 0) {
        console.log("");
        console.log("First contact:");
        const firstContact = contactsData.contacts[0];
        console.log(`  ID: ${firstContact.id}`);
        console.log(`  Email: ${firstContact.email}`);
        if (firstContact.tags) {
          console.log(`  Tags: ${firstContact.tags.join(', ')}`);
        }
      }
    } catch (error) {
      console.log(`✗ Failed to fetch contacts: ${error.message}`);
    }
    
  } catch (error) {
    console.log("✗ Authentication failed!");
    console.log(`Error: ${error.message}`);
  }
  
  console.log("");
  console.log("=== Test Complete ===");
}

testKajabiAPI().catch(console.error);
