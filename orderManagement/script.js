// Add interactivity to buttons
document.querySelectorAll('.view-btn').forEach(button => {
    button.addEventListener('click', function() {
        const orderRow = this.closest('.order-row');
        const orderId = orderRow.querySelector('.order-id').textContent;
        alert(`Viewing details for ${orderId}`);
    });
});

// Add filter functionality
document.querySelector('.filter-dropdown').addEventListener('change', function() {
    const selectedStatus = this.value.toLowerCase();
    // This would typically filter the orders based on the selected status
    console.log(`Filtering by: ${selectedStatus}`);
});

// Add hover effects
document.querySelectorAll('.order-row').forEach(row => {
    row.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#252525';
    });
    
    row.addEventListener('mouseleave', function() {
        this.style.backgroundColor = 'transparent';
    });
});
