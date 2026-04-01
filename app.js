// Product Data
const products = [
    {
        id: 1,
        name: "Premium Headphones",
        price: 99.99,
        description: "High-quality wireless headphones with noise cancellation",
        icon: "fa-headphones"
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 199.99,
        description: "Fitness tracker with heart rate monitor",
        icon: "fa-clock"
    },
    {
        id: 3,
        name: "Laptop Backpack",
        price: 49.99,
        description: "Water-resistant backpack with laptop compartment",
        icon: "fa-bag-shopping"
    },
    {
        id: 4,
        name: "Wireless Mouse",
        price: 29.99,
        description: "Ergonomic wireless mouse with long battery life",
        icon: "fa-computer-mouse"
    },
    {
        id: 5,
        name: "USB-C Hub",
        price: 39.99,
        description: "7-in-1 USB-C hub with 4K HDMI",
        icon: "fa-usb"
    },
    {
        id: 6,
        name: "Phone Stand",
        price: 19.99,
        description: "Adjustable aluminum phone stand",
        icon: "fa-mobile-alt"
    }
];

// Cart Array
let cart = [];

// DOM Elements
const productGrid = document.getElementById('product-grid');
const cartCount = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalSpan = document.getElementById('cart-total');
const closeBtn = document.querySelector('.close');
const cartIcon = document.querySelector('.cart-icon');

// Load products on page load
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    loadCartFromLocalStorage();
    updateCartDisplay();
});

// Display Products
function displayProducts() {
    productGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                <i class="fas ${product.icon}"></i>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <p class="product-description">${product.description}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    saveCartToLocalStorage();
    showNotification('Item added to cart!');
}

// Update Cart Display
function updateCartDisplay() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart modal content
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center;">Your cart is empty</p>';
        cartTotalSpan.textContent = '0';
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        </div>
    `).join('');
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalSpan.textContent = total.toFixed(2);
}

// Update Quantity
function updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        updateCartDisplay();
        saveCartToLocalStorage();
    }
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    saveCartToLocalStorage();
    showNotification('Item removed from cart');
}

// Save Cart to Local Storage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Load Cart from Local Storage
function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
}

// Show Notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #4CAF50;
        color: white;
        padding: 12px 20px;
        border-radius: 5px;
        z-index: 1002;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 2 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Modal Functionality
cartIcon.onclick = () => {
    cartModal.style.display = 'block';
    updateCartDisplay();
};

closeBtn.onclick = () => {
    cartModal.style.display = 'none';
};

window.onclick = (event) => {
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
};

// Checkout Functionality
document.querySelector('.checkout-btn').onclick = () => {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    alert('Thank you for your purchase! Your order has been placed.');
    cart = [];
    updateCartDisplay();
    saveCartToLocalStorage();
    cartModal.style.display = 'none';
    showNotification('Order placed successfully!');
};

// Smooth Scroll for Navigation Links
document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    });
});