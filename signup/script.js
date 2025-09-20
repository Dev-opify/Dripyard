function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const toggle = field.nextElementSibling;
    
    if (field.type === 'password') {
        field.type = 'text';
        toggle.textContent = '🙈';
    } else {
        field.type = 'password';
        toggle.textContent = '👁️';
    }
}

function showTerms() {
    alert('Terms and Conditions would be displayed here.');
}

function showPrivacy() {
    alert('Privacy Policy would be displayed here.');
}

function showLogin() {
    alert('Redirecting to login page...');
}

document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const termsAccepted = document.getElementById('terms').checked;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    if (!termsAccepted) {
        alert('Please accept the Terms and Conditions');
        return;
    }

    // Simulate account creation
    alert(`Account created successfully for ${fullName}!`);
    
    // Log the data (you can send it to your server)
    console.log('Account creation data:', {
        fullName,
        email,
        password,
        termsAccepted
    });
});

// Interactive input focus effects
document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
});
