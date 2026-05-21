import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com';
const TEST_USER = 'standard_user';
const TEST_PASSWORD = 'secret_sauce';

// Helper function to complete full checkout
async function completeFullCheckout(page) {
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
  
  // Fill checkout info
  await page.fill('input[data-test="firstName"]', 'John');
  await page.fill('input[data-test="lastName"]', 'Doe');
  await page.fill('input[data-test="postalCode"]', '12345');
  
  // Click Continue to order overview
  await page.click('[data-test="continue"]');
  await page.waitForURL(`${BASE_URL}/checkout-step-two.html`);
  
  // Click Finish to complete order
  await page.click('[data-test="finish"]');
  await page.waitForURL(`${BASE_URL}/checkout-complete.html`);
}

test.describe('Order Completion Tests (AC4)', () => {
  test('4.1 Verify successful order confirmation message', async ({ page }) => {
    await completeFullCheckout(page);
    
    // Verify page title
    const title = await page.locator('[data-test="title"]').textContent();
    expect(title).toContain('Complete');
    
    // Verify success heading
    const successHeading = await page.locator('h2:has-text("Thank you")');
    await expect(successHeading).toBeVisible();
    
    // Verify confirmation message
    const message = await page.locator('text=Your order has been dispatched');
    await expect(message).toBeVisible();
    
    // Verify pony image is displayed
    const ponyImage = await page.locator('img[alt="Pony Express"]');
    await expect(ponyImage).toBeVisible();
  });

  test('4.2 Verify cart is cleared after successful order', async ({ page }) => {
    await completeFullCheckout(page);
    
    // Click Back Home
    const backHomeButton = await page.locator('[data-test="back-to-products"]');
    await expect(backHomeButton).toBeVisible();
    await backHomeButton.click();
    
    // Verify redirected to inventory
    await page.waitForURL(`${BASE_URL}/inventory.html`);
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
    
    // Verify cart is empty (no cart badge)
    const cartBadge = await page.locator('[data-test="shopping-cart-badge"]');
    await expect(cartBadge).not.toBeVisible();
  });

  test('4.3 Verify Back Home button functionality', async ({ page }) => {
    await completeFullCheckout(page);
    
    // Verify Back Home button is visible and clickable
    const backHomeButton = await page.locator('[data-test="back-to-products"]');
    await expect(backHomeButton).toBeVisible();
    await expect(backHomeButton).toBeEnabled();
    
    // Click Back Home
    await backHomeButton.click();
    
    // Verify redirected to inventory page
    await page.waitForURL(`${BASE_URL}/inventory.html`);
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
    
    // Verify products are displayed
    const products = await page.locator('[data-test*="inventory-item"]');
    expect(await products.count()).toBeGreaterThan(0);
  });

  test('4.4 Verify order completion page elements', async ({ page }) => {
    await completeFullCheckout(page);