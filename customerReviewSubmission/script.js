// Star rating functionality
const stars = document.querySelectorAll('.star');
let selectedRating = 0;

stars.forEach(star => {
    star.addEventListener('click', () => {
        selectedRating = parseInt(star.dataset.rating);
        updateStars();
    });
    
    star.addEventListener('mouseenter', () => {
        const rating = parseInt(star.dataset.rating);
        highlightStars(rating);
    });
});

document.getElementById('starRating').addEventListener('mouseleave', () => {
    updateStars();
});

function highlightStars(rating) {
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function updateStars() {
    highlightStars(selectedRating);
}

// Character counter
const reviewTextarea = document.getElementById('reviewText');
const charCount = document.getElementById('charCount');

reviewTextarea.addEventListener('input', () => {
    const count = reviewTextarea.value.length;
    charCount.textContent = count;
    
    if (count > 1000) {
        charCount.style.color = '#ef4444';
    } else {
        charCount.style.color = '#64748b';
    }
});

// File upload handling
const fileInput = document.getElementById('photoUpload');
const uploadArea = fileInput.parentElement;

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    uploadArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    uploadArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    uploadArea.addEventListener(eventName, unhighlight, false);
});

function highlight() {
    uploadArea.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
}

function unhighlight() {
    uploadArea.style.backgroundColor = 'rgba(239, 68, 68, 0.05)';
}

uploadArea.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

function handleFiles(files) {
    if (files.length > 4) {
        alert('You can only upload up to 4 images.');
        return;
    }
    
    console.log('Files selected:', files);
}

// Form submission
function toast(msg, err=false){
  const d=document.createElement('div');
  d.style.cssText=`position:fixed;top:20px;right:20px;background:${err?'#ef4444':'#10b981'};color:#fff;padding:10px 14px;border-radius:6px;z-index:9999;box-shadow:0 2px 8px rgba(0,0,0,.2)`;
  d.textContent=msg;document.body.appendChild(d);setTimeout(()=>d.remove(),3000);
}

document.getElementById('reviewForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (selectedRating === 0) { toast('Please select a rating', true); return; }
    const params = new URLSearchParams(location.search);
    const productId = params.get('id');
    if(!productId){ toast('Missing product id', true); return; }
    if(!apiClient.getToken()){ window.location.href = '../login/index.html'; return; }

    try{
      const payload = {
        reviewText: document.getElementById('reviewText').value.trim(),
        reviewRating: Number(selectedRating),
        productImages: []
      };
      await apiClient.products.reviews.create(productId, payload);
      toast('Thank you for your review!');
      setTimeout(()=>{ window.location.href = `../productDetails/index.html?id=${productId}`; }, 1200);
    }catch(err){
      console.error('Failed to submit review', err);
      toast('Failed to submit review: '+ err.message, true);
    }
});
