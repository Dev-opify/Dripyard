function money(v){ return `₹${Number(v||0).toLocaleString('en-IN')}`; }
function imageUrl(k){ return k && k.startsWith('http') ? k : (k? `${apiClient.BASE_URL}/api/images/${k}` : 'https://via.placeholder.com/80x80?text=No+Image'); }

async function loadWishlist(){
  if(!apiClient.getToken()){ window.location.href = '../login/index.html'; return; }
  try{
    const wl = await apiClient.wishlist.get();
    const items = wl.products || [];
    renderItems(items);
  }catch(e){ console.error('Failed to load wishlist', e); renderItems([]); }
}

function renderItems(items){
  const list = document.getElementById('wishlist-items');
  list.innerHTML = '';
  document.querySelector('.section-title').textContent = `${items.length} Items`;
  document.querySelector('.highlight-number').textContent = items.length;

  items.forEach(p=>{
    const img = (p.images && p.images[0])? p.images[0] : null;
    const div = document.createElement('div');
    div.className='wishlist-item';
    div.innerHTML = `
      <div class="product-image" style="background-image:url('${imageUrl(img)}'); background-size:cover; background-position:center;"></div>
      <div class="product-info">
        <h3 class="product-name">${p.title}</h3>
        <p class="product-color">Color: ${p.color||'N/A'}</p>
        <div style="display:flex;align-items:center;">
          <span class="product-price">${money(p.sellingPrice)}</span>
          <span class="stock-badge ${p.in_stock?'in-stock':'out-of-stock'}">${p.in_stock?'In Stock':'Out of Stock'}</span>
        </div>
      </div>
      <div class="action-buttons">
        <button class="move-to-cart-btn">🛒 Move to Cart</button>
        <button class="remove-btn">×</button>
      </div>
    `;
    div.querySelector('.move-to-cart-btn').addEventListener('click', async ()=>{
      try{
        await apiClient.cart.add({ productId:p.id, size:'M', quantity:1, price:p.sellingPrice });
        toast('Moved to cart');
      }catch(err){ toast('Failed to move to cart', true); }
    });
    div.querySelector('.remove-btn').addEventListener('click', async ()=>{
      try{
        await apiClient.wishlist.removeProduct(p.id);
        div.style.opacity='0';
        setTimeout(()=>div.remove(), 300);
        toast('Removed from wishlist');
      }catch(err){ toast('Failed to remove from wishlist', true); }
    });
    list.appendChild(div);
  });
}

function toast(msg, err=false){
  const d=document.createElement('div');
  d.style.cssText=`position:fixed;top:20px;right:20px;background:${err?'#ef4444':'#10b981'};color:#fff;padding:10px 14px;border-radius:6px;z-index:9999;box-shadow:0 2px 8px rgba(0,0,0,.2)`;
  d.textContent=msg;document.body.appendChild(d);setTimeout(()=>d.remove(),3000);
}

window.addEventListener('load', loadWishlist);
