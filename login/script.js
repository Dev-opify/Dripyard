document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    // Simulate login process
    const loginBtn = document.querySelector('.login-btn');
    const originalText = loginBtn.textContent;
    loginBtn.textContent = 'Logging in...';
    loginBtn.disabled = true;
    
    setTimeout(() => {
        alert('Login functionality would be implemented here!');
        loginBtn.textContent = originalText;
        loginBtn.disabled = false;
    }, 1500);
});

function handleForgotPassword() {
    alert('Forgot password functionality would redirect to password reset page');
}

function handleSignUp() {
    alert('Sign up functionality would redirect to registration page');
}

// Subtle animations on load
window.addEventListener('load', function() {
    const container = document.querySelector('.login-container');
    container.style.opacity = '0';
    container.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
        container.style.transition = 'all 0.6s ease';
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
    }, 100);
});
