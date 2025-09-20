const products = [
    { name: "DripYard Essential Hoodie", price: 120, quantity: 2 },
    { name: "DripYard Elite Sneakers", price: 180, quantity: 1 },
    { name: "DripYard Signature Cap", price: 45, quantity: 1 }
];

function updateQuantity(index, change) {
    const qtyInput = document.getElementById(`qty-${index}`);
    const totalElement = document.getElementById(`total-${index}`);
    
    let newQty = parseInt(qtyInput.value) + change;
    if (newQty < 1) newQty = 1;
    
    qtyInput.value = newQty;
    products[index].quantity = newQty;
    
    const itemTotal = products[index].price * newQty;
    totalElement.textContent = `$${itemTotal}`;
    
    updateOrderSummary();
}

function removeItem(index) {
    const cartItem = document.querySelectorAll('.cart-item')[index];
    cartItem.remove();
    products.splice(index, 1);
    updateOrderSummary();
    
    setTimeout(() => {
        document.querySelectorAll('.quantity-btn').forEach((btn, btnIndex) => {
            const itemIndex = Math.floor(btnIndex / 2);
            const isIncrement = btnIndex % 2 === 1;
            btn.onclick = () => updateQuantity(itemIndex, isIncrement ? 1 : -1);
        });
        
        document.querySelectorAll('.remove-btn').forEach((btn, btnIndex) => {
            btn.onclick = () => removeItem(btnIndex);
        });
    }, 0);
}

function updateOrderSummary() {
    const subtotal = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    const shipping = subtotal > 150 ? 0 : 15;
    const total = subtotal + shipping;
    
    document.getElementById('subtotal').textContent = `$${subtotal}`;
    document.getElementById('shipping').textContent = shipping === 0 ? 'Free' : `$${shipping}`;
    document.getElementById('grand-total').textContent = `$${total}`;
}

document.querySelector('.checkout-btn').addEventListener('click', function() {
    alert('Proceeding to checkout...');
});

document.querySelector('.apply-btn').addEventListener('click', function() {
    const couponCode = document.querySelector('.coupon-field').value;
    if (couponCode.trim()) {
        alert(`Coupon "${couponCode}" applied!`);
        document.querySelector('.coupon-field').value = '';
    }
});

document.querySelectorAll('.cart-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#252525';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.backgroundColor = 'transparent';
    });
});
