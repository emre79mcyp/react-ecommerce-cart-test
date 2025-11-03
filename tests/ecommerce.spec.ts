import { test, expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';

// Base URL of your app
const BASE_URL = 'http://localhost:5173';

test.describe('Tech Store Ecommerce Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(BASE_URL);
    });

    test(
        qase('ECRCT-1', 'Should display the store title'),
        async ({ page }) => {
            const title = page.getByTestId('app-title');
            await expect(title).toBeVisible();
            await expect(title).toHaveText('Tech Store');
        }
    );

    test(qase('ECRCT-2', 'Should display all 6 products'), async ({ page }) => {
        for (let i = 1; i <= 6; i++) {
            await expect(page.getByTestId(`product-${i}`)).toBeVisible();
        }
    });

    test(
        qase('ECRCT-3', 'Should display product details correctly'),
        async ({ page }) => {
            await expect(page.getByTestId('product-name-1')).toHaveText(
                'Wireless Mouse'
            );
            await expect(page.getByTestId('product-price-1')).toHaveText(
                '$29.99'
            );
            await expect(page.getByTestId('product-stock-1')).toContainText(
                'Stock: 15'
            );
        }
    );

    test(
        qase('ECRCT-4', 'Should add item to cart and update cart count'),
        async ({ page }) => {
            await page.getByTestId('add-to-cart-1').click();
            const cartCount = page.getByTestId('cart-count');
            await expect(cartCount).toHaveText('1');
        }
    );

    test(
        qase('ECRCT-5', 'Should add multiple items to cart'),
        async ({ page }) => {
            await page.getByTestId('add-to-cart-1').click();
            await page.getByTestId('add-to-cart-2').click();
            await page.getByTestId('add-to-cart-3').click();
            await expect(page.getByTestId('cart-count')).toHaveText('3');
        }
    );

    test(
        qase('ECRCT-6', 'Should open and close cart sidebar'),
        async ({ page }) => {
            await page.getByTestId('add-to-cart-1').click();
            await page.getByTestId('cart-button').click();
            await expect(page.getByTestId('cart-sidebar')).toBeVisible();
            await page.getByTestId('close-cart').click();
            await expect(page.getByTestId('cart-sidebar')).not.toBeVisible();
        }
    );

    test(
        qase('ECRCT-7', 'Should display items in cart correctly'),
        async ({ page }) => {
            await page.getByTestId('add-to-cart-1').click();
            await page.getByTestId('cart-button').click();
            await expect(page.getByTestId('cart-item-1')).toBeVisible();
            await expect(page.getByTestId('cart-item-name-1')).toHaveText(
                'Wireless Mouse'
            );
            await expect(page.getByTestId('item-quantity-1')).toHaveText('1');
        }
    );

    test(
        qase('ECRCT-8', 'Should increase item quantity in cart'),
        async ({ page }) => {
            await page.getByTestId('add-to-cart-1').click();
            await page.getByTestId('cart-button').click();
            await page.getByTestId('increase-quantity-1').click();
            await expect(page.getByTestId('item-quantity-1')).toHaveText('2');
            await expect(page.getByTestId('cart-count')).toHaveText('2');
        }
    );

    test(
        qase('ECRCT-9', 'Should decrease item quantity in cart'),
        async ({ page }) => {
            await page.getByTestId('add-to-cart-1').click();
            await page.getByTestId('add-to-cart-1').click();
            await page.getByTestId('cart-button').click();
            await page.getByTestId('decrease-quantity-1').click();
            await expect(page.getByTestId('item-quantity-1')).toHaveText('1');
        }
    );

    test(
        qase('ECRCT-10', 'Should remove item when quantity reaches 0'),
        async ({ page }) => {
            await page.getByTestId('add-to-cart-1').click();
            await page.getByTestId('cart-button').click();
            await page.getByTestId('decrease-quantity-1').click();
            await expect(page.getByTestId('cart-item-1')).not.toBeVisible();
            await expect(page.getByTestId('empty-cart-message')).toBeVisible();
        }
    );

    test(
        qase('ECRCT-11', 'Should remove item using delete button'),
        async ({ page }) => {
            await page.getByTestId('add-to-cart-1').click();
            await page.getByTestId('cart-button').click();
            await page.getByTestId('remove-item-1').click();
            await expect(page.getByTestId('cart-item-1')).not.toBeVisible();
            await expect(page.getByTestId('empty-cart-message')).toBeVisible();
        }
    );

    test(
        qase('ECRCT-12', 'Should calculate total price correctly'),
        async ({ page }) => {
            await page.getByTestId('add-to-cart-1').click();
            await page.getByTestId('add-to-cart-3').click();
            await page.getByTestId('cart-button').click();
            await expect(page.getByTestId('cart-total')).toHaveText('$42.98');
        }
    );

    test(
        qase('ECRCT-13', 'Should update total when quantity changes'),
        async ({ page }) => {
            await page.getByTestId('add-to-cart-1').click();
            await page.getByTestId('cart-button').click();
            await page.getByTestId('increase-quantity-1').click();
            await expect(page.getByTestId('cart-total')).toHaveText('$59.98');
        }
    );

    test(
        qase('ECRCT-14', 'Should show empty cart message when cart is empty'),
        async ({ page }) => {
            await page.getByTestId('cart-button').click();
            await expect(page.getByTestId('empty-cart-message')).toBeVisible();
            await expect(page.getByTestId('empty-cart-message')).toHaveText(
                'Your cart is empty'
            );
        }
    );

    test(
        qase('ECRCT-15', 'Should display checkout button when cart has items'),
        async ({ page }) => {
            await page.getByTestId('add-to-cart-1').click();
            await page.getByTestId('cart-button').click();
            await expect(page.getByTestId('checkout-button')).toBeVisible();
            await expect(page.getByTestId('checkout-button')).toHaveText(
                'Checkout'
            );
        }
    );

    test(
        qase('ECRCT-16', 'Should handle adding same item multiple times'),
        async ({ page }) => {
            await page.getByTestId('add-to-cart-1').click();
            await page.getByTestId('add-to-cart-1').click();
            await page.getByTestId('add-to-cart-1').click();
            await expect(page.getByTestId('cart-count')).toHaveText('3');
            await page.getByTestId('cart-button').click();
            await expect(page.getByTestId('item-quantity-1')).toHaveText('3');
        }
    );

    test(qase('ECRCT-17', 'Complete shopping flow'), async ({ page }) => {
        await expect(page.getByTestId('product-1')).toBeVisible();
        await page.getByTestId('add-to-cart-1').click(); // Wireless Mouse $29.99
        await page.getByTestId('add-to-cart-4').click(); // Laptop Stand $45.99
        await page.getByTestId('cart-button').click();
        await expect(page.getByTestId('cart-item-1')).toBeVisible();
        await expect(page.getByTestId('cart-item-4')).toBeVisible();
        await page.getByTestId('increase-quantity-1').click();
        await expect(page.getByTestId('cart-total')).toHaveText('$105.97');
        await expect(page.getByTestId('checkout-button')).toBeEnabled();
    });
});
