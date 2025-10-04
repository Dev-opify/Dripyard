// Use centralized API client
function getToken(){ return apiClient.getToken(); }
function removeToken(){ apiClient.setToken(null); }

// Global user profile data
let userProfile = null;
let userOrders = [];
let userTransactions = [];

// Load user profile from backend
async function loadUserProfile() {
    const token = getToken();
    if (!token) {
        alert('Please log in to view your profile.');
        // Redirect to login page
        // window.location.href = '/login';
        return;
    }
    
    try {
        userProfile = await apiClient.user.getProfile();
        displayUserProfile();
        await loadUserOrders();
        await loadUserTransactions();
    } catch (error) {
        console.error('Failed to load user profile:', error);
        alert('Failed to load profile. Please try again.');
    }
}

// Load user orders
async function loadUserOrders() {
    try {
        userOrders = await apiClient.orders ? await apiClient.orders.listUser?.() : await (async ()=> fetch(`${apiClient.BASE_URL}/api/orders/user`,{headers:{Authorization:`Bearer ${getToken()}`}}).then(r=>r.json()))();
        console.log('User orders loaded:', userOrders);
    } catch (error) {
        console.error('Failed to load user orders:', error);
    }
}

// Load user transactions
async function loadUserTransactions() {
    try {
        userTransactions = await (async ()=> fetch(`${apiClient.BASE_URL}/api/users/transactions`,{headers:{Authorization:`Bearer ${getToken()}`}}).then(r=>r.json()))();
        console.log('User transactions loaded:', userTransactions);
    } catch (error) {
        console.error('Failed to load user transactions:', error);
    }
}

// Display user profile data
function displayUserProfile() {
    if (!userProfile) return;
    
    // Update profile elements if they exist
    const emailElement = document.querySelector('.profile-email, #userEmail');
    const nameElement = document.querySelector('.profile-name, #userName');
    const mobileElement = document.querySelector('.profile-mobile, #userMobile');
    
    if (emailElement) emailElement.textContent = userProfile.email || 'Not provided';
    if (nameElement) nameElement.textContent = userProfile.fullName || 'Not provided';
    if (mobileElement) mobileElement.textContent = userProfile.mobile || 'Not provided';
    
    // Update page title or welcome message
    const welcomeElement = document.querySelector('.welcome-message, .profile-header h1');
    if (welcomeElement) {
        welcomeElement.textContent = `Welcome, ${userProfile.fullName || 'User'}!`;
    }
}

// Display orders in orders tab
function displayOrders() {
    const ordersContainer = document.getElementById('orders-container');
    const noOrdersMessage = document.getElementById('no-orders-message');
    
    if (!ordersContainer) {
        alert('Order history functionality will show your past orders.');
        return;
    }
    
    if (userOrders.length === 0) {
        ordersContainer.style.display = 'none';
        if (noOrdersMessage) {
            noOrdersMessage.style.display = 'block';
        }
        return;
    }
    
    ordersContainer.style.display = 'block';
    if (noOrdersMessage) {
        noOrdersMessage.style.display = 'none';
    }
    
    // Render orders dynamically with the same structure as the original design
    const ordersHTML = userOrders.map(order => {
        const statusClass = order.orderStatus ? `status-${order.orderStatus.toLowerCase()}` : 'status-pending';
        const orderDate = order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A';
        const totalItems = order.totalItem || order.orderItems?.length || 0;
        
        return `
            <div class="order-item">
                <div class="order-header">
                    <div class="order-id">#${order.orderId || order.id}</div>
                    <div class="order-price">$${order.totalSellingPrice || 0}</div>
                </div>
                <div class="order-date">${orderDate}</div>
                <div class="order-footer">
                    <div class="order-items">${totalItems} item${totalItems !== 1 ? 's' : ''}</div>
                    <div class="order-status ${statusClass}">${order.orderStatus || 'Pending'}</div>
                </div>
            </div>
        `;
    }).join('');
    
    ordersContainer.innerHTML = ordersHTML;
}

// Display transactions in transactions tab
function displayTransactions() {
    const transactionsContainer = document.querySelector('.transactions-content, #transactionsTab');
    if (!transactionsContainer) {
        alert('Transaction history functionality will show your payment history.');
        return;
    }
    
    if (userTransactions.length === 0) {
        transactionsContainer.innerHTML = '<p>No transactions found.</p>';
        return;
    }
    
    const transactionsHTML = userTransactions.map(transaction => `
        <div class="transaction-item">
            <h4>Transaction #${transaction.id}</h4>
            <p>Order: ${transaction.order?.orderId || 'N/A'}</p>
            <p>Date: ${new Date(transaction.date).toLocaleDateString()}</p>
        </div>
    `).join('');
    
    transactionsContainer.innerHTML = transactionsHTML;
}

