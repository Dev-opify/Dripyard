// Initialize page when DOM loads
document.addEventListener('DOMContentLoaded', async function() {
    // Check authentication status
    checkAuthStatus();
    
    // Load featured products
    await loadFeaturedProducts();
    
    // Load cart count if user is logged in
    await updateCartCount();
    
    // Initialize event listeners
    initializeEventListeners();
});

// Check authentication status and update UI
function checkAuthStatus() {
    const token = apiClient.getToken();
    const userMenu = document.getElementById('user-menu');
    const authLinks = document.getElementById('auth-links');
    
    if (token) {
        // User is logged in
        userMenu.style.display = 'block';
        authLinks.style.display = 'none';
    } else {
        // User is not logged in
        userMenu.style.display = 'none';
        authLinks.style.display = 'block';
    }
}

// Load featured products from API
async function loadFeaturedProducts() {
    try {
        // Show loading state
        const productsCarousel = document.querySelector('.products-carousel');
        productsCarousel.innerHTML = '<div class="loading-spinner">Loading products...</div>';
        
        // Fetch products from API
        const response = await apiClient.products.list({
            pageNumber: 0,
            pageSize: 5
        });
        
        // Clear loading state
        productsCarousel.innerHTML = '';
        
        if (response.content && response.content.length > 0) {
            response.content.forEach(product => {
                const productCard = createProductCard(product);
                productsCarousel.appendChild(productCard);
            });
        } else {
            productsCarousel.innerHTML = '<p>No products available at the moment.</p>';
        }
        
    } catch (error) {
        console.error('Error loading products:', error);
        const productsCarousel = document.querySelector('.products-carousel');
        productsCarousel.innerHTML = '<p>Error loading products. Please try again later.</p>';
    }
}

// Create product card element
function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.innerHTML = `
        <img src="${getProductImageUrl(product)}" alt="${product.title}" 
             onerror="this.src='https://via.placeholder.com/300x300?text=No+Image'" />
        <div class="product-info">
            <h4>${product.title}</h4>
            <p>${product.description || 'Premium streetwear design'}</p>
            <div class="price-info">
                ${product.mrpPrice > product.sellingPrice ? 
                    `<span class="price">₹${product.sellingPrice}</span>
                     <span class="original-price">₹${product.mrpPrice}</span>` : 
                    `<span class="price">₹${product.sellingPrice}</span>`
                }
            </div>
            <div class="product-actions">
                <button onclick="addToCart(${product.id})" class="add-to-cart-btn">
                    Add to Cart
                </button>
                <button onclick="viewProduct(${product.id})" class="view-details-btn">
                    View Details
                </button>
            </div>
        </div>
    `;
    return productCard;
}

// Get product image URL (use first image or placeholder)
function getProductImageUrl(product) {
    if (product.images && product.images.length > 0) {
        // If the image is a relative path, prepend the API base URL
        const image = product.images[0];
        if (image.startsWith('http')) {
            return image;
        } else {
            return `${apiClient.BASE_URL}/api/images/${image}`;
        }
    }
    return 'https://via.placeholder.com/300x300?text=No+Image';
}

// Add product to cart
async function addToCart(productId) {
    const token = apiClient.getToken();
    if (!token) {
        alert('Please login to add items to cart');
        window.location.href = '../login/index.html';
        return;
    }
    
    try {
        await apiClient.cart.add({
            productId: productId,
            size: 'M', // Default size, should be configurable
            quantity: 1,
            price: 0 // Will be calculated by backend
        });
        
        showSuccess('Product added to cart!');
        await updateCartCount();
        
    } catch (error) {
        console.error('Error adding to cart:', error);
        showError('Failed to add product to cart');
    }
}

// View product details
function viewProduct(productId) {
    window.location.href = `../productDetails/index.html?id=${productId}`;
}

// Update cart count
async function updateCartCount() {
    const token = apiClient.getToken();
    if (!token) return;
    
    try {
        const cart = await apiClient.cart.get();
        const cartCountElement = document.getElementById('cart-count');
        
        if (cart && cart.totalItem > 0) {
            cartCountElement.textContent = cart.totalItem;
            cartCountElement.style.display = 'inline-block';
        } else {
            cartCountElement.style.display = 'none';
        }
        
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
}

// Initialize event listeners
function initializeEventListeners() {
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            apiClient.setToken(null);
            localStorage.removeItem('auth_token');
            showSuccess('Logged out successfully!');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        });
    }
}

// Helper functions for showing messages
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
    `;
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ef4444;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}
