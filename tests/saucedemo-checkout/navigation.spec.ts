import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com';
const TEST_USER = 'standard_user';
const TEST_PASSWORD = 'secret_sauce';

test.describe('Navigation and Flow Tests', () => {
  test('6.1 Test complete successful checkout flow end-to-end', async ({ page }) => {
    // Step 1: Login
    await page.goto(`${BASE_URL}/`);
    await page.fill('input[data-test="username"]', TEST_USER);
    await page.fill('input[data-test="password"]', TEST_PASSWORD);
    await page.click('input[data-test="login-button"]');
    await page.waitForURL(`${BASE_URL}/inventory.html`);
    
    // Verify inventory page loaded
    const products = await page.locator('[data-test*="inventory-item"]');
    expect(await products.count()).toBeGreaterThan(0);
    
    // Step 2: Add item to cart
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    
    // Verify cart badge shows 1
    const cartBadge = await page.locator('[data-test="shopping-cart-badge"]').textContent();
    expect(cartBadge).toBe('1');
    
    // Step 3: Navigate to cart
    await page.click('[data-test="shopping-cart-link"]');
    await page.waitForURL(`${BASE_URL}/cart.html`);
    
    // Verify cart displays item
    const cartItem = await page.locator('[data-test="inventory-item-name"]').textContent();
    expect(cartItem).toContain('Sauce Labs Backpack');
    
    const price = await page.locator('[data-test="inventory-item-price"]').textContent();
    expect(price).toContain('$29.99');
    
    // Step 4: Click Checkout
    await page.click('[data-test="checkout"]');
    await page.waitForURL(`${BASE_URL}/checkout-step-one.html`);
    
    // Step 5: Fill checkout information
    await page.fill('input[data-test="firstName"]', 'John');
    await page.fill('input[data-test="lastName"]', 'Doe');
    await page.fill('input[data-test="postalCode"]', '12345');
    
    // Step 6: Click Continue
    await page.click('[data-test="continue"]');
    await page.waitForURL(`${BASE_URL}/checkout-step-two.html`);
    
    // Verify order overview displays
    const overviewTitle = await page.locator('[data-test="title"]').textContent();
    expect(overviewTitle).toContain('Overview');
    
    // Verify item and price displayed
    const overviewItem = await page.locator('[data-test="inventory-item-name"]').textContent();
    expect(overviewItem).toContain('Backpack');
    
    const overviewPrice = await page.locator('[data-test="inventory-item-price"]').textContent();
    expect(overviewPrice).toContain('$29.99');
    
    // Step 7: Click Finish
    await page.click('[data-test="finish"]');
    await page.waitForURL(`${BASE_URL}/checkout-complete.html`);
    
    // Verify completion page
    const completionTitle = await page.locator('[data-test="title"]').textContent();
    expect(completionTitle).toContain('Complete');
    
    const thankYouHeading = await page.locator('h2:has-text("Thank you")');
    await expect(thankYouHeading).toBeVisible();
    
    // Step 8: Click Back Home
    const backHomeButton = await page.locator('[data-test="back-to-products"]');
    await backHomeButton.click();
    await page.waitForURL(`${BASE_URL}/inventory.html`);
    
    // Verify cart is cleared
    const emptyBadge = await page.locator('[data-test="shopping-cart-badge"]');
    await expect(emptyBadge).not.toBeVisible();
  });

  test('6.2 Test navigation between checkout steps', async ({ page }) => {
    // Navigate to checkout step one
    await page.goto(`${BASE_URL}/`);
    await page.fill('input[data-test="username"]', TEST_USER);
    await page.fill('input[data-test="password"]', TEST_PASSWORD);
    await page.click('input[data-test="login-button"]');
    await page.waitForURL(`${BASE_URL}/inventory.html`);
    
    // Add item and navigate to checkout
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    await page.click('[data-test="shopping-cart-link"]');
    await page.waitForURL(`${BASE_URL}/cart.html`);
    
    // Save cart page
    const cartUrl = `${BASE_URL}/cart.html`;
    
    // Click Checkout to go to step 1
    await page.click('[data-test="checkout"]');
    await page.waitForURL(`${BASE_URL}/checkout-step-one.html`);
    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-one.html`);