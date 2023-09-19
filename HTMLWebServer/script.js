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
        updateProgress('humidity', data.humidity, " %", 100);
        updateProgress('mq135', data.mq135, "", 100); // Handle NaN in updateProgress function
    } catch (error) {
        console.error('Error fetching sensor data:', error);
    }
}

// Function to fetch and update the person count
async function fetchAndUpdatePersonCount() {
    try {
        const response = await fetch('http://127.0.0.1:5001/person_count');
        const data = await response.json();
        const count = data.person_count;
        document.getElementById("person-count").querySelector(".value").textContent = count;
    } catch (error) {
        console.error("Could not fetch person count:", error);
    }
}

// Update the progress circles with real-time sensor data
setInterval(fetchSensorData, 1000);

// Update the person count every second
setInterval(fetchAndUpdatePersonCount, 1000);