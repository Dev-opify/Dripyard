// Add click handlers for edit and delete buttons
document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        alert('Edit functionality would be implemented here');
    });
});

document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        if (confirm('Are you sure you want to delete this review?')) {
            btn.closest('.review-card').remove();
        }
    });
});
