import { test, expect } from '@playwright/test';

test('form interaction test', async ({ page }) => {
    // Navigate to the page
    await page.goto('http://localhost:5173/test-form');
    
    // Input value into the field
    await page.fill('#input-field', 'test value');
    
    // Submit the form
    await page.click('#submit-button');
    
    // Wait for response - using multiple strategies
    const response = await Promise.race([
        // Strategy 1: Wait for specific element
        page.waitForSelector('#response-field', { state: 'visible' })
            .then(el => el.textContent()),
        
        // Strategy 2: Wait for content change
        page.waitForFunction(() => {
            const element = document.querySelector('.response-container');
            return element && element.textContent.includes('Response:');
        }).then(() => page.locator('.response-container').textContent())
    ]);
    
    // Validate response
    expect(response).toBeTruthy();
    console.log('Captured response:', response);
});
