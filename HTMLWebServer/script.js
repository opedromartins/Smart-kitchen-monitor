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
    
    // Update color based on value ranges
    if (sensorId === 'temperature') {
        if (value >= 20 && value <= 35) {
            circle.classList.remove("progress-yellow", "progress-red");
            circle.classList.add("progress-green");
        } else if ((value >= 10 && value < 20) || (value > 35 && value <= 45)) {
            circle.classList.remove("progress-green", "progress-red");
            circle.classList.add("progress-yellow");
        } else {
            circle.classList.remove("progress-green", "progress-yellow");
            circle.classList.add("progress-red");
        }
    }
    
    if (sensorId === 'pressure') {
        if (value >= 990 && value <= 1013) {
            circle.classList.remove("progress-yellow", "progress-red");
            circle.classList.add("progress-green");
        } else if (value > 1013 && value <= 1020) {
            circle.classList.remove("progress-green", "progress-red");
            circle.classList.add("progress-yellow");
        } else {
            circle.classList.remove("progress-green", "progress-yellow");
            circle.classList.add("progress-red");
        }
    }
    
    if (sensorId === 'humidity') {
        if ((value >= 20 && value < 30) || (value > 50 && value <= 65)) {
            circle.classList.remove("progress-green", "progress-red");
            circle.classList.add("progress-yellow");
        } else if (value >= 30 && value <= 50) {
            circle.classList.remove("progress-yellow", "progress-red");
            circle.classList.add("progress-green");
        } else {
            circle.classList.remove("progress-green", "progress-yellow");
            circle.classList.add("progress-red");
        }
    }    
    
    if (sensorId === 'co2') {
        if (value >= 350 && value <= 1000) {
            circle.classList.remove("progress-yellow", "progress-red");
            circle.classList.add("progress-green");
        } else if (value > 1000 && value <= 2000) {
            circle.classList.remove("progress-green", "progress-red");
            circle.classList.add("progress-yellow");
        } else {
            circle.classList.remove("progress-green", "progress-yellow");
            circle.classList.add("progress-red");
        }
    }

    if (sensorId === 'co') {
        if (value <= 50) {
            circle.classList.remove("progress-yellow", "progress-red");
            circle.classList.add("progress-green");
        } else if (value > 50 && value <= 100) {
            circle.classList.remove("progress-green", "progress-red");
            circle.classList.add("progress-yellow");
        } else {
            circle.classList.remove("progress-green", "progress-yellow");
            circle.classList.add("progress-red");
        }
    }
    
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
        updateProgress('co2', data.co2, "", 1000); // Handle NaN in updateProgress function
        updateProgress('co', data.co, "", 100);
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