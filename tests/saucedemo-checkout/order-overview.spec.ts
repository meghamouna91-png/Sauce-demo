import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com';
const TEST_USER = 'standard_user';
const TEST_PASSWORD = 'secret_sauce';

// Helper function to navigate to order overview
async function navigateToOrderOverview(page, items = ['sauce-labs-backpack', 'sauce-labs-bike-light']) {
  await page.goto(`${BASE_URL}/`);
  await page.fill('input[data-test="username"]', TEST_USER);
  await page.fill('input[data-test="password"]', TEST_PASSWORD);
  await page.click('input[data-test="login-button"]');
  await page.waitForURL(`${BASE_URL}/inventory.html`);
  
  // Add items to cart
  for (const item of items) {
    await page.click(`[data-test="add-to-cart-${item}"]`);
  }
  
  // Navigate to cart
  await page.click('[data-test="shopping-cart-link"]');
  await page.waitForURL(`${BASE_URL}/cart.html`);
  
  // Click Checkout
  await page.click('[data-test="checkout"]');
  await page.waitForURL(`${BASE_URL}/checkout-step-one.html`);
  
  // Fill checkout info
  await page.fill('input[data-test="firstName"]', 'John');
  await page.fill('input[data-test="lastName"]', 'Doe');
  await page.fill('input[data-test="postalCode"]', '12345');
  
  // Click Continue
  await page.click('[data-test="continue"]');
  await page.waitForURL(`${BASE_URL}/checkout-step-two.html`);
}

test.describe('Order Overview Tests (AC3)', () => {
  test('3.1 Verify order summary displays all items with correct details', async ({ page }) => {
    await navigateToOrderOverview(page);
    
    // Verify page title
    const title = await page.locator('[data-test="title"]').textContent();
    expect(title).toContain('Overview');
    
    // Verify items in summary
    const items = await page.locator('[data-test="inventory-item-name"]').allTextContents();
    expect(items).toContain('Sauce Labs Backpack');
    expect(items).toContain('Sauce Labs Bike Light');
    
    // Verify prices
    const prices = await page.locator('[data-test="inventory-item-price"]').allTextContents();
    expect(prices[0]).toContain('$29.99');
    expect(prices[1]).toContain('$9.99');
  });

  test('3.2 Verify payment information is displayed', async ({ page }) => {
    await navigateToOrderOverview(page);
    
    // Verify payment information section
    const paymentLabel = await page.locator('text=Payment Information:');
    await expect(paymentLabel).toBeVisible();
    
    // Verify payment method
    const paymentMethod = await page.locator('text=SauceCard #31337');
    await expect(paymentMethod).toBeVisible();
  });

  test('3.3 Verify shipping information is displayed', async ({ page }) => {
    await navigateToOrderOverview(page);
    
    // Verify shipping information section
    const shippingLabel = await page.locator('text=Shipping Information:');
    await expect(shippingLabel).toBeVisible();
    
    // Verify shipping method
    const shippingMethod = await page.locator('text=Free Pony Express Delivery!');
    await expect(shippingMethod).toBeVisible();
  });

  test('3.4 Verify price breakdown and total calculation', async ({ page }) => {
    await navigateToOrderOverview(page);
    
    // Verify price breakdown (look for the text content containing the amounts)
    const pageText = await page.textContent('body');
    expect(pageText).toContain('$39.98');
    expect(pageText).toContain('$3.20');
    expect(pageText).toContain('$43.18');
  });

  test('3.5 Verify price calculation with different product combinations', async ({ page }) => {
    // Use different items: Backpack and Bike Light
    await navigateToOrderOverview(page, ['sauce-labs-backpack', 'sauce-labs-bike-light']);
    
    // Verify different price breakdown
    const pageText = await page.textContent('body');
    expect(pageText).toContain('$29.99');
    expect(pageText).toContain('$9.99');
  });

  test('3.6 Verify Cancel button on order overview page', async ({ page }) => {
    await navigateToOrderOverview(page);
    
    // Click Cancel button
    const cancelButton = await page.locator('button:has-text("Cancel")');
    await expect(cancelButton).toBeVisible();
    await cancelButton.click();
    
    // Verify redirected back to cart
    await page.waitForURL(`${BASE_URL}/cart.html`);
    await expect(page).toHaveURL(`${BASE_URL}/cart.html`);
  });
});