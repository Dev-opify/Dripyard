document.addEventListener('DOMContentLoaded', function() {
    // Navigation hover effects
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Notification click
    const notificationBtn = document.querySelector('.notification-btn');
    notificationBtn.addEventListener('click', function() {
        alert('You have 3 new notifications');
    });

    // User profile dropdown simulation
    const userProfile = document.querySelector('.user-profile');
    userProfile.addEventListener('click', function() {
        alert('Profile menu would open here');
    });

    // Animate stats on load
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(stat => {
        const finalValue = stat.textContent;
        stat.textContent = '0';
        
        const isPrice = finalValue.includes('$');
        const numericValue = parseInt(finalValue.replace(/[$,]/g, ''));
        
        let currentValue = 0;
        const increment = Math.ceil(numericValue / 50);
        
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= numericValue) {
                currentValue = numericValue;
                clearInterval(timer);
            }
            
            if (isPrice) {
                stat.textContent = '$' + currentValue.toLocaleString();
            } else {
                stat.textContent = currentValue.toLocaleString();
            }
        }, 30);
    });
});
