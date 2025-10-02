// Backend API configuration
const API_BASE_URL = 'https://skillful-nature-production.up.railway.app';

// Token management
function getToken() {
    return localStorage.getItem('authToken');
}

// API call helper with query parameters support
async function apiCall(endpoint, method = 'GET', data = null, requiresAuth = false, queryParams = null) {
    const headers = {
        'Content-Type': 'application/json'
    };
    
    if (requiresAuth) {
        const token = getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }
    
    const config = {
        method,
        headers
    };
    
    if (data) {
        config.body = JSON.stringify(data);
    }
    
    try {
        let url = `${API_BASE_URL}${endpoint}`;
        if (queryParams) {
            const params = new URLSearchParams(queryParams);
            url += `?${params.toString()}`;
        }
        
        const response = await fetch(url, config);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'API request failed');
        }
        
        return result;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Global cart state
let cart = null;
let cartItems = [];

// Load cart from backend on page load
async function loadCart() {
    const token = getToken();
    if (!token) {
        console.warn('No auth token found. Please log in.');
        // Fallback to local products for demo
        cartItems = [
            { id: 1, product: { title: "DripYard Essential Hoodie", sellingPrice: 120 }, quantity: 2 },
            { id: 2, product: { title: "DripYard Elite Sneakers", sellingPrice: 180 }, quantity: 1 },
            { id: 3, product: { title: "DripYard Signature Cap", sellingPrice: 45 }, quantity: 1 }
        ];
        updateOrderSummary();
        return;
    }
    
    try {
        cart = await apiCall('/api/cart', 'GET', null, true);
        cartItems = cart.cartItems || [];
        console.log('Cart loaded:', cart);
        updateCartDisplay();
    } catch (error) {
        console.error('Failed to load cart:', error);
        alert('Failed to load cart. Please try again.');
    }
}

// Update cart display based on backend data
function updateCartDisplay() {
    const container = document.getElementById('cart-items-container');
    const emptyMessage = document.getElementById('empty-cart-message');
    
    if (!container) {
        updateOrderSummary();
        return;
    }
    
    if (cartItems.length === 0) {
        container.style.display = 'none';
        emptyMessage.style.display = 'block';
        return;
    }
    
    container.style.display = 'block';
    emptyMessage.style.display = 'none';
    
    // Render cart items dynamically
    container.innerHTML = cartItems.map((item, index) => {
        const product = item.product;
        const price = product.sellingPrice || item.sellingPrice;
        const total = price * item.quantity;
        
        return `
            <div class="cart-item">
                <div class="product-info">
                    <div class="product-image" style="background-image: url('${product.images?.[0] || ''}');"></div>
                    <div class="product-details">
                        <h3>${product.title || 'Unknown Product'}</h3>
                        <p class="product-color">Color: ${product.color || 'N/A'}</p>
                        ${item.size ? `<p class="product-size">Size: ${item.size}</p>` : ''}
                    </div>
                </div>
                <div class="price">$${price}</div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" id="qty-${index}" readonly>
                    <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
                <div class="item-total" id="total-${index}">$${total}</div>
                <button class="remove-btn" onclick="removeItem(${index})">×</button>
            </div>
        `;
    }).join('');
    
    updateOrderSummary();
}

// Fallback products for demo (when not logged in)
const products = [
    { name: "DripYard Essential Hoodie", price: 120, quantity: 2 },
    { name: "DripYard Elite Sneakers", price: 180, quantity: 1 },
    { name: "DripYard Signature Cap", price: 45, quantity: 1 }
];

async function updateQuantity(index, change) {
    const qtyInput = document.getElementById(`qty-${index}`);
    const totalElement = document.getElementById(`total-${index}`);
    
    let newQty = parseInt(qtyInput.value) + change;
    if (newQty < 1) newQty = 1;
    
    const token = getToken();
    if (token && cartItems[index]) {
        // Update via backend API
        try {
            const cartItem = cartItems[index];
            const updatedItem = await apiCall(`/api/cart/item/${cartItem.id}`, 'PUT', {
                id: cartItem.id,
                product: cartItem.product,
                size: cartItem.size,
                quantity: newQty,
                mrpPrice: cartItem.mrpPrice,
                sellingPrice: cartItem.sellingPrice,
                userId: cartItem.userId
            }, true);
            
            cartItems[index] = updatedItem;
            qtyInput.value = newQty;
            const itemTotal = cartItem.product.sellingPrice * newQty;
            totalElement.textContent = `$${itemTotal}`;
            
            // Reload full cart to get updated totals
            await loadCart();
            
        } catch (error) {
            console.error('Failed to update quantity:', error);
            alert('Failed to update item quantity. Please try again.');
        }
    } else {
        // Fallback to local update
        qtyInput.value = newQty;
        products[index].quantity = newQty;
        
        const itemTotal = products[index].price * newQty;
        totalElement.textContent = `$${itemTotal}`;
        
        updateOrderSummary();
    }
}

