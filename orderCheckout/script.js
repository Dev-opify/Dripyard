function selectPayment(element) {
    document.querySelectorAll('.payment-method').forEach(method => method.classList.remove('active'));
    element.classList.add('active');
}

// Input focus animations
document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'translateY(-2px)';
        this.parentElement.style.transition = 'transform 0.3s ease';
    });
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'translateY(0)';
    });
});

function money(v){ return `₹${Number(v||0).toLocaleString('en-IN')}`; }
function imageUrl(keyOrUrl){
  if(!keyOrUrl) return 'https://via.placeholder.com/60x60?text=No+Image';
  return keyOrUrl.startsWith('http') ? keyOrUrl : `${apiClient.BASE_URL}/api/images/${keyOrUrl}`;
}

async function loadSummary(){
  if(!apiClient.getToken()){ window.location.href = '../login/index.html'; return; }
  try{
    const cart = await apiClient.cart.get();
    const itemsEl = document.getElementById('order-items');
    itemsEl.innerHTML = '';
    (cart.cartItems||[]).forEach(ci=>{
      const img = (ci.product?.images && ci.product.images[0]) ? ci.product.images[0] : null;
      const div = document.createElement('div');
      div.className='order-item';
      div.innerHTML = `
        <div class="item-image" style="background-image:url('${imageUrl(img)}'); background-size:cover; background-position:center;"></div>
        <div class="item-details">
            <div class="item-name">${ci.product?.title||'Product'}</div>
            <div class="item-quantity">Qty: ${ci.quantity}</div>
        </div>
        <div class="item-price">${money(ci.sellingPrice || ci.product?.sellingPrice)}</div>
      `;
      itemsEl.appendChild(div);
    });
    const subtotal = cart.totalSellingPrice || 0;
    const shipping = subtotal >= 800 ? 0 : 99;
    const discount = cart.couponPrice || 0;
    document.getElementById('subtotal').textContent = money(subtotal);
    document.getElementById('shipping').textContent = shipping===0 ? 'Free' : money(shipping);
    if (discount>0){
      document.getElementById('discount-row').style.display='flex';
      document.getElementById('discount').textContent = `-${money(discount)}`;
    }
    document.getElementById('grand-total').textContent = money(subtotal - discount + shipping);
  }catch(e){
    console.error('Failed to load summary', e);
  }
}

function showError(msg){
  const d=document.createElement('div');
  d.style.cssText='position:fixed;top:20px;right:20px;background:#ef4444;color:#fff;padding:10px 14px;border-radius:6px;z-index:9999;box-shadow:0 2px 8px rgba(0,0,0,.2)';
  d.textContent=msg;document.body.appendChild(d);setTimeout(()=>d.remove(),4000);
}

async function placeOrder(){
  // Gather address fields in order of appearance
  const inputs = document.querySelectorAll('.form-input, .form-select');
  const fullName = inputs[0].value.trim();
  const mobile = inputs[1].value.trim();
  const address = inputs[2].value.trim();
  const city = inputs[3].value.trim();
  const pinCode = inputs[4].value.trim();
  const state = inputs[5].value.trim();
  if(!fullName || !mobile || !address || !city || !pinCode || !state){
    showError('Please fill all required address fields');
    return;
  }
  const payload = { name: fullName, mobile, address, city, pinCode, state, locality:'' };
  try{
    const res = await apiClient.orders.create(payload);
    if(res && res.payment_link_url){
      window.location.href = res.payment_link_url;
    }else{
      window.location.href = '../orderConfirmation/index.html';
    }
  }catch(e){
    console.error('Order creation failed', e);
    showError('Failed to place order: ' + e.message);
  }
}

window.addEventListener('load', ()=>{
  loadSummary();
  document.getElementById('place-order-btn').addEventListener('click', placeOrder);
});
