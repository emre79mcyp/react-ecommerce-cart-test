## Overview

This document describes the comprehensive Playwright-based end-to-end (E2E) test suite for the Tech Store ecommerce application. The suite validates core shopping functionality including product display, cart management, and the complete checkout flow.

**Test Framework:** Playwright  
**Language:** JavaScript/TypeScript  
**Application URL:** `http://localhost:5173`  
**Total Tests:** 19

---

## Test Suite Architecture

### Setup & Configuration

The test suite uses Playwright's built-in testing utilities with the following structure:

- **Base URL:** All tests navigate to `http://localhost:5173` before execution
- **Hook:** `beforeEach` navigates to the application to ensure a clean state for each test
- **Test Organization:** Tests are grouped under `Tech Store Ecommerce Tests` using `test.describe()`

### Test IDs Used

The test suite relies heavily on data-testid attributes for element selection. This ensures tests are resilient to CSS and styling changes:

#### Product Elements
- `app-title` - Main application heading
- `product-{n}` - Individual product containers (1-6)
- `product-name-{n}` - Product name text
- `product-price-{n}` - Product price
- `product-stock-{n}` - Stock availability
- `add-to-cart-{n}` - Add to cart button for product n

#### Cart Elements
- `cart-button` - Main cart button in header
- `cart-count` - Badge showing number of items in cart
- `cart-sidebar` - Cart drawer/sidebar container
- `close-cart` - Button to close cart sidebar
- `cart-item-{n}` - Cart item container
- `cart-item-name-{n}` - Item name in cart
- `item-quantity-{n}` - Quantity display for item
- `increase-quantity-{n}` - Button to increment quantity
- `decrease-quantity-{n}` - Button to decrement quantity
- `remove-item-{n}` - Delete/remove button for item
- `empty-cart-message` - Message displayed when cart is empty
- `cart-total` - Total price calculation
- `checkout-button` - Proceed to checkout button

---

## Test Cases

### 1. **Display Tests** (Tests 1-3)

#### Test: "should display the store title"
**Purpose:** Verify the application loads and displays the main heading  
**Steps:**
1. Navigate to base URL
2. Find element with testid `app-title`
3. Assert element is visible
4. Assert element text equals "Tech Store"

**Why it matters:** Confirms basic page load and DOM rendering

---

#### Test: "should display all 6 products"
**Purpose:** Verify the product catalog loads completely  
**Steps:**
1. Loop through products 1-6
2. Assert each product with testid `product-{n}` is visible

**Why it matters:** Ensures no products are missing from the catalog and initial rendering works

---

#### Test: "should display product details correctly"
**Purpose:** Validate product information accuracy  
**Steps:**
1. Locate product 1 (Wireless Mouse)
2. Assert name displays as "Wireless Mouse"
3. Assert price displays as "$29.99"
4. Assert stock shows "Stock: 15"

**Why it matters:** Confirms product data is correctly rendered from the backend/store

---

### 2. **Add to Cart Tests** (Tests 4-6)

#### Test: "should add item to cart and update cart count"
**Purpose:** Verify single item addition updates the cart counter  
**Steps:**
1. Navigate to page
2. Click "Add to cart" for product 1
3. Locate cart count element
4. Assert cart count is visible
5. Assert cart count displays "1"

**Why it matters:** Validates core cart functionality and state management

---

#### Test: "should add multiple items to cart"
**Purpose:** Verify multiple different products can be added  
**Steps:**
1. Click add-to-cart for products 1, 2, and 3
2. Assert cart count displays "3"

**Why it matters:** Confirms cart handles multiple SKUs correctly

---

#### Test: "should handle adding same item multiple times"
**Purpose:** Verify quantity increases when same product added multiple times  
**Steps:**
1. Click add-to-cart for product 1 three times
2. Assert cart count shows "3"
3. Open cart
4. Assert item quantity shows "3" (not 3 separate items)

**Why it matters:** Tests cart merging logic—duplicate items should increase quantity, not create duplicates

---

### 3. **Cart Sidebar Tests** (Tests 7-8)

#### Test: "should open and close cart sidebar"
**Purpose:** Verify cart UI drawer/sidebar opens and closes  
**Steps:**
1. Add product 1 to cart
2. Click cart button
3. Assert cart sidebar is visible
4. Click close cart button
5. Assert cart sidebar is not visible

**Why it matters:** Ensures cart UI interaction works and sidebar state is managed

---

