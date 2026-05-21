# SCRUM-101 E-commerce Checkout Test Plan

## Application Overview

This test plan covers comprehensive testing of the Sauce Labs demo e-commerce checkout workflow. The application is a simulated shopping platform that includes product browsing, cart management, and a multi-step checkout process. Testing covers happy paths, validation scenarios, error handling, and edge cases across all checkout pages.

## Test Scenarios

### 1. Cart Review Tests (AC1)

**Seed:** `tests/seed.spec.ts`

#### 1.1. Verify cart displays with correct item details and prices

**File:** `tests/cart-review/verify-cart-display.spec.ts`

**Steps:**
  1. Login with standard_user / secret_sauce credentials
    - expect: User is logged in and on inventory page
  2. Add Sauce Labs Backpack ($29.99) and Sauce Labs Bike Light ($9.99) to cart
    - expect: Cart badge displays '2' indicating 2 items in cart
  3. Navigate to cart page (https://www.saucedemo.com/cart.html)
    - expect: Cart page loads with 'Your Cart' heading
    - expect: Both items display with correct names, descriptions, and prices
    - expect: QTY column shows '1' for each item
    - expect: Description column shows item name, product description, and price
  4. Verify price details on cart page
    - expect: Sauce Labs Backpack shows $29.99
    - expect: Sauce Labs Bike Light shows $9.99
    - expect: Items are displayed in cart table with QTY and Description columns