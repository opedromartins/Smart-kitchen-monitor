// Function to update progress circle
function updateProgress(sensorId, value, unit, max) {
    const sensor = document.getElementById(sensorId);
    const circle = sensor.querySelector('.progress');
    const valueSpan = sensor.querySelector('.value');

    if(isNaN(value)) {
        value = 0;
    }

    const circumference = 2 * Math.PI * 45;
    const offset = circumference - ((value / max) * circumference);

    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = offset;

    valueSpan.innerText = isNaN(value) ? 'N/A' : value + unit;
}

// Function to fetch real-time sensor data from ESP32
async function fetchSensorData() {
    try {
        const response = await fetch('http://192.168.137.54/');
        const data = await response.json();
        
        updateProgress('temperature', data.temperature, "°C", 50);
        updateProgress('pressure', data.pressure, " hPa", 1100);
        updateProgress('altitude', data.altitude, " m", 1000);
        updateProgress('humidity', data.humidity, " %", 100);
        updateProgress('mq135', data.mq135, "", 100); // Handle NaN in updateProgress function
    } catch (error) {
        console.error('Error fetching sensor data:', error);
    }
}

// Update the progress circles with real-time sensor data
setInterval(fetchSensorData, 1000);
