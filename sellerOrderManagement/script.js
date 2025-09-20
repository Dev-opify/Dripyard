// View Details button functionality
document.querySelectorAll('.view-details-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const row = this.closest('.table-row');
        const orderId = row.querySelector('.order-id').textContent;
        alert(`Viewing details for ${orderId}`);
    });
});

// Update dropdown functionality
document.querySelectorAll('.update-dropdown').forEach(dropdown => {
    dropdown.addEventListener('change', function() {
        if (this.value !== 'Update') {
            const row = this.closest('.table-row');
            const orderId = row.querySelector('.order-id').textContent;
            alert(`Updating ${orderId} to ${this.value}`);
            this.value = 'Update';
        }
    });
});

// Search functionality
document.querySelector('.search-box input').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    document.querySelectorAll('.table-row').forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? 'grid' : 'none';
    });
});
