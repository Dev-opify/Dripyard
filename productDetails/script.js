// Global variables
let currentProduct = null;
let selectedSize = null;
let selectedColor = null;
let productReviews = [];

// Initialize page when DOM loads
document.addEventListener('DOMContentLoaded', async function() {
    // Get product ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        showError('Product ID is missing from URL');
        return;
    }
    
    // Check authentication status
    checkAuthStatus();
    
    // Load product details
    await loadProductDetails(productId);
    
    // Load product reviews
    await loadProductReviews(productId);
    
    // Load related products
    await loadRelatedProducts();
    
    // Update cart count
    await updateCartCount();
    
    // Initialize event listeners
    initializeEventListeners();
});

// Check authentication status
function checkAuthStatus() {
    const token = apiClient.getToken();
    const userMenu = document.getElementById('user-menu');
    const authLinks = document.getElementById('auth-links');
    
    if (token) {
        userMenu.style.display = 'block';
        authLinks.style.display = 'none';
    } else {
        userMenu.style.display = 'none';
        authLinks.style.display = 'block';
    }
}

// Load product details from API
async function loadProductDetails(productId) {
    try {
        showLoading('Loading product details...');
        
        const product = await apiClient.products.get(productId);
        currentProduct = product;
        
        // Update page title
        document.title = `${product.title} - DRIP YARD`;
        
        // Update product information
        updateProductDisplay(product);
        
        hideLoading();
        
    } catch (error) {
        console.error('Error loading product details:', error);
        showError('Failed to load product details');
        hideLoading();
    }
}

// Update product display with data
function updateProductDisplay(product) {
    // Update product title
    document.querySelector('h1').textContent = product.title;
    
    // Update price section
    const priceSection = document.querySelector('.price-section');
    const hasDiscount = product.mrpPrice > product.sellingPrice;
    
    priceSection.innerHTML = `
        <span class="current-price">₹${product.sellingPrice}</span>
        ${hasDiscount ? `<span class="original-price">₹${product.mrpPrice}</span>` : ''}
        ${hasDiscount ? `<span class="discount-badge">${Math.round(((product.mrpPrice - product.sellingPrice) / product.mrpPrice) * 100)}% OFF</span>` : ''}
    `;
    
    // Update description
    document.querySelector('.description').textContent = product.description || 'Premium quality streetwear designed for comfort and style.';
    
    // Update rating
    const rating = product.numRatings > 0 ? 4.5 : 4; // Default rating
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);
    
    let starsHtml = '★'.repeat(fullStars);
    if (hasHalfStar) starsHtml += '☆';
    starsHtml += '☆'.repeat(emptyStars);
    
    document.querySelector('.stars').innerHTML = starsHtml;
    document.querySelector('.review-count').textContent = `(${product.reviews?.length || 0} reviews)`;
    
    // Update product images
    updateProductImages(product.images);
    
    // Update sizes
    updateSizeOptions(product.sizes);
    
    // Update colors
    updateColorOptions(product.color);
}

// Update product images
function updateProductImages(images) {
    const mainImage = document.getElementById('mainImage');
    const thumbnailGrid = document.querySelector('.thumbnail-grid');
    
    if (images && images.length > 0) {
        // Set main image
        const firstImageUrl = getImageUrl(images[0]);
        mainImage.style.backgroundImage = `url(${firstImageUrl})`;
        mainImage.style.backgroundSize = 'cover';
        mainImage.style.backgroundPosition = 'center';
        
        // Update thumbnails
        thumbnailGrid.innerHTML = '';
        images.slice(0, 4).forEach((image, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
            thumbnail.style.backgroundImage = `url(${getImageUrl(image)})`;
            thumbnail.style.backgroundSize = 'cover';
            thumbnail.style.backgroundPosition = 'center';
            thumbnail.addEventListener('click', () => {
                // Update main image
                mainImage.style.backgroundImage = `url(${getImageUrl(image)})`;
                // Update active thumbnail
                document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                thumbnail.classList.add('active');
            });
            thumbnailGrid.appendChild(thumbnail);
        });
    } else {
        // Default placeholder
        mainImage.style.backgroundImage = 'url(https://via.placeholder.com/500x500?text=No+Image)';
        mainImage.style.backgroundSize = 'cover';
        mainImage.style.backgroundPosition = 'center';
    }
}

