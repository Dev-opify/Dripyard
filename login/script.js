// Check if user is already logged in
function checkAuthStatus() {
    const token = apiClient.getToken();
    if (token) {
        // User is logged in, redirect to home
        window.location.href = '../LandingPage/index.html';
    }
}

// Initialize auth check on page load
checkAuthStatus();

// Helper function to show loading state
function showLoading(button, loadingText) {
    button.disabled = true;
    button.dataset.originalText = button.textContent;
    button.textContent = loadingText;
}

// Helper function to hide loading state
function hideLoading(button) {
    button.disabled = false;
    button.textContent = button.dataset.originalText;
}

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('error-message') || createErrorDiv();
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

// Create error div if it doesn't exist
function createErrorDiv() {
    const errorDiv = document.createElement('div');
    errorDiv.id = 'error-message';
    errorDiv.style.cssText = `
        color: #ff4757;
        background: #ffebee;
        border: 1px solid #ff4757;
        border-radius: 4px;
        padding: 10px;
        margin: 10px 0;
        display: none;
        text-align: center;
    `;
    const form = document.getElementById('loginForm');
    form.insertBefore(errorDiv, form.firstChild);
    return errorDiv;
}

// Show success message
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        color: #2ed573;
        background: #f1f9ff;
        border: 1px solid #2ed573;
        border-radius: 4px;
        padding: 10px;
        margin: 10px 0;
        text-align: center;
    `;
    successDiv.textContent = message;
    const form = document.getElementById('loginForm');
    form.insertBefore(successDiv, form.firstChild);
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// Global state for auth method
let isOtpMode = false;
let otpSent = false;

// Toggle between password and OTP authentication
function toggleAuthMethod() {
    const passwordSection = document.getElementById('passwordSection');
    const otpSection = document.getElementById('otpSection');
    const authToggle = document.getElementById('authToggle');
    const sendOtpBtn = document.getElementById('sendOtpBtn');
    
    isOtpMode = !isOtpMode;
    
    if (isOtpMode) {
        passwordSection.style.display = 'none';
        otpSection.style.display = 'block';
        authToggle.textContent = 'Use Password instead';
        sendOtpBtn.style.display = 'inline-block';
        
        // Auto-enable development OTP for admin users
        const email = document.getElementById('email').value;
        if (email === 'admin@dripyard.com') {
            otpSent = true; // Allow development OTP
            showSuccess('Development mode: You can use OTP "123456"');
        }
    } else {
        passwordSection.style.display = 'block';
        otpSection.style.display = 'none';
        authToggle.textContent = 'Use OTP instead';
        sendOtpBtn.style.display = 'inline-block';
        otpSent = false;
    }
}

// Send OTP button handler
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('sendOtpBtn').addEventListener('click', async function() {
        const email = document.getElementById('email').value;
        if (!email) {
            showError('Please enter your email address first.');
            return;
        }
        
        showLoading(this, 'Sending OTP...');
        
        try {
            const success = await sendOTP(email);
            if (success) {
                otpSent = true;
                if (!isOtpMode) {
                    toggleAuthMethod();
                }
                document.getElementById('otp').focus();
            }
        } finally {
            hideLoading(this);
        }
    });
});

// Login form handler
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const otp = document.getElementById('otp').value;
    
    if (!email) {
        showError('Please enter your email address');
        return;
    }
    
    if (isOtpMode) {
        if (!otp) {
            showError('Please enter the OTP');
            return;
        }
        // Allow development OTP (123456) without requiring email send
        if (!otpSent && otp !== '123456') {
            showError('Please send OTP first or use development OTP "123456"');
            return;
        }
    } else {
        if (!password) {
            showError('Please enter your password');
            return;
        }
    }
    
    const loginBtn = document.getElementById('loginBtn');
    showLoading(loginBtn, 'Logging in...');
    
    try {
        const payload = { email };
        if (isOtpMode) {
            payload.otp = otp;
        } else {
            payload.password = password;
        }
        
        const response = await apiClient.auth.signin(payload);
        
        console.log('Login response:', response); // Debug log
        
        if (response.status && response.jwt) {
            // Save JWT token
            apiClient.setToken(response.jwt);
            
            showSuccess('Login successful! Redirecting...');
            
            console.log('User role:', response.role); // Debug log
            
            // Redirect based on user role
            setTimeout(() => {
                if (response.role === 'ROLE_ADMIN' || response.role === 1) {
                    console.log('Redirecting to admin dashboard'); // Debug log
                    window.location.href = '../Admin_Dashboard/index.html';
                } else {
                    console.log('Redirecting to landing page'); // Debug log
                    window.location.href = '../LandingPage/index.html';
                }
            }, 1500);
            
        } else {
            showError(response.message || 'Invalid credentials');
        }
        
    } catch (error) {
        console.error('Login error:', error);
        showError('Login failed: ' + error.message);
    } finally {
        hideLoading(loginBtn);
    }
});

// Send OTP for login/signup
async function sendOTP(email) {
    try {
        const response = await apiClient.auth.sendOtp({
            email: email
        });
        
        if (response.status) {
            showSuccess('OTP sent to your email. Please check your inbox.');
            return true;
        } else {
            showError(response.message || 'Failed to send OTP');
            return false;
        }
    } catch (error) {
        console.error('Send OTP error:', error);
        showError('Failed to send OTP: ' + error.message);
        return false;
    }
}

// Signup with OTP
async function handleSignUpWithOTP(fullName, email, otp) {
    try {
        const response = await apiClient.auth.signup({
            fullName: fullName,
            email: email,
            otp: otp
        });
        
        if (response.status && response.jwt) {
            apiClient.setToken(response.jwt);
            showSuccess(`Signup successful! Welcome ${fullName}.`);
            setTimeout(() => {
                window.location.href = '../LandingPage/index.html';
            }, 1500);
            return true;
        } else {
            showError(response.message || 'Signup failed: Invalid OTP or details');
            return false;
        }
    } catch (error) {
        console.error('Signup error:', error);
        showError('Signup failed: ' + error.message);
        return false;
    }
}

// Login with OTP
async function handleLoginWithOTP(email, otp) {
    try {
        const response = await apiClient.auth.signin({
            email: email,
            password: '', // Not used for OTP login
            otp: otp
        });
        
        if (response.status && response.jwt) {
            apiClient.setToken(response.jwt);
            showSuccess('Login successful! Redirecting...');
            setTimeout(() => {
                if (response.role === 'ROLE_ADMIN') {
                    window.location.href = '../Admin_Dashboard/index.html';
                } else {
                    window.location.href = '../LandingPage/index.html';
                }
            }, 1500);
            return true;
        } else {
            showError(response.message || 'Login failed: Invalid OTP');
            return false;
        }
    } catch (error) {
        console.error('OTP Login error:', error);
        showError('Login failed: ' + error.message);
        return false;
    }
}

function handleForgotPassword() {
    const email = document.getElementById('email').value;
    if (!email) {
        showError('Please enter your email address first.');
        return;
    }
    
    // Send OTP for password reset
    sendOTP(email);
}

function handleSignUp() {
    // Redirect to signup page
    window.location.href = '../signup/index.html';
}

// Add OTP login option
function handleOTPLogin() {
    const email = document.getElementById('email').value;
    if (!email) {
        showError('Please enter your email address first.');
        return;
    }
    
    sendOTP(email).then(success => {
        if (success) {
            const otp = prompt('Enter the OTP sent to your email:');
            if (otp) {
                handleLoginWithOTP(email, otp);
            }
        }
    });
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
