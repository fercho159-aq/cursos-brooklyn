const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', error => console.log('BROWSER PAGEERROR:', error.message));

  try {
    // Navigate and login
    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="email"]', 'admin@calle7.mx'); // Guessing based on common defaults or we can just try to see if it requires login
    await page.fill('input[type="password"]', 'admin123'); // Adjust if needed
    // Assuming there's a submit button
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    console.log("Navigating to finanzas...");
    await page.goto('http://localhost:3000/admin/finanzas');
    await page.waitForTimeout(5000);

  } catch (err) {
    console.error("Playwright Error:", err);
  } finally {
    await browser.close();
  }
})();
