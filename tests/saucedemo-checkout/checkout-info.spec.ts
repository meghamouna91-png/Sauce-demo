import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com';
const TEST_USER = 'standard_user';
const TEST_PASSWORD = 'secret_sauce';

// Helper function to login and add item to cart
async function loginAndPrepareCheckout(page) {
  await page.goto(`${BASE_URL}/`);
  await page.fill('input[data-test="username"]', TEST_USER);
  await page.fill('input[data-test="password"]', TEST_PASSWORD);
  await page.click('input[data-test="login-button"]');
  await page.waitForURL(`${BASE_URL}/inventory.html`);
  
  // Add item to cart
  await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
  
  // Navigate to cart and then checkout
  await page.click('[data-test="shopping-cart-link"]');
  await page.waitForURL(`${BASE_URL}/cart.html`);
  await page.click('[data-test="checkout"]');
  await page.waitForURL(`${BASE_URL}/checkout-step-one.html`);
}

test.describe('Checkout Information Entry Tests (AC2)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAndPrepareCheckout(page);
  });

  test('2.1 Verify all checkout form fields are present and functional', async ({ page }) => {
    // Verify page title
    const title = await page.locator('[data-test="title"]').textContent();
    expect(title).toContain('Checkout');
    
    // Verify form fields exist
    const firstNameField = await page.locator('input[data-test="firstName"]');
    await expect(firstNameField).toBeVisible();
    
    const lastNameField = await page.locator('input[data-test="lastName"]');
    await expect(lastNameField).toBeVisible();
    
    const zipField = await page.locator('input[data-test="postalCode"]');
    await expect(zipField).toBeVisible();
    
    // Verify buttons
    const continueButton = await page.locator('[data-test="continue"]');
    await expect(continueButton).toBeVisible();
    await expect(continueButton).toBeEnabled();
    
    const cancelButton = await page.locator('button:has-text("Cancel")');
    await expect(cancelButton).toBeVisible();
  });

  test('2.2 Test mandatory field validation - First Name required', async ({ page }) => {
    // Fill Last Name and Zip, leave First Name empty
    await page.fill('input[data-test="lastName"]', 'Doe');
    await page.fill('input[data-test="postalCode"]', '12345');
    
    // Click Continue
    await page.click('[data-test="continue"]');
    
    // Verify error message
    const errorHeading = await page.locator('h3:has-text("Error")');
    await expect(errorHeading).toBeVisible();
    const errorText = await errorHeading.textContent();
    expect(errorText).toContain('First Name');
    
    // Verify still on checkout page
    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-one.html`);
  });

  test('2.3 Test mandatory field validation - Last Name required', async ({ page }) => {
    // Fill First Name and Zip, leave Last Name empty
    await page.fill('input[data-test="firstName"]', 'John');
    await page.fill('input[data-test="postalCode"]', '12345');
    
    // Click Continue
    await page.click('[data-test="continue"]');
    
    // Verify error message
    const errorHeading = await page.locator('h3:has-text("Error")');
    await expect(errorHeading).toBeVisible();
    const errorText = await errorHeading.textContent();
    expect(errorText).toContain('Last Name');
  });

  test('2.4 Test mandatory field validation - Zip Code required', async ({ page }) => {
    // Fill First Name and Last Name, leave Zip empty
    await page.fill('input[data-test="firstName"]', 'John');
    await page.fill('input[data-test="lastName"]', 'Doe');
    
    // Click Continue
    await page.click('[data-test="continue"]');
    
    // Verify error message
    const errorHeading = await page.locator('h3:has-text("Error")');
    await expect(errorHeading).toBeVisible();
    const errorText = await errorHeading.textContent();
    expect(errorText).toContain('Postal Code');
  });