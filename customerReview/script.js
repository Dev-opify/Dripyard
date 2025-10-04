function qs(s){return document.querySelector(s);} 
function qsa(s){return Array.from(document.querySelectorAll(s));}

function starHtml(n){ return '★'.repeat(n)+'☆'.repeat(5-n); }

async function loadReviews(){
  const params = new URLSearchParams(location.search);
  const productId = params.get('id');
  if(!productId){ return; }
  try{
    const reviews = await apiClient.products.reviews.listByProduct(productId);
    renderReviews(reviews||[]);
  }catch(e){ console.error('Failed to load reviews', e); renderReviews([]); }
}

function renderReviews(reviews){
  // overall rating
  const score = reviews.length? (reviews.reduce((s,r)=>s+(r.rating||0),0)/reviews.length).toFixed(1): '0.0';
  qs('.rating-score').textContent = score;
  qs('.based-on').textContent = `Based on ${reviews.length} reviews`;
  // breakdown
  const counts=[0,0,0,0,0];
  reviews.forEach(r=>{ const v=Math.max(1,Math.min(5,Math.round(r.rating||0))); counts[v-1]++; });
  // fill bars visually
  const total = Math.max(1, reviews.length);
  const mapIdx = {5:4,4:3,3:2,2:1,1:0};
  Object.entries(mapIdx).forEach(([label,idx])=>{
    const bar = qs(`.rating-${label}`);
    if(bar){
      bar.style.opacity='1';
      bar.style.transform='scaleX('+(counts[idx]/total)+')';
      const rowCount = bar.parentElement.parentElement.querySelector('.rating-count');
      if(rowCount) rowCount.textContent = counts[idx];
    }
  });

  // list reviews (replace static examples)
  const section = qs('.reviews-section');
  const existing = qsa('.review'); existing.forEach(el=>el.remove());
  const loadMore = qs('.load-more');
  reviews.slice(0,20).forEach(r=>{
    const div = document.createElement('div');
    div.className='review';
    div.innerHTML = `
      <div class="review-header">
        <div class="reviewer-info">
          <div class="reviewer-avatar">${(r.user?.fullName||'U').slice(0,2).toUpperCase()}</div>
          <div class="reviewer-details">
            <h4>${r.user?.fullName || 'Customer'}</h4>
            <div class="review-stars">${starHtml(Math.round(r.rating||0))}</div>
          </div>
        </div>
        <div class="review-date">${r.createdAt ? new Date(r.createdAt).toLocaleDateString(): ''}</div>
      </div>
      <p class="review-text">${r.reviewText||''}</p>
    `;
    section.insertBefore(div, loadMore);
  });
}

window.addEventListener('load', loadReviews);
