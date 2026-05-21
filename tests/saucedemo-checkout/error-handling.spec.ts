import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com';
const TEST_USER = 'standard_user';
const TEST_PASSWORD = 'secret_sauce';

// Helper function to navigate to checkout
async function navigateToCheckout(page) {
  await page.goto(`${BASE_URL}/`);
  await page.fill('input[data-test="username"]', TEST_USER);
  await page.fill('input[data-test="password"]', TEST_PASSWORD);
  await page.click('input[data-test="login-button"]');
  await page.waitForURL(`${BASE_URL}/inventory.html`);
  
  // Add item to cart
  await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
  
  // Navigate to cart
  await page.click('[data-test="shopping-cart-link"]');
  await page.waitForURL(`${BASE_URL}/cart.html`);
  
  // Click Checkout
  await page.click('[data-test="checkout"]');
  await page.waitForURL(`${BASE_URL}/checkout-step-one.html`);
}

test.describe('Error Handling and Validation Tests (AC5)', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToCheckout(page);
  });

  test('5.1 Test empty form submission validation', async ({ page }) => {
    // Click Continue without filling any fields
    await page.click('[data-test="continue"]');
    
    // Verify error message appears
    const errorHeading = await page.locator('h3:has-text("Error")');
    await expect(errorHeading).toBeVisible();
    
    // Verify error message mentions First Name
    const errorText = await errorHeading.textContent();
    expect(errorText).toContain('First Name');
    
    // Verify still on checkout page
    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-one.html`);
  });

  test('5.2 Test field-level error messages', async ({ page }) => {
    // Fill only First Name
    await page.fill('input[data-test="firstName"]', 'John');
    
    // Click Continue
    await page.click('[data-test="continue"]');
    
    // Verify error message for Last Name
    const errorHeading = await page.locator('h3:has-text("Error")');
    await expect(errorHeading).toBeVisible();
    
    // Add Last Name and try again
    await page.fill('input[data-test="lastName"]', 'Doe');
    await page.click('[data-test="continue"]');
    
    // Now error should be for Zip Code
    await expect(errorHeading).toBeVisible();
  });

  test('5.3 Test numeric zip code validation', async ({ page }) => {
    // Fill with numeric zip code
    await page.fill('input[data-test="firstName"]', 'John');
    await page.fill('input[data-test="lastName"]', 'Doe');
    await page.fill('input[data-test="postalCode"]', '99999');
    
    // Click Continue
    await page.click('[data-test="continue"]');
    
    // Verify form accepts numeric zip and proceeds
    await page.waitForURL(`${BASE_URL}/checkout-step-two.html`);
    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-two.html`);
  });

  test('5.4 Test alphanumeric zip code validation', async ({ page }) => {
    // Fill with alphanumeric zip code
    await page.fill('input[data-test="firstName"]', 'Jane');
    await page.fill('input[data-test="lastName"]', 'Smith');
    await page.fill('input[data-test="postalCode"]', 'H2X1Y7');
    
    // Click Continue
    await page.click('[data-test="continue"]');
    
    // Verify form accepts alphanumeric zip and proceeds
    await page.waitForURL(`${BASE_URL}/checkout-step-two.html`);
    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-two.html`);
  });

  test('5.5 Test error recovery workflow', async ({ page }) => {
    // Click Continue without filling - should show error
    await page.click('[data-test="continue"]');
    
    // Verify error message appears
    const errorHeading = await page.locator('h3:has-text("Error")');