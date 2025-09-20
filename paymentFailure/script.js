// Retry button functionality
document.querySelector('.retry-btn').addEventListener('click', function() {
    alert('Retrying payment...');
});

// Contact support functionality
document.querySelector('.contact-support').addEventListener('click', function() {
    alert('Contacting support...');
});

// Toggle success/failure state
document.querySelector('.toggle-btn').addEventListener('click', function() {
    const errorIcon = document.querySelector('.error-icon');
    const title = document.querySelector('.error-title');
    const message = document.querySelector('.error-message');
    const retryBtn = document.querySelector('.retry-btn');
    
    if (title.textContent === 'Payment Failed') {
        // Switch to success
        errorIcon.style.background = '#27ae60';
        errorIcon.style.boxShadow = '0 0 30px rgba(39, 174, 96, 0.4)';
        errorIcon.innerHTML = '✓';
        errorIcon.style.fontSize = '36px';
        errorIcon.style.fontWeight = 'bold';
        
        title.textContent = 'Payment Successful';
        message.textContent = 'Your payment has been processed successfully.';
        retryBtn.textContent = 'Continue';
        retryBtn.style.background = '#27ae60';
        
        this.textContent = 'Toggle to Failed';
    } else {
        // Switch back to failed
        errorIcon.style.background = '#e74c3c';
        errorIcon.style.boxShadow = '0 0 30px rgba(231, 76, 60, 0.4)';
        errorIcon.innerHTML = '✕';
        
        title.textContent = 'Payment Failed';
        message.textContent = 'Something went wrong. Please try again.';
        retryBtn.textContent = 'Retry Payment';
        retryBtn.style.background = '#c0392b';
        
        this.textContent = 'Toggle to Success';
    }
});
