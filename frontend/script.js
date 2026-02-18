document.addEventListener('DOMContentLoaded', () => {
    const stateDataElement = document.getElementById('state-data');
    const publicDataElement = document.getElementById('public-data');
    const stateChartCanvas = document.getElementById('state-chart').getContext('2d');

    const API_BASE_URL = 'http://127.0.0.1:8000';

    let stateChart;

    function initStateChart(data) {
        stateChart = new Chart(stateChartCanvas, {
            type: 'bar',
            data: {
                labels: Object.keys(data).filter(k => typeof data[k] === 'number'),
                datasets: [{
                    label: 'State Values',
                    data: Object.values(data).filter(v => typeof v === 'number'),
                    backgroundColor: 'rgba(0, 170, 255, 0.5)',
                    borderColor: 'rgba(0, 170, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#fff'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#fff'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#fff'
                        }
                    }
                }
            }
        });
    }

    function updateStateChart(data) {
        if (!stateChart) {
            initStateChart(data);
        } else {
            stateChart.data.labels = Object.keys(data).filter(k => typeof data[k] === 'number');
            stateChart.data.datasets[0].data = Object.values(data).filter(v => typeof v === 'number');
            stateChart.update();
        }
    }

    async function fetchStateData() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/state`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            stateDataElement.textContent = JSON.stringify(data, null, 2);
            updateStateChart(data);
        } catch (error) {
            stateDataElement.textContent = `Error fetching state data: ${error.message}`;
        }
    }

    async function fetchPublicData() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/public-data`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            publicDataElement.textContent = JSON.stringify(data, null, 2);
        } catch (error) {
            publicDataElement.textContent = `Error fetching public data: ${error.message}`;
        }
    }

    // Fetch initial data
    fetchStateData();
    fetchPublicData();

    // Poll for state data changes every 5 seconds
    setInterval(fetchStateData, 5000);
});