async function removeItem(index) {
    const token = getToken();
    if (token && cartItems[index]) {
        // Remove via backend API
        try {
            const cartItem = cartItems[index];
            await apiCall(`/api/cart/item/${cartItem.id}`, 'DELETE', null, true);
            
            // Remove from local state
            cartItems.splice(index, 1);
            
            // Remove from DOM
            const cartItemElement = document.querySelectorAll('.cart-item')[index];
            cartItemElement.remove();
            
            // Reload cart to get updated totals
            await loadCart();
            
        } catch (error) {
            console.error('Failed to remove item:', error);
            alert('Failed to remove item. Please try again.');
        }
    } else {
        // Fallback to local removal
        const cartItemElement = document.querySelectorAll('.cart-item')[index];
        cartItemElement.remove();
        products.splice(index, 1);
        updateOrderSummary();
    }
    
    setTimeout(() => {
        document.querySelectorAll('.quantity-btn').forEach((btn, btnIndex) => {
            const itemIndex = Math.floor(btnIndex / 2);
            const isIncrement = btnIndex % 2 === 1;
            btn.onclick = () => updateQuantity(itemIndex, isIncrement ? 1 : -1);
        });
        
        document.querySelectorAll('.remove-btn').forEach((btn, btnIndex) => {
            btn.onclick = () => removeItem(btnIndex);
        });
    }, 0);
}

function updateOrderSummary() {
    const token = getToken();
    if (token && cart) {
        // Use backend cart data
        const subtotal = cart.totalSellingPrice || 0;
        const discount = cart.discount || 0;
        const couponDiscount = cart.couponPrice || 0;
        const shipping = subtotal > 150 ? 0 : 15;
        const total = subtotal - couponDiscount + shipping;
        
        document.getElementById('subtotal').textContent = `$${subtotal}`;
        document.getElementById('shipping').textContent = shipping === 0 ? 'Free' : `$${shipping}`;
        document.getElementById('grand-total').textContent = `$${total}`;
        
        // Show coupon discount if applied
        if (couponDiscount > 0) {
            console.log(`Coupon discount applied: $${couponDiscount}`);
        }
    } else {
        // Fallback to local calculation
        const subtotal = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
        const shipping = subtotal > 150 ? 0 : 15;
        const total = subtotal + shipping;
        
        document.getElementById('subtotal').textContent = `$${subtotal}`;
        document.getElementById('shipping').textContent = shipping === 0 ? 'Free' : `$${shipping}`;
        document.getElementById('grand-total').textContent = `$${total}`;
    }
}

// document.querySelector('.checkout-btn').addEventListener('click', function() {
//     alert('Proceeding to checkout...');
// });

document.querySelector('.apply-btn').addEventListener('click', async function() {
    const couponCode = document.querySelector('.coupon-field').value;
    if (!couponCode.trim()) {
        alert('Please enter a coupon code.');
        return;
    }
    
    const token = getToken();
    if (!token) {
        alert('Please log in to apply coupons.');
        return;
    }
    
    try {
        // Calculate current order value
        const orderValue = cart ? cart.totalSellingPrice : products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
        
        // Apply coupon via backend API
        const updatedCart = await apiCall('/api/coupons/apply', 'POST', null, true, {
            apply: 'true',
            code: couponCode,
            orderValue: orderValue
        });
        
        cart = updatedCart;
        updateOrderSummary();
        
        alert(`Coupon "${couponCode}" applied successfully! Discount: $${updatedCart.couponPrice || 0}`);
        document.querySelector('.coupon-field').value = '';
        
    } catch (error) {
        console.error('Failed to apply coupon:', error);
        alert('Failed to apply coupon: ' + error.message);
    }
});

document.querySelectorAll('.cart-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#252525';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.backgroundColor = 'transparent';
    });
});

// Initialize cart on page load
window.addEventListener('load', function() {
    loadCart();
    
    // Check if user is logged in and show appropriate message
    const token = getToken();
    if (!token) {
        console.log('Not logged in - using demo data');
    } else {
        console.log('Logged in - loading cart from backend');
    }
});
