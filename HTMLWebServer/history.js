// Initialize Chart.js variables
const ctxCO2 = document.getElementById("co2Chart").getContext("2d");
const ctxCO = document.getElementById("coChart").getContext("2d");
const ctxTemperature = document.getElementById("temperatureChart").getContext("2d");
const ctxHumidity = document.getElementById("humidityChart").getContext("2d");

const dataTemplate = {
    labels: [],
    datasets: [{
        label: "",
        data: [],
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        fill: false,
    }]
};

const co2Data = JSON.parse(JSON.stringify(dataTemplate));
co2Data.datasets[0].pointRadius = 1;
co2Data.datasets[0].pointHitRadius = 0;

const coData = JSON.parse(JSON.stringify(dataTemplate));
coData.datasets[0].pointRadius = 1;
coData.datasets[0].pointHitRadius = 0;

const temperatureData = JSON.parse(JSON.stringify(dataTemplate));
temperatureData.datasets[0].pointRadius = 1;
temperatureData.datasets[0].pointHitRadius = 0;

const humidityData = JSON.parse(JSON.stringify(dataTemplate));
humidityData.datasets[0].pointRadius = 1;
humidityData.datasets[0].pointHitRadius = 0;

co2Data.datasets[0].label = "CO2";
coData.datasets[0].label = "CO";
temperatureData.datasets[0].label = "Temperature";
humidityData.datasets[0].label = "Humidity";

const co2Chart = new Chart(ctxCO2, { options: { scales: { y: { min: 0, max: 1000 } } },
    type: "line",
    data: co2Data,
});

const coChart = new Chart(ctxCO, { options: { scales: { y: { min: 0, max: 100 } } },
    type: "line",
    data: coData,
});


const temperatureChart = new Chart(ctxTemperature, { options: { scales: { y: { min: 0, max: 100 } } },
    type: "line",
    data: temperatureData,
});

const humidityChart = new Chart(ctxHumidity, { options: { scales: { y: { min: 0, max: 100 } } },
    type: "line",
    data: humidityData,
});

// Function to fetch sensor data and update the charts
const fetchDataAndUpdateCharts = async () => {
    try {
        const response = await fetch("http://192.168.137.54/");
        const data = await response.json();

        const now = new Date().toLocaleTimeString();

        // Update CO2 Chart
        co2Data.labels.push(now);
        co2Data.datasets[0].data.push(data.co2);
        co2Chart.update();
    
        // Update CO Chart
        coData.labels.push(now);
        coData.datasets[0].data.push(data.co);
        coChart.update();

        // Update Temperature Chart
        temperatureData.labels.push(now);
        temperatureData.datasets[0].data.push(data.temperature);
        temperatureChart.update();

        // Update Humidity Chart
        humidityData.labels.push(now);
        humidityData.datasets[0].data.push(data.humidity);
        humidityChart.update();

    } catch (error) {
        console.error("Failed to fetch sensor data:", error);
    }
};

setInterval(fetchDataAndUpdateCharts, 3000);