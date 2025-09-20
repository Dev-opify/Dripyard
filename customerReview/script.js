// Load More button animation
document.querySelector('.load-more-btn').addEventListener('click', function() {
    this.style.transform = 'scale(0.98)';
    setTimeout(() => {
        this.style.transform = 'scale(1)';
    }, 150);
});

// Animate rating bars on page load
window.addEventListener('load', function() {
    const bars = document.querySelectorAll('.rating-bar');
    bars.forEach((bar, index) => {
        setTimeout(() => {
            bar.style.opacity = '1';
            bar.style.transform = 'scaleX(1)';
        }, index * 100);
    });
});
