// View Button Click
document.querySelectorAll('.view-button').forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        const row = e.target.closest('.ticket-row');
        const ticketId = row.querySelector('.ticket-id').textContent;
        alert(`Viewing ticket: ${ticketId}`);
    });
});

// Reopen Button Click
document.querySelectorAll('.reopen-button').forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        const row = e.target.closest('.ticket-row');
        const ticketId = row.querySelector('.ticket-id').textContent;
        const statusBadge = row.querySelector('.status-badge');
        
        if (confirm(`Are you sure you want to reopen ${ticketId}?`)) {
            statusBadge.textContent = 'Open';
            statusBadge.className = 'status-badge status-open';
            button.style.display = 'none';
        }
    });
});

// Dropdown Arrow Click
document.querySelectorAll('.dropdown-arrow').forEach(arrow => {
    arrow.addEventListener('click', (e) => {
        e.stopPropagation();
        // Placeholder for dropdown menu functionality
        console.log('Dropdown clicked');
    });
});