// Logout functionality
function logout() {
    removeToken();
    alert('You have been logged out.');
    window.location.href = '../login/index.html';
}

// Tab switching functionality
const tabs = document.querySelectorAll('.nav-tab');

tabs.forEach(tab => {
    tab.addEventListener('click', e => {
        e.preventDefault();
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        const tabText = tab.textContent.trim().toLowerCase();
        console.log(`Switched to ${tabText} tab`);
        
        // Handle different tabs
        if (tabText.includes('order')) {
            displayOrders();
        } else if (tabText.includes('transaction') || tabText.includes('payment')) {
            displayTransactions();
        } else if (tabText.includes('profile') || tabText.includes('account')) {
            displayUserProfile();
        } else {
            alert(`You clicked on "${tab.textContent.trim()}" tab!`);
        }
    });
});

// Enhanced edit functionality
function enableProfileEdit() {
    if (!userProfile) {
        alert('Please wait for profile to load.');
        return;
    }
    
    const nameElement = document.querySelector('.profile-name, #userName');
    const mobileElement = document.querySelector('.profile-mobile, #userMobile');
    
    // Convert elements to editable inputs
    if (nameElement && !nameElement.querySelector('input')) {
        const currentName = userProfile.fullName || '';
        nameElement.innerHTML = `<input type="text" id="editName" value="${currentName}" />`;
    }
    
    if (mobileElement && !mobileElement.querySelector('input')) {
        const currentMobile = userProfile.mobile || '';
        mobileElement.innerHTML = `<input type="tel" id="editMobile" value="${currentMobile}" />`;
    }
    
    // Change edit button to save/cancel buttons
    const editBtn = document.querySelector('.edit-btn');
    if (editBtn) {
        editBtn.style.display = 'none';
        
        // Create save and cancel buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.innerHTML = `
            <button class="save-btn" onclick="saveProfile()">Save Changes</button>
            <button class="cancel-btn" onclick="cancelEdit()">Cancel</button>
        `;
        editBtn.parentNode.insertBefore(buttonContainer, editBtn.nextSibling);
    }
}

// Save profile changes
async function saveProfile() {
    const nameInput = document.getElementById('editName');
    const mobileInput = document.getElementById('editMobile');
    
    if (!nameInput && !mobileInput) {
        alert('No changes to save.');
        return;
    }
    
    const newName = nameInput ? nameInput.value.trim() : userProfile.fullName;
    const newMobile = mobileInput ? mobileInput.value.trim() : userProfile.mobile;
    
    if (!newName) {
        alert('Name cannot be empty.');
        return;
    }
    
    try {
        // Note: The backend doesn't have a profile update endpoint in the API docs
        // For now, we'll update locally and show a message
        alert('Profile updated successfully! (Note: Backend update endpoint would be implemented here)');
        
        // Update local profile data
        userProfile.fullName = newName;
        userProfile.mobile = newMobile;
        
        // Refresh display
        displayUserProfile();
        cancelEdit();
        
    } catch (error) {
        console.error('Failed to update profile:', error);
        alert('Failed to update profile: ' + error.message);
    }
}

// Cancel edit mode
function cancelEdit() {
    // Restore original display
    displayUserProfile();
    
    // Remove save/cancel buttons and show edit button
    const buttonContainer = document.querySelector('.save-btn')?.parentNode;
    if (buttonContainer) {
        buttonContainer.remove();
    }
    
    const editBtn = document.querySelector('.edit-btn');
    if (editBtn) {
        editBtn.style.display = 'inline-block';
    }
}

// Add logout button functionality
function addLogoutButton() {
    // Look for existing logout button or create one
    let logoutBtn = document.querySelector('.logout-btn, #logoutBtn');
    
    if (!logoutBtn) {
        logoutBtn = document.createElement('button');
        logoutBtn.textContent = 'Logout';
        logoutBtn.className = 'logout-btn';
        logoutBtn.onclick = logout;
        
        // Add to navigation or profile header
        const nav = document.querySelector('nav, .profile-nav, .profile-header');
        if (nav) {
            nav.appendChild(logoutBtn);
        }
    } else {
        logoutBtn.onclick = logout;
    }
}

// Edit button
document.addEventListener('DOMContentLoaded', function() {
    const editBtn = document.querySelector('.edit-btn');
    if (editBtn) {
        editBtn.addEventListener('click', e => {
            e.preventDefault();
            enableProfileEdit();
        });
    }
});

// Initialize user profile on page load
window.addEventListener('load', function() {
    if (!getToken()) {
        window.location.href = '../login/index.html';
        return;
    }
    loadUserProfile().then(()=>{
      displayOrders();
    });
    addLogoutButton();
});
