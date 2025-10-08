import { useState } from 'react';

function App() {
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Sample products
    const products = [
        { id: 1, name: 'Wireless Mouse', price: 29.99, image: '🖱️', stock: 15 },
        {
            id: 2,
            name: 'Mechanical Keyboard',
            price: 89.99,
            image: '⌨️',
            stock: 8,
        },
        { id: 3, name: 'USB-C Cable', price: 12.99, image: '🔌', stock: 25 },
        { id: 4, name: 'Laptop Stand', price: 45.99, image: '💻', stock: 12 },
        { id: 5, name: 'Webcam HD', price: 69.99, image: '📷', stock: 6 },
        { id: 6, name: 'Headphones', price: 79.99, image: '🎧', stock: 10 },
    ];

    const addToCart = (product) => {
        const existingItem = cart.find((item) => item.id === product.id);

        if (existingItem) {
            setCart(
                cart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            );
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter((item) => item.id !== productId));
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity === 0) {
            removeFromCart(productId);
        } else {
            setCart(
                cart.map((item) =>
                    item.id === productId
                        ? { ...item, quantity: newQuantity }
                        : item
                )
            );
        }
    };

    const getTotalItems = () => {
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    };

    const getTotalPrice = () => {
        return cart
            .reduce((sum, item) => sum + item.price * item.quantity, 0)
            .toFixed(2);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1
                        className="text-2xl font-bold text-gray-800"
                        data-testid="app-title"
                    >
                        Tech Store
                    </h1>
                    <button
                        onClick={() => setIsCartOpen(!isCartOpen)}
                        className="relative bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                        data-testid="cart-button"
                    >
                        🛒 Cart
                        {getTotalItems() > 0 && (
                            <span
                                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center"
                                data-testid="cart-count"
                            >
                                {getTotalItems()}
                            </span>
                        )}
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Product Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                            data-testid={`product-${product.id}`}
                        >
                            <div className="text-6xl text-center mb-4">
                                {product.image}
                            </div>
                            <h2
                                className="text-xl font-semibold text-gray-800 mb-2"
                                data-testid={`product-name-${product.id}`}
                            >
                                {product.name}
                            </h2>
                            <div className="flex justify-between items-center mb-4">
                                <span
                                    className="text-2xl font-bold text-blue-600"
                                    data-testid={`product-price-${product.id}`}
                                >
                                    ${product.price}
                                </span>
                                <span
                                    className="text-sm text-gray-500"
                                    data-testid={`product-stock-${product.id}`}
                                >
                                    Stock: {product.stock}
                                </span>
                            </div>
                            <button
                                onClick={() => addToCart(product)}
                                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                                data-testid={`add-to-cart-${product.id}`}
                            >
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            </main>

            {/* Shopping Cart Sidebar */}
            {isCartOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20"
                    onClick={() => setIsCartOpen(false)}
                >
                    <div
                        className="fixed right-0 top-0 h-full w-full md:w-96 bg-white shadow-xl p-6 overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                        data-testid="cart-sidebar"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">
                                Shopping Cart
                            </h2>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                                data-testid="close-cart"
                            >
                                ×
                            </button>
                        </div>

                        {cart.length === 0 ? (
                            <p
                                className="text-gray-500 text-center py-8"
                                data-testid="empty-cart-message"
                            >
                                Your cart is empty
                            </p>
                        ) : (
                            <>
                                <div className="space-y-4 mb-6">
                                    {cart.map((item) => (
                                        <div
                                            key={item.id}
                                            className="border rounded-lg p-4"
                                            data-testid={`cart-item-${item.id}`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3
                                                        className="font-semibold"
                                                        data-testid={`cart-item-name-${item.id}`}
                                                    >
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-gray-600">
                                                        ${item.price}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        removeFromCart(item.id)
                                                    }
                                                    className="text-red-500 hover:text-red-700"
                                                    data-testid={`remove-item-${item.id}`}
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.id,
                                                                item.quantity -
                                                                    1
                                                            )
                                                        }
                                                        className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                                                        data-testid={`decrease-quantity-${item.id}`}
                                                    >
                                                        -
                                                    </button>
                                                    <span
                                                        className="font-semibold"
                                                        data-testid={`item-quantity-${item.id}`}
                                                    >
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.id,
                                                                item.quantity +
                                                                    1
                                                            )
                                                        }
                                                        className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                                                        data-testid={`increase-quantity-${item.id}`}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <span
                                                    className="font-bold"
                                                    data-testid={`item-subtotal-${item.id}`}
                                                >
                                                    $
                                                    {(
                                                        item.price *
                                                        item.quantity
                                                    ).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t pt-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-xl font-semibold">
                                            Total:
                                        </span>
                                        <span
                                            className="text-2xl font-bold text-blue-600"
                                            data-testid="cart-total"
                                        >
                                            ${getTotalPrice()}
                                        </span>
                                    </div>
                                    <button
                                        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold"
                                        data-testid="checkout-button"
                                    >
                                        Checkout
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
