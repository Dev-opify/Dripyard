const couponsData = [
    { code: 'SAVE20', discount: '20%', expiry: '12/30/2024', status: 'active' },
    { code: 'WELCOME10', discount: '10%', expiry: '9/19/2024', status: 'active' },
    { code: 'FLASH50', discount: '50%', expiry: '9/14/2024', status: 'inactive' }
];

const dealsData = [
    { code: 'SUMMER25', discount: '25%', expiry: '8/31/2024', status: 'active' },
    { code: 'BACK2SCHOOL', discount: '15%', expiry: '9/15/2024', status: 'active' }
];

function switchTab(tabName, element) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    element.classList.add('active');

    const tbody = document.getElementById('coupons-tbody');
    const data = tabName === 'coupons' ? couponsData : dealsData;

    tbody.innerHTML = data.map(item => `
        <tr>
            <td class="coupon-code">${item.code}</td>
            <td class="discount-percent">${item.discount}</td>
            <td class="expiry-date">${item.expiry}</td>
            <td><span class="status-badge status-${item.status}">${item.status}</span></td>
            <td>
                <div class="actions-cell">
                    <button class="action-btn" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

document.querySelector('.search-input').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#coupons-tbody tr');
    
    rows.forEach(row => {
        const code = row.querySelector('.coupon-code').textContent.toLowerCase();
        row.style.display = code.includes(searchTerm) ? '' : 'none';
    });
});

document.querySelector('.add-coupon-btn').addEventListener('click', function() {
    alert('Add New Coupon dialog would open here');
});

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('fa-edit') || e.target.closest('.action-btn[title="Edit"]')) {
        const row = e.target.closest('tr');
        const code = row.querySelector('.coupon-code').textContent;
        alert(`Editing coupon: ${code}`);
    }
    if (e.target.classList.contains('fa-trash') || e.target.closest('.action-btn[title="Delete"]')) {
        const row = e.target.closest('tr');
        const code = row.querySelector('.coupon-code').textContent;
        if (confirm(`Are you sure you want to delete coupon ${code}?`)) {
            row.remove();
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    switchTab('coupons', document.querySelector('.tab.active'));
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(stat => {
        const finalValue = parseInt(stat.textContent);
        stat.textContent = '0';
        let currentValue = 0;
        const timer = setInterval(() => {
            currentValue++;
            stat.textContent = currentValue;
            if (currentValue >= finalValue) clearInterval(timer);
        }, 200);
    });
});
