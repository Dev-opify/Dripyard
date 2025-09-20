let itemCount = 4;

function removeItem(button) {
    const item = button.closest('.wishlist-item');
    item.style.opacity = '0';
    item.style.transform = 'translateX(-100%)';
    
    setTimeout(() => {
        item.remove();
        itemCount--;
        updateItemCount();
    }, 300);
}

function updateItemCount() {
    document.querySelector('.section-title').textContent = `${itemCount} Items`;
    document.querySelector('.highlight-number').textContent = itemCount;
}

// Move to cart functionality
document.querySelectorAll('.move-to-cart-btn:not(.unavailable)').forEach(button => {
    button.addEventListener('click', function() {
        const productName = this.closest('.wishlist-item').querySelector('.product-name').textContent;
        alert(`"${productName}" moved to cart!`);
        removeItem(this.closest('.wishlist-item').querySelector('.remove-btn'));
    });
});

// View cart button
document.querySelector('.view-cart-btn').addEventListener('click', function() {
    alert('Navigating to cart...');
});

// Checkout button
document.querySelector('.checkout-btn').addEventListener('click', function() {
    alert('Proceeding to checkout...');
});
