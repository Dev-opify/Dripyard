// Revenue Over Time Chart
const revenueCtx = document.getElementById('revenueChart').getContext('2d');
new Chart(revenueCtx, {
    type: 'line',
    data: {
        labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        datasets: [{
            data: [0, 45000, 30000, 35000, 42000, 38000, 45000, 48000, 44000, 46000, 50000, 52000],
            borderColor: '#4ade80',
            backgroundColor: 'rgba(74, 222, 128, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            y: {
                beginAtZero: true,
                max: 60000,
                ticks: {
                    color: '#888888',
                    callback: value => '$' + (value/1000) + 'k'
                },
                grid: { color: '#333333', borderColor: '#333333' }
            },
            x: { ticks: { color: '#888888' }, grid: { display: false } }
        }
    }
});

// Product Categories Doughnut Chart
const categoryCtx = document.getElementById('categoryChart').getContext('2d');
new Chart(categoryCtx, {
    type: 'doughnut',
    data: {
        datasets: [{
            data: [35, 28, 20, 17],
            backgroundColor: ['#ff4444', '#333333', '#666666', '#999999'],
            borderWidth: 0,
            cutout: '60%'
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
    }
});

// Sales by Day Chart
const dailyCtx = document.getElementById('dailyChart').getContext('2d');
new Chart(dailyCtx, {
    type: 'bar',
    data: {
        labels: ['Mon','Tue','Wed','Thu','Fri','Sat'],
        datasets: [{
            data: [45, 52, 38, 65, 75, 48],
            backgroundColor: '#4ade80',
            borderRadius: 4,
            barThickness: 30
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                ticks: { color: '#888888' },
                grid: { color: '#333333', borderColor: '#333333' }
            },
            x: { ticks: { color: '#888888' }, grid: { display: false } }
        }
    }
});
