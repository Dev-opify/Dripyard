function selectPayment(element) {
    // Remove active class from all payment methods
    document.querySelectorAll('.payment-method').forEach(method => {
        method.classList.remove('active');
    });
    
    // Add active class to clicked payment method
    element.classList.add('active');
}

// Input focus animations
document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'translateY(-2px)';
        this.parentElement.style.transition = 'transform 0.3s ease';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'translateY(0)';
    });
});

// Hover effects on order items
document.querySelectorAll('.order-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 4px 12px rgba(255, 71, 87, 0.2)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'none';
    });
});
