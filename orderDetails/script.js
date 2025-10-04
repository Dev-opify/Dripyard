function money(v){ return `₹${Number(v||0).toLocaleString('en-IN')}`; }

async function loadOrder(){
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  if(!id){ return; }
  if(!apiClient.getToken()){ window.location.href = '../login/index.html'; return; }
  try{
    const order = await fetch(`${apiClient.BASE_URL}/api/orders/${id}`,{ headers:{ Authorization:`Bearer ${apiClient.getToken()}` }}).then(r=>r.json());
    renderOrder(order);
  }catch(e){ console.error('Failed to load order', e); }
}

function renderOrder(order){
  document.title = `DripYard - Order #${order.orderId||order.id}`;
  document.getElementById('order-title').textContent = `Order #${order.orderId||order.id}`;
  document.getElementById('order-date').textContent = `📅 Placed on ${order.orderDate? new Date(order.orderDate).toLocaleDateString(): ''}`;
  document.getElementById('order-status').textContent = (order.orderStatus||'PENDING');

  const itemsEl = document.getElementById('order-items');
  itemsEl.innerHTML = '';
  const items = order.orderItems || [];
  document.getElementById('items-header').textContent = `Order Items (${items.length})`;
  items.forEach(it=>{
    const product = it.product || {};
    const div = document.createElement('div');
    div.className='item';
    div.innerHTML = `
      <div class="item-box hoodie-box"><div class="hoodie-pattern"></div></div>
      <div class="item-details">
        <div class="item-name">${product.title||'Product'}</div>
        <div class="item-specs">Size: ${it.size||'-'} • Color: ${product.color||'-'}</div>
        <div class="item-qty">Qty: ${it.quantity}</div>
      </div>
      <div class="item-price">${money(it.sellingPrice || product.sellingPrice)}</div>
    `;
    itemsEl.appendChild(div);
  });

  const subtotal = order.totalSellingPrice || 0;
  const discount = order.discount || 0;
  const shipping = subtotal >= 800 ? 0 : 99;
  document.getElementById('subtotal').textContent = money(subtotal);
  document.getElementById('shipping').textContent = shipping===0 ? 'Free' : money(shipping);
  if (discount>0){
    document.getElementById('discount-row').style.display='flex';
    document.getElementById('discount').textContent = `-${money(discount)}`;
  }
  document.getElementById('grand-total').textContent = money(subtotal - (discount||0) + shipping);

  const addr = order.shippingAddress || {};
  document.getElementById('shipping-address').innerHTML = `
    ${addr.name||''}<br>
    ${addr.address||''}<br>
    ${addr.city||''}, ${addr.state||''} ${addr.pinCode||''}<br>
    ${addr.mobile? 'Phone: '+addr.mobile : ''}
  `;
}

function trackShipment() { alert('Tracking shipment...'); }
function contactSupport() { alert('Support will contact you shortly.'); }

window.addEventListener('load', loadOrder);
