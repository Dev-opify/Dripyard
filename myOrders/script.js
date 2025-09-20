// Add click handlers for interactive elements
document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const row = this.closest('.table-row');
        const orderId = row.querySelector('.order-id').textContent;
        alert(`Viewing details for order ${orderId}`);
    });
});

document.querySelector('.filter-btn').addEventListener('click', function() {
    alert('Filter options coming soon!');
});

// Add hover effects
document.querySelectorAll('.table-row').forEach(row => {
    row.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#222';
    });
    row.addEventListener('mouseleave', function() {
        this.style.backgroundColor = 'transparent';
    });
});
