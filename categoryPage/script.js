 // Add interactive functionality
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                this.style.background = this.style.background.includes('rgb(59, 130, 246)') ? 
                    'rgba(51, 65, 85, 0.8)' : 'rgba(59, 130, 246, 0.8)';
                this.style.borderColor = this.style.borderColor === 'rgb(59, 130, 246)' ? 
                    'rgba(148, 163, 184, 0.3)' : '#3b82f6';
            });
        });

        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', function() {
                this.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 200);
            });
        });

        document.querySelector('.load-more-btn').addEventListener('click', function() {
            this.textContent = 'Loading...';
            this.style.background = 'rgba(239, 68, 68, 0.7)';
            setTimeout(() => {
                this.textContent = 'Load More Products';
                this.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
            }, 1500);
        });

        // Color filter functionality
        document.querySelectorAll('.color-option input').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                console.log(`Filter by ${this.parentElement.textContent.trim()}: ${this.checked}`);
            });
        });

        // Price filter functionality
        document.querySelectorAll('.price-option input').forEach(radio => {
            radio.addEventListener('change', function() {
                console.log(`Filter by price: ${this.parentElement.textContent.trim()}`);
            });
        });