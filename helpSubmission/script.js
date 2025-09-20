document.getElementById('ticketForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Ticket submitted successfully!');
});

document.getElementById('fileInput').addEventListener('change', function(e) {
    const files = e.target.files;
    if (files.length > 0) {
        const uploadArea = document.querySelector('.upload-area');
        uploadArea.innerHTML = `
            <svg class="upload-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 16V8M12 8L9 11M12 8L15 11M3 21H21" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div class="upload-text">
                ${files.length} file(s) selected
            </div>
        `;
    }
});
