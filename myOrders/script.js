// Integrate with backend API to load user's orders
function getToken(){ return apiClient.getToken(); }

function money(v){ return `₹${Number(v||0).toLocaleString('en-IN')}`; }

async function loadOrders(){
  if(!getToken()){ window.location.href = '../login/index.html'; return; }
  try{
    const orders = await fetch(`${apiClient.BASE_URL}/api/orders/user`,{ headers:{ Authorization:`Bearer ${getToken()}` } }).then(r=>r.json());
    renderOrders(orders || []);
  }catch(e){
    console.error('Failed to load orders', e);
    renderOrders([]);
  }
}

function renderOrders(orders){
  const table = document.querySelector('.orders-table');
  // Remove existing data rows (keep header)
  const rows = table.querySelectorAll('.table-row');
  rows.forEach(r=>r.remove());

  if(!orders.length){
    const empty = document.createElement('div');
    empty.className='table-row';
    empty.innerHTML = `<div colspan="6">No orders found</div>`;
    table.appendChild(empty);
    return;
  }

  orders.forEach(order=>{
    const row = document.createElement('div');
    row.className='table-row';
    const date = order.orderDate ? new Date(order.orderDate).toLocaleDateString() : '';
    const items = order.totalItem || (order.orderItems? order.orderItems.length:0);
    const status = (order.orderStatus||'PENDING').toLowerCase();
    row.innerHTML = `
      <div class="order-id">${order.orderId || ('DY-'+order.id)}</div>
      <div class="date">📅 ${date}</div>
      <div class="status ${status}">${order.orderStatus||'PENDING'}</div>
      <div class="total">${money(order.totalSellingPrice)}</div>
      <div class="items">${items} item${items!==1?'s':''}</div>
      <button class="view-btn">👁 View Details</button>
    `;
    row.querySelector('.view-btn').addEventListener('click',()=>{
      window.location.href = `../orderDetails/index.html?id=${order.id}`;
    });
    table.appendChild(row);
  })
}

window.addEventListener('load', loadOrders);
