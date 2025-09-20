function toggleStatus(toggle) {
    const isActive = toggle.classList.contains('active');
    const statusText = toggle.parentElement.querySelector('.status-text');
    
    if (isActive) {
        toggle.classList.remove('active');
        statusText.textContent = 'Inactive';
        statusText.classList.remove('status-active');
        statusText.classList.add('status-inactive');
    } else {
        toggle.classList.add('active');
        statusText.textContent = 'Active';
        statusText.classList.remove('status-inactive');
        statusText.classList.add('status-active');
    }
    
    updateStats();
}

function updateStats() {
    const activeToggles = document.querySelectorAll('.toggle-switch.active').length;
    const totalUsers = document.querySelectorAll('.toggle-switch').length;
    const inactiveUsers = totalUsers - activeToggles;
    
    document.querySelector('.stat-number.active').textContent = activeToggles;
    document.querySelector('.stat-number.inactive').textContent = inactiveUsers;
}

document.querySelector('.search-input').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
        const name = row.querySelector('.user-name').textContent.toLowerCase();
        const email = row.querySelector('.user-email').textContent.toLowerCase();
        const id = row.querySelector('.user-id').textContent.toLowerCase();
        
        if (name.includes(searchTerm) || email.includes(searchTerm) || id.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
});

document.querySelector('.filter-dropdown').addEventListener('change', function(e) {
    const filterValue = e.target.value;
    const rows = document.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
        const roleElement = row.querySelector('.role-badge');
        const role = roleElement.textContent.toLowerCase();
        
        if (filterValue === 'all' || role === filterValue) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
});

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('edit-btn') || e.target.closest('.edit-btn')) {
        const row = e.target.closest('tr');
        const userName = row.querySelector('.user-name').textContent;
        alert(`Editing user: ${userName}`);
    }
    
    if (e.target.classList.contains('more-btn') || e.target.closest('.more-btn')) {
        const row = e.target.closest('tr');
        const userName = row.querySelector('.user-name').textContent;
        alert(`More options for: ${userName}`);
    }
});
