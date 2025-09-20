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
document.getElementById('reviewForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (selectedRating === 0) {
        alert('Please select a rating.');
        return;
    }
    
    const formData = new FormData();
    formData.append('rating', selectedRating);
    formData.append('title', document.getElementById('reviewTitle').value);
    formData.append('review', document.getElementById('reviewText').value);
    
    alert('Thank you for your review!');
});
