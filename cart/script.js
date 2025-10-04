// Use centralized API client
function getToken() { return apiClient.getToken(); }

// Global cart state
let cart = null;
let cartItems = [];

// Build image URL for product image keys
function imageUrl(keyOrUrl){
  if (!keyOrUrl) return 'https://via.placeholder.com/80x80?text=No+Image';
  return keyOrUrl.startsWith('http') ? keyOrUrl : `${apiClient.BASE_URL}/api/images/${keyOrUrl}`;
}

// Format currency (₹)
function money(v){
  const n = Number(v||0);
  return `₹${n.toLocaleString('en-IN')}`;
}

// Load cart from backend on page load
async function loadCart() {
    const token = getToken();
    if (!token) {
        // Not logged in: show empty message
        cart = null;
        cartItems = [];
        updateCartDisplay();
        return;
    }
    
    try {
        cart = await apiClient.cart.get();
        cartItems = cart.cartItems || [];
        updateCartDisplay();
    } catch (error) {
        console.error('Failed to load cart:', error);
        showError('Failed to load cart. Please try again.');
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
        // Also reset totals
        document.getElementById('subtotal').textContent = money(0);
        document.getElementById('shipping').textContent = money(0);
        document.getElementById('grand-total').textContent = money(0);
        return;
    }
    
    container.style.display = 'block';
    emptyMessage.style.display = 'none';
    
    // Render cart items dynamically
    container.innerHTML = cartItems.map((item, index) => {
        const product = item.product || {};
        const price = product.sellingPrice ?? item.sellingPrice ?? 0;
        const total = price * item.quantity;
        const imgKey = (product.images && product.images[0]) ? product.images[0] : null;
        
        return `
            <div class="cart-item">
                <div class="product-info">
                    <div class="product-image" style="background-image: url('${imageUrl(imgKey)}');"></div>
                    <div class="product-details">
                        <h3>${product.title || 'Product'}</h3>
                        <p class="product-color">Color: ${product.color || 'N/A'}</p>
                        ${item.size ? `<p class="product-size">Size: ${item.size}</p>` : ''}
                    </div>
                </div>
                <div class="price">${money(price)}</div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" id="qty-${index}" readonly>
                    <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
                <div class="item-total" id="total-${index}">${money(total)}</div>
                <button class="remove-btn" onclick="removeItem(${index})">×</button>
            </div>
        `;
    }).join('');
    
    updateOrderSummary();
}

// Fallback data removed to avoid drift

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
            const updatedItem = await apiClient.cart.updateItem(cartItem.id, {
                id: cartItem.id,
                product: cartItem.product,
                size: cartItem.size,
                quantity: newQty,
                mrpPrice: cartItem.mrpPrice,
                sellingPrice: cartItem.sellingPrice,
                userId: cartItem.userId
            });
            
            cartItems[index] = updatedItem;
            qtyInput.value = newQty;
            const itemTotal = (cartItem.product?.sellingPrice ?? cartItem.sellingPrice ?? 0) * newQty;
            totalElement.textContent = money(itemTotal);
            
            // Reload full cart to get updated totals
            await loadCart();
            
        } catch (error) {
            console.error('Failed to update quantity:', error);
            showError('Failed to update item quantity. Please try again.');
        }
    }
}

async function removeItem(index) {
    const token = getToken();
    if (token && cartItems[index]) {
        // Remove via backend API
        try {
            const cartItem = cartItems[index];
            await apiClient.cart.deleteItem(cartItem.id);
            
            // Remove from local state
            cartItems.splice(index, 1);
            
            // Reload cart to get updated totals
            await loadCart();
            
        } catch (error) {
            console.error('Failed to remove item:', error);
            showError('Failed to remove item. Please try again.');
        }
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
        const couponDiscount = cart.couponPrice || 0;
        const shipping = subtotal >= 800 ? 0 : 99; // example rule
        const total = subtotal - (couponDiscount || 0) + shipping;
        
        document.getElementById('subtotal').textContent = money(subtotal);
        document.getElementById('shipping').textContent = shipping === 0 ? 'Free' : money(shipping);
        document.getElementById('grand-total').textContent = money(total);
    } else {
        // Guest cart is empty in integrated mode
        document.getElementById('subtotal').textContent = money(0);
        document.getElementById('shipping').textContent = money(0);
        document.getElementById('grand-total').textContent = money(0);
    }
}

// document.querySelector('.checkout-btn').addEventListener('click', function() {
//     alert('Proceeding to checkout...');
// });

document.querySelector('.apply-btn').addEventListener('click', async function() {
    const couponCode = document.querySelector('.coupon-field').value;
    if (!couponCode.trim()) {
        showError('Please enter a coupon code.');
        return;
    }
    
    const token = getToken();
    if (!token) {
        showError('Please log in to apply coupons.');
        return;
    }
    
    try {
        const orderValue = cart ? cart.totalSellingPrice : 0;
        const updatedCart = await apiClient.admin.coupons.apply({ apply:'true', code: couponCode, orderValue });
        cart = updatedCart;
        updateOrderSummary();
        showSuccess(`Coupon "${couponCode}" applied! Discount: ${money(updatedCart.couponPrice || 0)}`);
        document.querySelector('.coupon-field').value = '';
    } catch (error) {
        console.error('Failed to apply coupon:', error);
        showError('Failed to apply coupon: ' + error.message);
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

// Toast helpers
function showSuccess(msg){
  const d=document.createElement('div');
  d.style.cssText='position:fixed;top:20px;right:20px;background:#10b981;color:#fff;padding:10px 14px;border-radius:6px;z-index:9999;box-shadow:0 2px 8px rgba(0,0,0,.2)';
  d.textContent=msg;document.body.appendChild(d);setTimeout(()=>d.remove(),3000);
}
function showError(msg){
  const d=document.createElement('div');
  d.style.cssText='position:fixed;top:20px;right:20px;background:#ef4444;color:#fff;padding:10px 14px;border-radius:6px;z-index:9999;box-shadow:0 2px 8px rgba(0,0,0,.2)';
  d.textContent=msg;document.body.appendChild(d);setTimeout(()=>d.remove(),4000);
}

// Initialize cart on page load
window.addEventListener('load', function() {
  loadCart();
});
