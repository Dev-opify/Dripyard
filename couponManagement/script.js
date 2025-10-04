function money(v){ return `₹${Number(v||0).toLocaleString('en-IN')}`; }

async function loadCoupons(){
  try{
    const coupons = await apiClient.admin.coupons.all();
    renderCoupons(coupons||[]);
    document.querySelector('.stat-value').textContent = (coupons||[]).length;
  }catch(e){ console.error('Failed to load coupons', e); renderCoupons([]); }
}

function renderCoupons(list){
  const tbody = document.getElementById('coupons-tbody');
  tbody.innerHTML = list.map(c=>{
    const discount = (c.discountPercentage||0)+'%';
    const expiry = c.validityEndDate || '';
    const status = c.active? 'active':'inactive';
    return `
      <tr data-id="${c.id}">
        <td class="coupon-code">${c.code}</td>
        <td class="discount-percent">${discount}</td>
        <td class="expiry-date">${expiry}</td>
        <td><span class="status-badge status-${status}">${status}</span></td>
        <td>
          <div class="actions-cell">
            <button class="action-btn" title="Delete" data-action="delete"><i class="fas fa-trash"></i></button>
          </div>
        </td>
      </tr>`;
  }).join('');
}

document.querySelector('.search-input').addEventListener('input', function(e) {
  const searchTerm = e.target.value.toLowerCase();
  const rows = document.querySelectorAll('#coupons-tbody tr');
  rows.forEach(row => {
    const code = row.querySelector('.coupon-code').textContent.toLowerCase();
    row.style.display = code.includes(searchTerm) ? '' : 'none';
  });
});

document.querySelector('.add-coupon-btn').addEventListener('click', async function() {
  const code = prompt('Enter coupon code');
  const pct = prompt('Enter discount percentage');
  if(!code || !pct) return;
  try{
    await apiClient.admin.coupons.create({ code, discountPercentage: Number(pct), active:true });
    loadCoupons();
  }catch(e){ alert('Failed to create coupon: ' + e.message); }
});

document.addEventListener('click', async function(e) {
  const btn = e.target.closest('[data-action="delete"]');
  if(btn){
    const row = btn.closest('tr');
    const idAttr = row.getAttribute('data-id');
    if(idAttr && confirm('Delete this coupon?')){
      try{ await apiClient.admin.coupons.delete(idAttr); row.remove(); }
      catch(err){ alert('Failed to delete: '+err.message); }
    }
  }
});

document.addEventListener('DOMContentLoaded', function() {
  loadCoupons();
});