// Get image URL helper
function getImageUrl(image) {
    if (image.startsWith('http')) {
        return image;
    } else {
        return `${apiClient.BASE_URL}/api/images/${image}`;
    }
}

// Update size options
function updateSizeOptions(sizes) {
    const sizeOptionsContainer = document.querySelector('.size-options');
    sizeOptionsContainer.innerHTML = '';
    
    if (sizes) {
        const sizeArray = sizes.split(',').map(s => s.trim());
        sizeArray.forEach((size, index) => {
            const sizeBtn = document.createElement('button');
            sizeBtn.className = `size-option ${index === 1 ? 'selected' : ''}`; // Default to second size (usually M)
            sizeBtn.textContent = size;
            sizeBtn.addEventListener('click', () => {
                document.querySelectorAll('.size-option').forEach(b => b.classList.remove('selected'));
                sizeBtn.classList.add('selected');
                selectedSize = size;
            });
            sizeOptionsContainer.appendChild(sizeBtn);
            
            if (index === 1) selectedSize = size; // Set default selected size
        });
    }
}

// Update color options
function updateColorOptions(color) {
    const colorOptionsContainer = document.querySelector('.color-options');
    colorOptionsContainer.innerHTML = '';
    
    // For now, just show the product color and some common alternatives
    const colors = [color || 'black', 'white', 'red', 'blue'];
    colors.forEach((colorName, index) => {
        const colorDiv = document.createElement('div');
        colorDiv.className = `color-option color-${colorName.toLowerCase()} ${index === 0 ? 'selected' : ''}`;
        colorDiv.addEventListener('click', () => {
            document.querySelectorAll('.color-option').forEach(c => c.classList.remove('selected'));
            colorDiv.classList.add('selected');
            selectedColor = colorName;
        });
        colorOptionsContainer.appendChild(colorDiv);
        
        if (index === 0) selectedColor = colorName; // Set default selected color
    });
}

// Load product reviews
async function loadProductReviews(productId) {
    try {
        const reviews = await apiClient.products.reviews.listByProduct(productId);
        productReviews = reviews;
        
        // Update reviews tab count
        const reviewsTab = document.querySelector('.tab-btn:last-child');
        reviewsTab.textContent = `Reviews (${reviews.length})`;
        
    } catch (error) {
        console.error('Error loading reviews:', error);
    }
}

// Load related products
async function loadRelatedProducts() {
    try {
        const response = await apiClient.products.list({
            pageNumber: 0,
            pageSize: 4
        });
        
        const productGrid = document.querySelector('.product-grid');
        productGrid.innerHTML = '';
        
        if (response.content && response.content.length > 0) {
            response.content.forEach(product => {
                const productCard = createRelatedProductCard(product);
                productGrid.appendChild(productCard);
            });
        }
        
    } catch (error) {
        console.error('Error loading related products:', error);
    }
}

