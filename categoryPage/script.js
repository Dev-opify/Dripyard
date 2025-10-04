// Initialize page when DOM loads
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Page loaded, starting to load products...');
    console.log('API Base URL:', apiClient.BASE_URL);
    await loadProducts();
    initializeFilters();
    initializeInteractivity();
});

// Global variables for pagination and filtering
let currentPage = 0;
let totalPages = 0;
let currentFilters = {
    category: null,
    brand: null,
    color: null,
    size: null,
    minPrice: null,
    maxPrice: null
};

// Load products from API
async function loadProducts(page = 0, replace = true) {
    try {
        const productsGrid = document.querySelector('.products-grid');
        const productsInfo = document.querySelector('.products-info');
        
        if (replace) {
            productsGrid.innerHTML = '<div class="loading-spinner">Loading products...</div>';
        }
        
        // Build query parameters
        const queryParams = {
            pageNumber: page,
            pageSize: 12,
            ...currentFilters
        };
        
        // Remove null/undefined values
        Object.keys(queryParams).forEach(key => {
            if (queryParams[key] === null || queryParams[key] === undefined || queryParams[key] === '') {
                delete queryParams[key];
            }
        });
        
        console.log('API Request URL:', `${apiClient.BASE_URL}/api/products`);
        console.log('Query Parameters:', queryParams);
        console.log('Auth token exists:', !!apiClient.getToken());
        
        const response = await apiClient.products.list(queryParams);
        
        console.log('API Response:', response);
        
        if (replace) {
            productsGrid.innerHTML = '';
        }
        
        if (response.content && response.content.length > 0) {
            response.content.forEach(product => {
                const productCard = createProductCard(product);
                productsGrid.appendChild(productCard);
            });
            
            // Update pagination info
            currentPage = response.number;
            totalPages = response.totalPages;
            const totalProducts = response.totalElements;
            const showingStart = (response.number * response.size) + 1;
            const showingEnd = Math.min((response.number + 1) * response.size, totalProducts);
            
            productsInfo.textContent = `Showing ${showingStart}-${showingEnd} of ${totalProducts} products`;
            
            // Update load more button
            updateLoadMoreButton();
            
        } else if (replace) {
            productsGrid.innerHTML = '<p class="no-products">No products found matching your criteria.</p>';
            productsInfo.textContent = 'Showing 0 products';
        }
        
    } catch (error) {
        console.error('Error loading products:', error);
        const productsGrid = document.querySelector('.products-grid');
        if (replace) {
            productsGrid.innerHTML = '<p class="error-message">Error loading products. Please try again later.</p>';
        }
    }
}

// Create product card element
function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    
    // Calculate discount percentage
    const discountPercent = product.mrpPrice > product.sellingPrice ? 
        Math.round(((product.mrpPrice - product.sellingPrice) / product.mrpPrice) * 100) : 0;
    
    // Generate star rating
    const rating = product.numRatings > 0 ? Math.min(5, Math.max(1, 4)) : 4; // Default to 4 stars
    const stars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
    
    productCard.innerHTML = `
        <a href="../productDetails/index.html?id=${product.id}" style="text-decoration: none; color: inherit;">
            <div class="product-image">
                ${discountPercent > 0 ? `<div class="sale-badge">-${discountPercent}%</div>` : ''}
                <div class="view-icon">👁</div>
                <img src="${getProductImageUrl(product)}" alt="${product.title}" 
                     onerror="this.src='https://via.placeholder.com/300x300?text=No+Image'" />
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.title}</h3>
                <div class="rating">
                    <span class="stars">${stars}</span>
                    <span class="rating-count">(${product.numRatings || 0})</span>
                </div>
                <div class="price">
                    ₹${product.sellingPrice}
                    ${product.mrpPrice > product.sellingPrice ? 
                        `<span class="original-price">₹${product.mrpPrice}</span>` : ''}
                </div>
                <div class="color-variants">
                    <div class="color-dot ${(product.color || 'black').toLowerCase()}"></div>
                </div>
                <div class="sizes-available">Sizes: ${product.sizes || 'S, M, L, XL'}</div>
            </div>
        </a>
    `;
    
    return productCard;
}

// Get product image URL
function getProductImageUrl(product) {
    if (product.images && product.images.length > 0) {
        const image = product.images[0];
        if (image.startsWith('http')) {
            return image;
        } else {
            return `${apiClient.BASE_URL}/api/images/${image}`;
        }
    }
    return 'https://via.placeholder.com/300x300?text=No+Image';
}

// Initialize filters
function initializeFilters() {
    // Size filter functionality
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Toggle active state
            const isActive = this.classList.contains('active');
            if (isActive) {
                this.classList.remove('active');
                currentFilters.size = null;
            } else {
                // Remove active from all size buttons
                document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentFilters.size = this.textContent;
            }
            
            // Reload products with new filter
            loadProducts(0, true);
        });
    });
    
    // Color filter functionality
    document.querySelectorAll('.color-option input').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                // Uncheck other color options
                document.querySelectorAll('.color-option input').forEach(cb => {
                    if (cb !== this) cb.checked = false;
                });
                currentFilters.color = this.parentElement.textContent.trim();
            } else {
                currentFilters.color = null;
            }
            
            // Reload products with new filter
            loadProducts(0, true);
        });
    });
    
    // Price filter functionality
    document.querySelectorAll('.price-option input').forEach(radio => {
        radio.addEventListener('change', function() {
            const priceText = this.parentElement.textContent.trim();
            
            if (priceText.includes('Under $30')) {
                currentFilters.maxPrice = 30;
                currentFilters.minPrice = null;
            } else if (priceText.includes('$30 - $40')) {
                currentFilters.minPrice = 30;
                currentFilters.maxPrice = 40;
            } else if (priceText.includes('$40 - $50')) {
                currentFilters.minPrice = 40;
                currentFilters.maxPrice = 50;
            } else if (priceText.includes('Over $50')) {
                currentFilters.minPrice = 50;
                currentFilters.maxPrice = null;
            }
            
            console.log('Price filter applied:', currentFilters);
            
            // Reload products with new filter
            loadProducts(0, true);
        });
    });
}

// Initialize other interactivity
function initializeInteractivity() {
    // Product card hover effects
    document.addEventListener('click', function(e) {
        if (e.target.closest('.product-card')) {
            const card = e.target.closest('.product-card');
            card.style.transform = 'scale(1.02)';
            setTimeout(() => {
                card.style.transform = '';
            }, 200);
        }
    });
}

// Update load more button
function updateLoadMoreButton() {
    let loadMoreBtn = document.querySelector('.load-more-btn');
    
    if (!loadMoreBtn) {
        // Create load more button if it doesn't exist
        loadMoreBtn = document.createElement('button');
        loadMoreBtn.className = 'load-more-btn';
        loadMoreBtn.textContent = 'Load More Products';
        
        // Add to page
        const productsSection = document.querySelector('.products-section');
        productsSection.appendChild(loadMoreBtn);
        
        // Add event listener
        loadMoreBtn.addEventListener('click', async function() {
            if (currentPage < totalPages - 1) {
                this.textContent = 'Loading...';
                this.disabled = true;
                
                try {
                    await loadProducts(currentPage + 1, false);
                } catch (error) {
                    console.error('Error loading more products:', error);
                } finally {
                    this.disabled = false;
                }
            }
        });
    }
    
    // Show/hide button based on pagination
    if (currentPage < totalPages - 1) {
        loadMoreBtn.style.display = 'block';
        loadMoreBtn.textContent = 'Load More Products';
    } else {
        loadMoreBtn.style.display = 'none';
    }
}
