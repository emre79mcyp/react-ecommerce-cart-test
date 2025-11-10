import { test, expect } from '@playwright/test';

// Base URL of your app
const BASE_URL = 'http://localhost:5173';

test.describe('Tech Store Ecommerce Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');
    });

    test.afterEach(async ({ page }) => {
        try {
            await page.goto('about:blank');
        } catch (error) {
            console.log('Cleanup completed');
        }
    });

    test('TC_UI_001 - should display the store title correctly', async ({
        page,
    }) => {
        await expect(page).toHaveURL(BASE_URL);
        const title = page.getByTestId('app-title');
        await expect(title).toBeVisible({ timeout: 3000 });
        await expect(title).toHaveText('Tech Store');
    });

    test('TC_UI_002 - should display all 6 products', async ({ page }) => {
        for (let i = 1; i <= 6; i++) {
            const product = page.getByTestId(`product-${i}`);
            await expect(product).toBeVisible({ timeout: 5000 });
        }
    });

    test('TC_UI_003 - should display product details correctly', async ({
        page,
    }) => {
        await expect(page.getByTestId('product-name-1')).toHaveText(
            'Wireless Mouse'
        );
        await expect(page.getByTestId('product-price-1')).toHaveText('$29.99');
        await expect(page.getByTestId('product-stock-1')).toContainText(
            'Stock: 15'
        );
    });

    test('TC_CART_001 - should add item to cart and update cart count', async ({
        page,
    }) => {
        const addToCartButton = page.getByTestId('add-to-cart-1');
        await expect(addToCartButton).toBeEnabled({ timeout: 2000 });
        await addToCartButton.click();

        const cartCount = page.getByTestId('cart-count');
        await expect(cartCount).toBeVisible({ timeout: 3000 });
        await expect(cartCount).toHaveText('1');
    });

    test('TC_CART_002 - should add multiple items to cart', async ({
        page,
    }) => {
        await page.getByTestId('add-to-cart-1').click();
        await page.getByTestId('add-to-cart-2').click();
        await page.getByTestId('add-to-cart-3').click();

        const cartCount = page.getByTestId('cart-count');
        await expect(cartCount).toHaveText('3');
    });

    test('TC_CART_003 - should open and close cart sidebar', async ({
        page,
    }) => {
        // Add item first
        await page.getByTestId('add-to-cart-1').click();
        await expect(page.getByTestId('cart-count')).toHaveText('1');

        const cartSidebar = page.getByTestId('cart-sidebar');

        // Open cart and verify sidebar becomes visible
        await page.getByTestId('cart-button').click();
        await expect(cartSidebar).toBeVisible({ timeout: 3000 });

        // Close cart and verify sidebar becomes hidden
        await page.getByTestId('close-cart').click();
        await expect(cartSidebar).not.toBeVisible({ timeout: 3000 });
    });

    test('TC_CART_004 - should display items in cart correctly', async ({
        page,
    }) => {
        // Add item to cart
        await page.getByTestId('add-to-cart-1').click();

        // Open cart
        await page.getByTestId('cart-button').click();

        // Check cart items
        await expect(page.getByTestId('cart-item-1')).toBeVisible();
        await expect(page.getByTestId('cart-item-name-1')).toHaveText(
            'Wireless Mouse'
        );
        await expect(page.getByTestId('item-quantity-1')).toHaveText('1');

        // Check price using text content within cart item
        const cartItem = page.getByTestId('cart-item-1');
        await expect(cartItem).toContainText('$29.99');

        // Verify checkout button
        await expect(page.getByTestId('checkout-button')).toBeVisible();
    });

    test('TC_CART_005 - should increase item quantity in cart', async ({
        page,
    }) => {
        await page.getByTestId('add-to-cart-1').click();
        await page.getByTestId('cart-button').click();
        await expect(page.getByTestId('item-quantity-1')).toHaveText('1');

        await page.getByTestId('increase-quantity-1').click();

        await expect(page.getByTestId('item-quantity-1')).toHaveText('2', {
            timeout: 2000,
        });
        await expect(page.getByTestId('cart-count')).toHaveText('2');
    });

    test('TC_CART_006 - should decrease item quantity in cart', async ({
        page,
    }) => {
        await page.getByTestId('add-to-cart-1').click();
        await page.getByTestId('add-to-cart-1').click();
        await page.getByTestId('cart-button').click();
        await expect(page.getByTestId('item-quantity-1')).toHaveText('2');

        await page.getByTestId('decrease-quantity-1').click();

        await expect(page.getByTestId('item-quantity-1')).toHaveText('1');
        await expect(page.getByTestId('cart-count')).toHaveText('1');
    });

    test('TC_CART_007 - should remove item from cart when quantity reaches 0', async ({
        page,
    }) => {
        await page.getByTestId('add-to-cart-1').click();
        await page.getByTestId('cart-button').click();
        await expect(page.getByTestId('item-quantity-1')).toHaveText('1');

        await page.getByTestId('decrease-quantity-1').click();

        await expect(page.getByTestId('cart-item-1')).not.toBeVisible({
            timeout: 2000,
        });
        await expect(page.getByTestId('empty-cart-message')).toBeVisible();
    });

    test('TC_CART_008 - should remove item from cart using delete button', async ({
        page,
    }) => {
        await page.getByTestId('add-to-cart-1').click();
        await page.getByTestId('cart-button').click();
        await expect(page.getByTestId('cart-item-1')).toBeVisible();

        await page.getByTestId('remove-item-1').click();

        await expect(page.getByTestId('cart-item-1')).not.toBeVisible();
        await expect(page.getByTestId('empty-cart-message')).toBeVisible();
    });

    test('TC_CART_009 - should calculate total price correctly', async ({
        page,
    }) => {
        await page.getByTestId('add-to-cart-1').click(); // $29.99
        await page.getByTestId('add-to-cart-3').click(); // $12.99
        await page.getByTestId('cart-button').click();

        await expect(page.getByTestId('cart-total')).toHaveText('$42.98');
    });

    test('TC_CART_010 - should update total when quantity changes', async ({
        page,
    }) => {
        await page.getByTestId('add-to-cart-1').click();
        await page.getByTestId('cart-button').click();
        await expect(page.getByTestId('cart-total')).toHaveText('$29.99');

        await page.getByTestId('increase-quantity-1').click();

        await expect(page.getByTestId('cart-total')).toHaveText('$59.98');
    });

    test('TC_CART_011 - should show empty cart message when cart is empty', async ({
        page,
    }) => {
        await page.getByTestId('cart-button').click();

        await expect(page.getByTestId('empty-cart-message')).toBeVisible({
            timeout: 3000,
        });
        await expect(page.getByTestId('empty-cart-message')).toHaveText(
            'Your cart is empty'
        );
    });

    test('TC_CART_012 - should display checkout button when cart has items', async ({
        page,
    }) => {
        await page.getByTestId('add-to-cart-1').click();
        await page.getByTestId('cart-button').click();

        await expect(page.getByTestId('checkout-button')).toBeVisible();
        await expect(page.getByTestId('checkout-button')).toBeEnabled();
        await expect(page.getByTestId('checkout-button')).toHaveText(
            'Checkout'
        );
    });

    test('TC_CART_013 - should handle adding same item multiple times', async ({
        page,
    }) => {
        await page.getByTestId('add-to-cart-1').click();
        await page.getByTestId('add-to-cart-1').click();
        await page.getByTestId('add-to-cart-1').click();

        await expect(page.getByTestId('cart-count')).toHaveText('3');

        await page.getByTestId('cart-button').click();
        await expect(page.getByTestId('item-quantity-1')).toHaveText('3');
        await expect(page.getByTestId('cart-total')).toHaveText('$89.97');
    });

    test('TC_E2E_001 - complete shopping flow', async ({ page }) => {
        await expect(page.getByTestId('product-1')).toBeVisible({
            timeout: 5000,
        });

        await page.getByTestId('add-to-cart-1').click();
        await page.getByTestId('add-to-cart-4').click();

        await expect(page.getByTestId('cart-count')).toHaveText('2');

        await page.getByTestId('cart-button').click();

        await expect(page.getByTestId('cart-item-1')).toBeVisible();
        await expect(page.getByTestId('cart-item-4')).toBeVisible();

        await page.getByTestId('increase-quantity-1').click();

        await expect(page.getByTestId('cart-total')).toHaveText('$105.97');
        await expect(page.getByTestId('checkout-button')).toBeEnabled();
    });

    test('TC_EDGE_001 - should handle rapid multiple clicks on add to cart', async ({
        page,
    }) => {
        const addButton = page.getByTestId('add-to-cart-1');

        await addButton.click();
        await addButton.click();
        await addButton.click();

        const cartCount = page.getByTestId('cart-count');
        await expect(cartCount).toBeVisible();

        const countText = await cartCount.textContent();
        expect(['1', '3']).toContain(countText);
    });

    test('TC_EDGE_002 - should handle cart operations without errors', async ({
        page,
    }) => {
        await page.getByTestId('add-to-cart-1').click();
        await page.getByTestId('cart-button').click();

        await page.getByTestId('increase-quantity-1').click();
        await page.getByTestId('decrease-quantity-1').click();
        await page.getByTestId('remove-item-1').click();

        await expect(page.getByTestId('empty-cart-message')).toBeVisible();
    });
});