// Create related product card
function createRelatedProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-image" style="background-image: url(${getProductImageUrl(product)}); background-size: cover; background-position: center;"></div>
        <div class="product-info">
            <h3 class="product-title">${product.title}</h3>
            <div class="product-price">
                <span class="price">₹${product.sellingPrice}</span>
                ${product.mrpPrice > product.sellingPrice ? `<span class="old-price">₹${product.mrpPrice}</span>` : ''}
            </div>
            <div class="color-dots">
                <div class="color-dot" style="background: ${getColorCode(product.color || 'black')};"></div>
            </div>
        </div>
    `;
    
    card.addEventListener('click', () => {
        window.location.href = `index.html?id=${product.id}`;
    });
    
    return card;
}

// Get product image URL for related products
function getProductImageUrl(product) {
    if (product.images && product.images.length > 0) {
        return getImageUrl(product.images[0]);
    }
    return 'https://via.placeholder.com/200x200?text=No+Image';
}

// Get color code helper
function getColorCode(colorName) {
    const colorCodes = {
        'black': '#000',
        'white': '#fff',
        'red': '#e53935',
        'blue': '#1976d2',
        'gray': '#666',
        'grey': '#666',
        'navy': '#1976d2',
        'green': '#4caf50'
    };
    return colorCodes[colorName.toLowerCase()] || '#000';
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
    // Quantity controls
    window.increaseQuantity = function() {
        const input = document.getElementById('quantity');
        input.value = parseInt(input.value) + 1;
    };
    
    window.decreaseQuantity = function() {
        const input = document.getElementById('quantity');
        if (parseInt(input.value) > 1) {
            input.value = parseInt(input.value) - 1;
        }
    };
    
    // Tab functionality
    window.showTab = function(tab) {
        const content = document.getElementById('tab-content');
        const buttons = document.querySelectorAll('.tab-btn');
        
        buttons.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        switch(tab) {
            case 'details':
                content.innerHTML = `
                    <p>${currentProduct?.description || 'Premium quality streetwear designed for comfort and style.'}</p>
                    <ul class="features">
                        <li>Premium cotton blend</li>
                        <li>Comfortable fit</li>
                        <li>Machine washable</li>
                        <li>Durable construction</li>
                    </ul>
                `;
                break;
            case 'materials':
                content.innerHTML = `
                    <p>High-quality materials sourced for durability and comfort.</p>
                    <ul class="features">
                        <li>Premium fabric blend</li>
                        <li>Reinforced seams</li>
                        <li>Colorfast dyes</li>
                        <li>Environmentally conscious</li>
                    </ul>
                `;
                break;
            case 'reviews':
                if (productReviews.length > 0) {
                    content.innerHTML = productReviews.map(review => `
                        <div class="review">
                            <div class="review-rating">${'★'.repeat(Math.floor(review.rating))}${'☆'.repeat(5 - Math.floor(review.rating))}</div>
                            <p class="review-text">"${review.reviewText}"</p>
                            <span class="review-author">- ${review.user?.fullName || 'Customer'}</span>
                        </div>
                    `).join('');
                } else {
                    content.innerHTML = '<p>No reviews yet. Be the first to review this product!</p>';
                }
                break;
        }
    };
    
    // Add to cart button
    document.getElementById('add-to-cart-btn').addEventListener('click', async () => {
        await addToCart();
    });
    
    // Buy now button
    document.getElementById('buy-now-btn').addEventListener('click', async () => {
        await addToCart();
        // Redirect to cart page
        window.location.href = '../cart/index.html';
    });
    
    // Wishlist button
    document.getElementById('wishlist-btn').addEventListener('click', async () => {
        await addToWishlist();
    });
    
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            apiClient.setToken(null);
            localStorage.removeItem('auth_token');
            showSuccess('Logged out successfully!');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        });
    }
}

// Add product to cart
async function addToCart() {
    const token = apiClient.getToken();
    if (!token) {
        showError('Please login to add items to cart');
        window.location.href = '../login/index.html';
        return;
    }
    
    if (!currentProduct) {
        showError('Product information is not loaded');
        return;
    }
    
    const quantity = parseInt(document.getElementById('quantity').value);
    
    try {
        await apiClient.cart.add({
            productId: currentProduct.id,
            size: selectedSize || 'M',
            quantity: quantity,
            price: currentProduct.sellingPrice
        });
        
        showSuccess('Product added to cart!');
        await updateCartCount();
        
    } catch (error) {
        console.error('Error adding to cart:', error);
        showError('Failed to add product to cart');
    }
}

// Add product to wishlist
async function addToWishlist() {
    const token = apiClient.getToken();
    if (!token) {
        showError('Please login to add items to wishlist');
        window.location.href = '../login/index.html';
        return;
    }
    
    if (!currentProduct) {
        showError('Product information is not loaded');
        return;
    }
    
    try {
        await apiClient.wishlist.addProduct(currentProduct.id);
        showSuccess('Product added to wishlist!');
        
        // Update wishlist button appearance
        const wishlistBtn = document.getElementById('wishlist-btn');
        wishlistBtn.innerHTML = '♥'; // Filled heart
        wishlistBtn.style.color = 'red';
        
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        showError('Failed to add product to wishlist');
    }
}

// Helper functions for showing messages and loading states
function showLoading(message = 'Loading...') {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading-overlay';
    loadingDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        color: white;
        font-size: 18px;
    `;
    loadingDiv.textContent = message;
    document.body.appendChild(loadingDiv);
}

function hideLoading() {
    const loadingDiv = document.getElementById('loading-overlay');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

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
