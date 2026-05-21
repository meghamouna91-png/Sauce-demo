import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com';
const TEST_USER = 'standard_user';
const TEST_PASSWORD = 'secret_sauce';

test.describe('Cart Review Tests (AC1)', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto(`${BASE_URL}/`);
    await page.fill('input[data-test="username"]', TEST_USER);
    await page.fill('input[data-test="password"]', TEST_PASSWORD);
    await page.click('input[data-test="login-button"]');
    await page.waitForURL(`${BASE_URL}/inventory.html`);
  });

  test('1.1 Verify cart displays with correct item details and prices', async ({ page }) => {
    // Add items to cart
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    await page.click('[data-test="add-to-cart-sauce-labs-bike-light"]');
    
    // Verify cart badge shows 2 items
    const cartBadge = await page.locator('[data-test="shopping-cart-badge"]').textContent();
    expect(cartBadge).toBe('2');
    
    // Navigate to cart page
    await page.click('[data-test="shopping-cart-link"]');
    await page.waitForURL(`${BASE_URL}/cart.html`);
    
    // Verify cart heading
    const heading = await page.locator('[data-test="title"]').textContent();
    expect(heading).toBe('Your Cart');
    
    // Verify items are displayed correctly
    const backpackPrice = await page.locator('[data-test="inventory-item-price"]').first().textContent();
    expect(backpackPrice).toContain('$29.99');
    
    const bikelightPrice = await page.locator('[data-test="inventory-item-price"]').nth(1).textContent();
    expect(bikelightPrice).toContain('$9.99');
    
    // Verify QTY column - verify at least one item shows quantity
    const qtyElements = await page.locator('text=1').count();
    expect(qtyElements).toBeGreaterThan(0);
  });

  test('1.2 Verify cart navigation options', async ({ page }) => {
    // Add item to cart
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    
    // Navigate to cart
    await page.click('[data-test="shopping-cart-link"]');
    await page.waitForURL(`${BASE_URL}/cart.html`);
    
    // Verify Continue Shopping button
    const continueButton = await page.locator('button:has-text("Continue Shopping")');
    await expect(continueButton).toBeVisible();
    await expect(continueButton).toBeEnabled();
    
    // Verify Checkout button
    const checkoutButton = await page.locator('[data-test="checkout"]');
    await expect(checkoutButton).toBeVisible();
    await expect(checkoutButton).toBeEnabled();
    
    // Click Continue Shopping
    await continueButton.click();
    await page.waitForURL(`${BASE_URL}/inventory.html`);
    
    // Verify still on inventory and cart item count preserved
    const cartBadge = await page.locator('[data-test="shopping-cart-badge"]').textContent();
    expect(cartBadge).toBe('1');
  });

  test('1.3 Verify remove item functionality from cart', async ({ page }) => {
    // Add 2 items to cart
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    await page.click('[data-test="add-to-cart-sauce-labs-bike-light"]');
    
    // Navigate to cart
    await page.click('[data-test="shopping-cart-link"]');
    await page.waitForURL(`${BASE_URL}/cart.html`);
    
    // Verify 2 items in cart
    let cartBadge = await page.locator('[data-test="shopping-cart-badge"]').textContent();
    expect(cartBadge).toBe('2');
    
    // Remove first item
    const removeButtons = await page.locator('button[data-test*="remove"]').count();
    expect(removeButtons).toBe(2);
    
    await page.locator('button[data-test*="remove"]').first().click();
    
    // Verify 1 item remains
    cartBadge = await page.locator('[data-test="shopping-cart-badge"]').textContent();
    expect(cartBadge).toBe('1');
    
    // Remove second item
    await page.locator('button[data-test*="remove"]').click();
    
    // Verify cart is empty
    const emptyBadge = await page.locator('[data-test="shopping-cart-badge"]');