// Tab switching functionality
const tabs = document.querySelectorAll('.nav-tab');

tabs.forEach(tab => {
    tab.addEventListener('click', e => {
        e.preventDefault();
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        alert(`You clicked on "${tab.textContent.trim()}" tab!`);
        // Here you can switch the content dynamically
    });
});

// Edit button
document.querySelector('.edit-btn').addEventListener('click', e => {
    e.preventDefault();
    alert('Profile edit functionality would open here.');
});