#### Test: "should display items in cart correctly"
**Purpose:** Validate cart displays correct product information  
**Steps:**
1. Add product 1 (Wireless Mouse) to cart
2. Open cart sidebar
3. Assert cart item 1 is visible
4. Assert cart item name equals "Wireless Mouse"
5. Assert item quantity shows "1"

**Why it matters:** Confirms cart accurately displays product details and quantities

---

### 4. **Quantity Management Tests** (Tests 9-11)

#### Test: "should increase item quantity in cart"
**Purpose:** Verify quantity increment button works  
**Steps:**
1. Add product 1 to cart
2. Open cart
3. Click increase quantity button for item 1
4. Assert item quantity shows "2"
5. Assert cart count shows "2"

**Why it matters:** Tests quantity controls update both item quantity and cart total count

---

#### Test: "should decrease item quantity in cart"
**Purpose:** Verify quantity decrement button works  
**Steps:**
1. Add product 1 to cart twice
2. Open cart
3. Click decrease quantity button
4. Assert item quantity shows "1"

**Why it matters:** Confirms decrement doesn't allow negative quantities and state updates correctly

---

#### Test: "should remove item from cart when quantity reaches 0"
**Purpose:** Verify item is removed when quantity decreases to zero  
**Steps:**
1. Add product 1 once to cart
2. Open cart
3. Decrease quantity
4. Assert cart item is no longer visible
5. Assert empty cart message appears

**Why it matters:** Tests edge case of quantity reaching zero should auto-remove item

---

### 5. **Item Removal Tests** (Test 12)

#### Test: "should remove item from cart using delete button"
**Purpose:** Verify explicit delete button removes items  
**Steps:**
1. Add product 1 to cart
2. Open cart
3. Click remove/delete button for item 1
4. Assert item is no longer visible
5. Assert empty cart message appears

**Why it matters:** Tests alternative removal method independent of quantity controls

---

### 6. **Pricing Tests** (Tests 13-14)

#### Test: "should calculate total price correctly"
**Purpose:** Verify cart total calculation with multiple items  
**Steps:**
1. Add product 1: Wireless Mouse ($29.99)
2. Add product 3: USB-C Cable ($12.99)
3. Open cart
4. Assert cart total shows "$42.98"

**Why it matters:** Tests calculation accuracy and decimal handling in pricing

---

#### Test: "should update total when quantity changes"
**Purpose:** Verify total updates when quantities are modified  
**Steps:**
1. Add product 1 ($29.99) to cart
2. Open cart
3. Increase quantity to 2
4. Assert cart total shows "$59.98" (29.99 × 2)

**Why it matters:** Confirms total recalculation happens on quantity changes

---

### 7. **Empty State Tests** (Test 15)

#### Test: "should show empty cart message when cart is empty"
**Purpose:** Verify empty cart state displays appropriate message  
**Steps:**
1. Open cart without adding items
2. Assert empty cart message is visible
3. Assert message text equals "Your cart is empty"

**Why it matters:** Tests UX for users with empty carts, confirms message clarity

---

### 8. **Checkout Flow Tests** (Tests 16-17)

#### Test: "should display checkout button when cart has items"
**Purpose:** Verify checkout button appears only with items  
**Steps:**
1. Add product 1 to cart
2. Open cart
3. Assert checkout button is visible
4. Assert checkout button text equals "Checkout"

**Why it matters:** Tests conditional rendering—checkout shouldn't be available on empty cart

---

### 9. **Integration Test** (Test 18)

#### Test: "complete shopping flow"
**Purpose:** Full end-to-end test simulating real user journey  
**Steps:**
1. Verify product 1 is visible (browse)
2. Add product 1 ($29.99) and product 4 ($45.99) to cart (add to cart)
3. Open cart sidebar
4. Verify both items visible in cart
5. Increase product 1 quantity to 2
6. Assert total is "$105.97" (29.99 × 2 + 45.99)
7. Assert checkout button is enabled

**Why it matters:** Tests complete user flow from browsing to checkout readiness

---

## Running the Tests

### Local Development

