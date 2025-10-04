function toast(msg, err=false){
  const d=document.createElement('div');
  d.className='toast'+(err?' error':'');
  d.textContent=msg; document.body.appendChild(d); setTimeout(()=>d.remove(),3000);
}

function money(v){ return `₹${Number(v||0).toLocaleString('en-IN')}`; }

async function loadProducts(){
  try{
    const data = await apiClient.admin.products.list();
    renderTable(data||[]);
  }catch(e){ console.error('Failed to load products', e); toast('Failed to load products', true); renderTable([]); }
}

function renderTable(items){
  const tbody = document.getElementById('products-tbody');
  const query = (document.getElementById('search').value||'').toLowerCase();
  tbody.innerHTML = (items||[]).filter(p=>{
    return !query || (p.title||'').toLowerCase().includes(query) || String(p.id).includes(query)
  }).map(p=>{
    return `<tr data-id="${p.id}">
      <td>${p.id}</td>
      <td>${p.title||''}</td>
      <td>${money(p.sellingPrice||0)}</td>
      <td>${p.quantity||0}</td>
      <td>${p.color||''}</td>
      <td>
        <button class="btn danger" data-action="delete">Delete</button>
      </td>
    </tr>`;
  }).join('');
}

function openModal(){ document.getElementById('modal').style.display='flex'; }
function closeModal(){ document.getElementById('modal').style.display='none'; }

async function handleCreate(e){
  e.preventDefault();
  const fd = new FormData(e.target);
  const payload = {
    title: fd.get('title'),
    description: fd.get('description'),
    mrpPrice: Number(fd.get('mrpPrice')),
    sellingPrice: Number(fd.get('sellingPrice')),
    brand: fd.get('brand')||'',
    color: fd.get('color')||'',
    category: fd.get('category')||'',
    category2: fd.get('category2')||'',
    category3: fd.get('category3')||'',
    sizes: fd.get('sizes')||'',
    images: (fd.get('images')||'').split(',').map(s=>s.trim()).filter(Boolean)
  };
  try{
    await apiClient.admin.products.create(payload);
    toast('Product created');
    closeModal();
    e.target.reset();
    await loadProducts();
  }catch(err){ console.error(err); toast('Failed to create product: '+err.message, true); }
}

async function handleActions(e){
  const btn = e.target.closest('[data-action]');
  if(!btn) return;
  const action = btn.getAttribute('data-action');
  const row = btn.closest('tr');
  const id = row?.getAttribute('data-id');
  if(action==='delete' && id){
    if(!confirm('Delete this product?')) return;
    try{ await apiClient.admin.products.delete(id); row.remove(); toast('Product deleted'); }
    catch(err){ toast('Failed to delete: '+err.message, true); }
  }
}

window.addEventListener('load', ()=>{
  if(!apiClient.getToken()){ alert('Login as admin required'); window.location.href='../login/index.html'; return; }
  loadProducts();
  document.getElementById('open-create').addEventListener('click', openModal);
  document.getElementById('close-create').addEventListener('click', closeModal);
  document.getElementById('create-form').addEventListener('submit', handleCreate);
  document.getElementById('products-tbody').addEventListener('click', handleActions);
  document.getElementById('search').addEventListener('input', loadProducts);
});
