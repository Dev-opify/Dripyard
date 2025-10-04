document.getElementById('ticketForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    // 1. Get data from the form
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const category = document.getElementById('category').value;
    const orderId = document.getElementById('orderId').value;
    const message = document.getElementById('message').value;

    const ticketData = {
        name: name,
        email: email,
        subject: subject,
        category: category,
        orderId: orderId || null, // Send null if empty
        description: message // Match the 'description' field in your HelpdeskTicket model
    };

    const submitBtn = document.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    try {
        // 2. Use apiClient to send data to the backend
        const response = await apiClient.helpdesk.submitTicket(ticketData);

        if (response) {
            alert('Ticket submitted successfully!');
            document.getElementById('ticketForm').reset(); // Clear the form
        } else {
             throw new Error('Submission failed. Please try again.');
        }

    } catch (error) {
        console.error('Submission error:', error);
        alert('Error submitting ticket: ' + error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Ticket';
    }
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