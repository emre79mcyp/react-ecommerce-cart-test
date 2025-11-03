import { test, expect } from '@playwright/test';

// Base URL of your app
const BASE_URL = 'http://localhost:5173';

test.describe('Tech Store Ecommerce Tests', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the app before each test
        await page.goto(BASE_URL);
    });

    test('should display the store title', async ({ page }) => {
        // Check if the main title is visible
        const title = page.getByTestId('app-title');
        await expect(title).toBeVisible();
        await expect(title).toHaveText('Tech Store');
    });

    test('should display all 6 products', async ({ page }) => {
        // Check if all products are displayed
        for (let i = 1; i <= 6; i++) {
            await expect(page.getByTestId(`product-${i}`)).toBeVisible();
        }
    });

    test('should display product details correctly', async ({ page }) => {
        // Test first product (Wireless Mouse)
        await expect(page.getByTestId('product-name-1')).toHaveText(
            'Wireless Mouse'
        );
        await expect(page.getByTestId('product-price-1')).toHaveText('$29.99');
        await expect(page.getByTestId('product-stock-1')).toContainText(
            'Stock: 15'
        );
    });

    test('should add item to cart and update cart count', async ({ page }) => {
        // Initially cart should show 0 or not be visible
        const cartButton = page.getByTestId('cart-button');

        // Add first product to cart
        await page.getByTestId('add-to-cart-1').click();

        // Cart count should show 1
        const cartCount = page.getByTestId('cart-count');
        await expect(cartCount).toBeVisible();
        await expect(cartCount).toHaveText('1');
    });

    test('should add multiple items to cart', async ({ page }) => {
        // Add 3 different products
        await page.getByTestId('add-to-cart-1').click();
        await page.getByTestId('add-to-cart-2').click();
        await page.getByTestId('add-to-cart-3').click();

        // Cart count should show 3
        const cartCount = page.getByTestId('cart-count');
        await expect(cartCount).toHaveText('3');
    });

    test('should open and close cart sidebar', async ({ page }) => {
        // Add an item first
        await page.getByTestId('add-to-cart-1').click();

        // Open cart
        await page.getByTestId('cart-button').click();
        await expect(page.getByTestId('cart-sidebar')).toBeVisible();

        // Close cart
        await page.getByTestId('close-cart').click();
        await expect(page.getByTestId('cart-sidebar')).not.toBeVisible();
    });

    test('should display items in cart correctly', async ({ page }) => {
        // Add Wireless Mouse to cart
        await page.getByTestId('add-to-cart-1').click();

        // Open cart
        await page.getByTestId('cart-button').click();

        // Check if item appears in cart
        await expect(page.getByTestId('cart-item-1')).toBeVisible();
        await expect(page.getByTestId('cart-item-name-1')).toHaveText(
            'Wireless Mouse'
        );
        await expect(page.getByTestId('item-quantity-1')).toHaveText('1');
    });

    test('should increase item quantity in cart', async ({ page }) => {
        // Add item and open cart
        await page.getByTestId('add-to-cart-1').click();
        await page.getByTestId('cart-button').click();

        // Click increase button
        await page.getByTestId('increase-quantity-1').click();

        // Quantity should be 2
        await expect(page.getByTestId('item-quantity-1')).toHaveText('2');

        // Cart count should also be 2
        await expect(page.getByTestId('cart-count')).toHaveText('2');
    });

    test('should decrease item quantity in cart', async ({ page }) => {
        // Add item twice
        await page.getByTestId('add-to-cart-1').click();
        await page.getByTestId('add-to-cart-1').click();
        await page.getByTestId('cart-button').click();

        // Click decrease button
        await page.getByTestId('decrease-quantity-1').click();

        // Quantity should be 1
        await expect(page.getByTestId('item-quantity-1')).toHaveText('1');
    });

    test('should remove item from cart when quantity reaches 0', async ({
        page,
    }) => {
        // Add item once
        await page.getByTestId('add-to-cart-1').click();
        await page.getByTestId('cart-button').click();

        // Decrease quantity to 0
        await page.getByTestId('decrease-quantity-1').click();

        // Item should be removed
        await expect(page.getByTestId('cart-item-1')).not.toBeVisible();

        // Empty cart message should appear
        await expect(page.getByTestId('empty-cart-message')).toBeVisible();
    });

    test('should remove item from cart using delete button', async ({
        page,
    }) => {
        // Add item and open cart
        await page.getByTestId('add-to-cart-1').click();
        await page.getByTestId('cart-button').click();

        // Click remove button
        await page.getByTestId('remove-item-1').click();

        // Item should be removed
        await expect(page.getByTestId('cart-item-1')).not.toBeVisible();
        await expect(page.getByTestId('empty-cart-message')).toBeVisible();
    });

    test('should calculate total price correctly', async ({ page }) => {
        // Add Wireless Mouse ($29.99) and USB-C Cable ($12.99)
        await page.getByTestId('add-to-cart-1').click();
        await page.getByTestId('add-to-cart-3').click();
        await page.getByTestId('cart-button').click();

        // Total should be $42.98
        await expect(page.getByTestId('cart-total')).toHaveText('$42.98');
    });

    test('should update total when quantity changes', async ({ page }) => {
        // Add Wireless Mouse ($29.99)
        await page.getByTestId('add-to-cart-1').click();
        await page.getByTestId('cart-button').click();

        // Increase quantity to 2
        await page.getByTestId('increase-quantity-1').click();

        // Total should be $59.98
        await expect(page.getByTestId('cart-total')).toHaveText('$59.98');
    });

    test('should show empty cart message when cart is empty', async ({
        page,
    }) => {
        // Open cart without adding anything
        await page.getByTestId('cart-button').click();

        // Should show empty message
        await expect(page.getByTestId('empty-cart-message')).toBeVisible();
        await expect(page.getByTestId('empty-cart-message')).toHaveText(
            'Your cart is empty'
        );
    });

    test('should display checkout button when cart has items', async ({
        page,
    }) => {
        // Add item
        await page.getByTestId('add-to-cart-1').click();
        await page.getByTestId('cart-button').click();

        // Checkout button should be visible
        await expect(page.getByTestId('checkout-button')).toBeVisible();
        await expect(page.getByTestId('checkout-button')).toHaveText(
            'Checkout'
        );
    });

    test('should handle adding same item multiple times', async ({ page }) => {
        // Add same item 3 times
        await page.getByTestId('add-to-cart-1').click();
        await page.getByTestId('add-to-cart-1').click();
        await page.getByTestId('add-to-cart-1').click();

        // Cart count should be 3
        await expect(page.getByTestId('cart-count')).toHaveText('3');

        // Open cart and verify quantity
        await page.getByTestId('cart-button').click();
        await expect(page.getByTestId('item-quantity-1')).toHaveText('3');
    });

    test('complete shopping flow', async ({ page }) => {
        // 1. Browse products - all should be visible
        await expect(page.getByTestId('product-1')).toBeVisible();

        // 2. Add multiple items
        await page.getByTestId('add-to-cart-1').click(); // Wireless Mouse $29.99
        await page.getByTestId('add-to-cart-4').click(); // Laptop Stand $45.99

        // 3. Open cart
        await page.getByTestId('cart-button').click();

        // 4. Verify items in cart
        await expect(page.getByTestId('cart-item-1')).toBeVisible();
        await expect(page.getByTestId('cart-item-4')).toBeVisible();

        // 5. Update quantity
        await page.getByTestId('increase-quantity-1').click();

        // 6. Verify total ($29.99 × 2 + $45.99 = $105.97)
        await expect(page.getByTestId('cart-total')).toHaveText('$105.97');

        // 7. Verify checkout button is ready
        await expect(page.getByTestId('checkout-button')).toBeEnabled();
    });
});
