        // Size selection
        document.querySelectorAll('.size-option').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.size-option').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
            });
        });

        // Color selection
        document.querySelectorAll('.color-option').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.color-option').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
            });
        });

        // Thumbnail selection
        document.querySelectorAll('.thumbnail').forEach(thumb => {
            thumb.addEventListener('click', () => {
                document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            });
        });

        // Quantity controls
        function increaseQuantity() {
            const input = document.getElementById('quantity');
            input.value = parseInt(input.value) + 1;
        }

        function decreaseQuantity() {
            const input = document.getElementById('quantity');
            if (parseInt(input.value) > 1) {
                input.value = parseInt(input.value) - 1;
            }
        }

        // Tab functionality
        function showTab(tab) {
            const content = document.getElementById('tab-content');
            const buttons = document.querySelectorAll('.tab-btn');
            
            buttons.forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');

            switch(tab) {
                case 'details':
                    content.innerHTML = `
                        <p>Classic fit premium cotton t-shirt with reinforced seams for durability.</p>
                        <ul class="features">
                            <li>Crew neckline</li>
                            <li>Short sleeves</li>
                            <li>Machine washable</li>
                            <li>Pre-shrunk fabric</li>
                        </ul>
                        <div class="made-in-bolt">⚡ Made in Bolt</div>
                    `;
                    break;
                case 'materials':
                    content.innerHTML = `
                        <p>100% Premium Cotton - Soft, breathable, and durable.</p>
                        <ul class="features">
                            <li>180 GSM fabric weight</li>
                            <li>Combed cotton for smoothness</li>
                            <li>OEKO-TEX certified</li>
                            <li>Environmentally friendly dyes</li>
                        </ul>
                    `;
                    break;
                case 'reviews':
                    content.innerHTML = `
                        <p>Excellent quality t-shirt with great fit and comfort. Customers love the premium feel and durability.</p>
                        <ul class="features">
                            <li>★★★★★ "Perfect fit and quality" - Sarah M.</li>
                            <li>★★★★★ "Best t-shirt I've owned" - Mike D.</li>
                            <li>★★★★☆ "Great value for money" - Lisa K.</li>
                        </ul>
                    `;
                    break;
            }
        }