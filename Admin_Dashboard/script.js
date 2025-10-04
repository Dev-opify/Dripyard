document.addEventListener('DOMContentLoaded', async function() {
    // Navigation active state
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (this.getAttribute('href')==='#') e.preventDefault();
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Quick jump to products page: open category page for now
const navProducts = document.getElementById('nav-products');
    if (navProducts) navProducts.addEventListener('click', (e)=> { e.preventDefault(); window.location.href = '../adminProducts/index.html'; });

    // Notification click
    const notificationBtn = document.querySelector('.notification-btn');
    notificationBtn.addEventListener('click', function() {
        alert('You have new notifications');
    });

    // Fetch admin stats
    await loadAdminStats();
});

function setStat(selector, value, money=false){
  const el = document.querySelector(selector);
  if(!el) return;
  if(money){ el.textContent = '₹' + Number(value||0).toLocaleString('en-IN'); }
  else { el.textContent = Number(value||0).toLocaleString('en-IN'); }
}

async function loadAdminStats(){
  try{
    const [products, orders, transactions] = await Promise.all([
      apiClient.admin.products.list().catch(()=>[]),
      apiClient.admin.orders.list().catch(()=>[]),
      apiClient.admin.transactions.list().catch(()=>[]),
    ]);
    setStat('.stats-grid .stat-card:nth-child(1) .stat-value', 0+ (/* Total Users unknown */ (new Set(transactions.map(t=>t.customer?.id)).size)) );
    setStat('.stats-grid .stat-card:nth-child(2) .stat-value', products.length);
    setStat('.stats-grid .stat-card:nth-child(3) .stat-value', orders.length);
    const revenue = orders.reduce((sum,o)=> sum + (o.totalSellingPrice||0), 0);
    setStat('.stats-grid .stat-card:nth-child(4) .stat-value', revenue, true);
  }catch(e){ console.error('Failed loading admin stats', e); }
}
