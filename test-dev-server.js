import { chromium } from 'playwright';

async function testDevServer() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('Testing http://localhost:3000...');
    const response = await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle',
      timeout: 10000 
    });
    
    console.log(`Status: ${response?.status()}`);
    console.log(`Status Text: ${response?.statusText()}`);
    
    // Check for 404s in console
    const errors = [];
    page.on('response', (response) => {
      if (response.status() === 404) {
        errors.push({
          url: response.url(),
          status: response.status(),
        });
      }
    });
    
    await page.waitForTimeout(2000);
    
    console.log('\n404 Errors found:');
    if (errors.length > 0) {
      errors.forEach(err => {
        console.log(`  - ${err.url} (${err.status})`);
      });
    } else {
      console.log('  None!');
    }
    
    // Check page title
    const title = await page.title();
    console.log(`\nPage Title: ${title}`);
    
    // Check if root element exists
    const root = await page.locator('#root').count();
    console.log(`Root element found: ${root > 0}`);
    
    // Get page content snippet
    const bodyText = await page.locator('body').textContent();
    console.log(`\nBody content (first 200 chars): ${bodyText?.substring(0, 200)}`);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
}

testDevServer().catch(console.error);

