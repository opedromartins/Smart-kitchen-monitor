# Smart Kitchen Monitor

## Overview
Final project for the course Internet of Things at [Universidade Federal de Goiás](https://ufg.br/) on the [bachelor's degree in Artificial Intelligence](https://inteligenciaartificial.inf.ufg.br/).

This project aims to create a smart kitchen monitoring system using Arduino and ESP32. It consists of three main components:
1. **Sensors**: Arduino code for monitoring environmental conditions using BME280 and MQ135 sensors.
2. **Camera Web Server**: A web server that streams video from a camera module connected to an ESP32.
3. **Dashboard Web Server**: A dashboard for real-time monitoring of sensor data.
4. **Vision Model**: Uses [YOLO](https://towardsdatascience.com/yolo-you-only-look-once-real-time-object-detection-explained-492dc9230006) object detection to count the number of people in the video stream.

## Structure
- `CameraWebServer/`: Contains the code for the Camera Web Server.
  - The default [ESP32-CAM example](https://github.com/espressif/arduino-esp32/tree/master/libraries/ESP32/examples/Camera/CameraWebServer)
- `Sensors/`: Contains the Arduino code for monitoring sensors.
  - `Sensors.ino`: Main Arduino sketch file.
- `HTMLWebServer/`: Contains the files for the dashboard web server.
  - `iot_sensor_monitoring.html`: HTML file for the dashboard.
  - `script.js`: JavaScript file for handling dynamic content.
  - `styles.css`: CSS file for styling the dashboard.
  - `history.html`: HTML file for the history page.
  - `history.js`: JavaScript file for handling dynamic content on history page.
- `VisionModel/`: Contains the Python script for YOLO object detection.
  - `App.py`: Main Python script.

## Team
- [Pedro Martins Bittencourt](https://github.com/opedromartins)
- [Victor Guerreiro Pimenta](https://github.com/gueleilo)