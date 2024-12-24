import { test, expect } from '@playwright/test';

test('URL form interaction test', async ({ page }) => {
    // Navigate to the page
    await page.goto('/test-form');
    
    // Input a test URL
    const testUrl = 'https://example.com';
    await page.fill('#url-input', testUrl);
    
    // Submit the form
    await page.click('#submit-button');
    
    // Wait for loading state
    await expect(page.locator('#submit-button')).toHaveText('Processing...');
    
    // Wait for response
    const responseLocator = page.locator('#response-field');
    await expect(responseLocator).toBeVisible();
    
    // Get and validate response
    const responseText = await responseLocator.textContent();
    expect(responseText).toContain('Response:');
    expect(responseText).toContain('status');
    expect(responseText).toContain('contentType');
    
    // Log the response for inspection
    console.log('Captured response:', responseText);
});
