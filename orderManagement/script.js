function money(v){ return `₹${Number(v||0).toLocaleString('en-IN')}`; }

async function loadAdminOrders(){
  try{
    const orders = await apiClient.admin.orders.list();
    renderOrders(orders||[]);
  }catch(e){ console.error('Failed to load admin orders', e); renderOrders([]); }
}

function renderOrders(orders){
  const container = document.getElementById('orders-rows');
  container.innerHTML = '';
  const statuses = ['PENDING','PLACED','CONFIRMED','SHIPPED','DELIVERED','CANCELLED'];
  orders.forEach(o=>{
    const row = document.createElement('div');
    row.className='order-row';
    const date = o.orderDate ? new Date(o.orderDate).toISOString().slice(0,10) : '';
    const items = o.totalItem || (o.orderItems? o.orderItems.length:0);
    row.innerHTML = `
      <div>
        <div class="order-id">${o.orderId || ('ORD-'+o.id)}</div>
        <div class="order-date">${date}</div>
      </div>
      <div class="user-info">
        <div class="name">${o.user?.fullName || 'Customer'}</div>
        <div class="email">${o.user?.email || ''}</div>
      </div>
      <div class="items-info">
        <div class="item-name">${items} items</div>
        <div class="item-count">${items} ${items===1?'item':'items'}</div>
      </div>
      <div class="total">${money(o.totalSellingPrice)}</div>
      <div>
        <span class="status-badge">${o.paymentStatus || 'PENDING'}</span>
      </div>
      <div class="delivery-status">
        <span class="status-badge">
          <select class="delivery-dropdown">
            ${statuses.map(s=>`<option ${s===o.orderStatus?'selected':''}>${s}</option>`).join('')}
          </select>
        </span>
      </div>
      <div>
        <button class="view-btn">👁 View Order</button>
      </div>
    `;
    row.querySelector('.view-btn').addEventListener('click',()=>{
      window.location.href = `../orderDetails/index.html?id=${o.id}`;
    });
    row.querySelector('.delivery-dropdown').addEventListener('change', async (e)=>{
      const status = e.target.value;
      try{
        await apiClient.admin.orders.updateStatus(o.id, status);
      }catch(err){ console.error('update status failed', err); }
    });
    container.appendChild(row);
  });
  document.querySelector('.order-count').textContent = `${orders.length} of ${orders.length} orders`;
}

// Filter functionality
const filterEl = document.querySelector('.filter-dropdown');
filterEl.addEventListener('change', function(){
  const sel = this.value.toUpperCase();
  const rows = document.querySelectorAll('#orders-rows .order-row');
  rows.forEach(row=>{
    const current = row.querySelector('.delivery-dropdown').value.toUpperCase();
    row.style.display = (sel==='ALL ORDERS' || current===sel)? '' : 'none';
  });
});

window.addEventListener('load', loadAdminOrders);