\`\`\`bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install --with-deps

# Run all tests
npx playwright test

# Run tests in UI mode (interactive)
npx playwright test --ui

# Run specific test file
npx playwright test tech-store.spec.js

# Run tests matching pattern
npx playwright test -g "should add item"

# Run in headed mode (see browser)
npx playwright test --headed
\`\`\`

### Continuous Integration (GitHub Actions)

The test suite runs automatically on:
- **Trigger:** Push to \`main\` or \`master\` branches
- **Trigger:** Pull requests targeting \`main\` or \`master\` branches
- **Timeout:** 60 minutes
- **Environment:** Ubuntu latest with Node.js 20

**Artifacts:** Test reports are uploaded and retained for 30 days

---

## Expected Product Catalog

The test suite assumes the following product inventory:

| ID | Name | Price | Stock |
|----|------|-------|-------|
| 1 | Wireless Mouse | $29.99 | 15 |
| 2 | USB Hub | $34.99 | 8 |
| 3 | USB-C Cable | $12.99 | 25 |
| 4 | Laptop Stand | $45.99 | 5 |
| 5 | Keyboard | $79.99 | 12 |
| 6 | Monitor | $199.99 | 3 |

---

## Test Data & Calculations

### Sample Price Calculations (used in tests)

- **Test 13:** \$29.99 + \$12.99 = \$42.98
- **Test 14:** \$29.99 × 2 = \$59.98
- **Test 18:** (\$29.99 × 2) + \$45.99 = \$105.97

All calculations assume standard rounding to 2 decimal places.

---

## Key Testing Principles

### 1. **Test Isolation**
Each test is independent and doesn't rely on previous test state. The \`beforeEach\` hook ensures a fresh page load.

### 2. **User-Centric Testing**
Tests focus on user interactions (clicks, form input) rather than implementation details.

### 3. **Data-TestID Strategy**
Using \`getByTestId()\` makes tests:
- Resilient to CSS/styling changes
- Clear about which elements are under test
- Less brittle than class/ID selectors

### 4. **Assertion Clarity**
Each assertion has a clear expected value, making failures easy to diagnose.

### 5. **State Verification**
Tests verify both positive states (element visible) and negative states (element not visible).

---

## Common Issues & Troubleshooting

### Issue: Tests timeout
**Solution:** Increase timeout in \`playwright.config.js\` or individual tests:
\`\`\`javascript
test('test name', async ({ page }) => {
    test.setTimeout(30000);
    // test code
});
\`\`\`

### Issue: "Element not found"
**Solution:** Ensure elements have correct \`data-testid\` attributes matching test selectors

### Issue: Cart count doesn't update
**Solution:** Verify cart state management correctly increments on add-to-cart action

### Issue: Price calculations incorrect
**Solution:** Check decimal handling in cart calculation logic—ensure no floating point errors

### Issue: Flaky tests
**Solution:** Add explicit waits if needed:
\`\`\`javascript
await page.waitForSelector('[data-testid="cart-count"]');
\`\`\`

---

## CI/CD Integration

The GitHub Actions workflow (\`.github/workflows/playwright.yml\`):

1. ✅ Checks out code
2. ✅ Sets up Node.js 20
3. ✅ Installs npm dependencies
4. ✅ Installs Playwright browsers
5. ✅ Builds the application
6. ✅ Runs test suite
7. ✅ Uploads test report artifacts

**Reports stored:** \`playwright-report/\` directory  
**Retention:** 30 days

---

## Maintenance & Updates

### Adding New Tests
1. Follow existing naming conventions: \`test('should [action]', ...)\`
2. Use appropriate testid selectors
3. Add comments for complex assertions
4. Include in appropriate \`describe()\` section

### Updating Product Data
If products change, update the test expectations in:
- Test 3: Product details
- Test 13-14: Price calculations
- Test 18: Final calculation

### Breaking Changes
If cart/product structure changes:
1. Review all affected testids
2. Update selectors accordingly
3. Verify calculations still accurate

---

## Best Practices

✅ **Use \`getByTestId()\` for primary selectors**  
✅ **Test user behaviors, not implementation**  
✅ **Keep tests focused on single feature**  
✅ **Use descriptive test names**  
✅ **Comment complex test logic**  
✅ **Verify both positive and negative cases**  
✅ **Use CI/CD to catch regressions early**  

❌ **Don't use brittle CSS selectors**  
❌ **Don't test implementation details**  
❌ **Don't create dependencies between tests**  
❌ **Don't hardcode waits without reason**  
❌ **Don't ignore flaky tests**

---

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright API Reference](https://playwright.dev/docs/api/class-page)
- [Best Practices Guide](https://playwright.dev/docs/best-practices)
- [GitHub Actions Setup](https://github.com/microsoft/playwright-github-action)

---

## Support & Reporting

For test failures or issues:
1. Check CI logs in GitHub Actions
2. Review uploaded test report artifacts
3. Run tests locally to reproduce
4. Check element selectors in browser DevTools
5. Verify application state and data
EOF
Output

