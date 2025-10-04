function toggleFailure() {
  const icon = document.querySelector('.success-icon');
  const checkmark = document.querySelector('.checkmark');
  const title = document.querySelector('.success-title');
  const message = document.querySelector('.success-message');
  const toggleBtn = document.querySelector('.toggle-btn');
  
  if (title.textContent === 'Payment Successful') {
    // Switch to failure state
    icon.style.background = '#e53e3e';
    checkmark.textContent = '✗';
    title.textContent = 'Payment Failed';
    message.textContent = 'Order #12345 could not be processed. Please try again.';
    toggleBtn.textContent = 'Toggle to Success';
  } else {
    // Switch back to success state
    icon.style.background = '#e53e3e';
    checkmark.textContent = '✓';
    title.textContent = 'Payment Successful';
    message.textContent = 'Order #12345 has been placed successfully.';
    toggleBtn.textContent = 'Toggle to Failure';
  }
}

function goToOrders() {
  window.location.href = '../myOrders/index.html';
}

function continueShopping() {
  window.location.href = '../categoryPage/index.html';
}

// Get order details from URL params if available
window.addEventListener('load', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get('orderId') || urlParams.get('order_id');
  
  if (orderId) {
    const message = document.querySelector('.success-message');
    message.textContent = `Order #${orderId} has been placed successfully.`;
  }
});
