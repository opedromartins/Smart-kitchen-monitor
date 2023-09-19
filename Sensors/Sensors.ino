#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>
#include <MQUnifiedsensor.h>

#include <WiFi.h>
#include <WebServer.h>

#include "credentials.h"

WebServer server(80);

// Sensor data variables
float temperature, pressure, humidity;
double CO2 = 0;

void setupWiFi() {
  Serial.println("Setting up WiFi...");
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }

  Serial.println("Connected to WiFi");
    // Print the IP address
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

void handleRoot() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  String json = "{";
  json += "\"temperature\": " + String(temperature);
  json += ", \"pressure\": " + String(pressure);
  json += ", \"humidity\": " + String(humidity);
  json += ", \"co2\": " + String(CO2);
  json += "}";
  
  server.send(200, "application/json", json);
}

void setupServer() {
  server.on("/", HTTP_GET, handleRoot);
  server.begin();
}

Adafruit_BME280 bme;
unsigned long delayTime;

// Definitions for MQ135
#define placa "ESP-32"
#define Voltage_Resolution 3.3
#define pin 34 // Analog input 0 of your ESP32
#define type "MQ-135"
#define ADC_Bit_Resolution 12
#define RatioMQ135CleanAir 3.6

MQUnifiedsensor MQ135(placa, Voltage_Resolution, ADC_Bit_Resolution, pin, type);

void setup() {
  Serial.begin(115200);

  // Initialize BME280
  if (!bme.begin(0x76)) {
    Serial.println("Could not find a valid BME280 sensor, check wiring!");
    while (1);
  }
  
  // Initialize MQ135
  MQ135.setRegressionMethod(1); // _PPM = a * ratio^b
  MQ135.init();
  Serial.print("Calibrating please wait.");
  float calcR0 = 0;
  for (int i = 1; i <= 10; i++) {
    MQ135.update(); // Update data, the ESP32 will read the voltage on the analog pin
    calcR0 += MQ135.calibrate(RatioMQ135CleanAir);
    Serial.print(".");
  }
  MQ135.setR0(calcR0 / 10);
  Serial.println("  done!.");

  // Add a delay before setting up WiFi
  delay(2000);

  // Setup WiFi
  setupWiFi();
  setupServer();
}


void loop() {
  server.handleClient();  // Handle Web Server

  // Read BME280 values
  temperature = bme.readTemperature();
  pressure = bme.readPressure() / 100.0F;
  humidity = bme.readHumidity();

  // Read MQ135 values
  MQ135.update();
  MQ135.setA(110.47);
  MQ135.setB(-2.862);
  CO2 = MQ135.readSensor() + 400;
  /*
  Motivation:
  We have added 400 PPM because when the library is calibrated it assumes the current state of the
  air as 0 PPM, and it is considered today that the CO2 present in the atmosphere is around 400 PPM.
  https://www.lavanguardia.com/natural/20190514/462242832581/concentracion-dioxido-cabono-co2-atmosfera-bate-record-historia-humanidad.html
  (Motivation came from https://github.com/miguel5612/MQSensorsLib/blob/master/examples/MQ-135-ALL/MQ-135-ALL.ino)
  */

  // Print values (or whatever you need to do)
  Serial.print("Temperature = ");
  Serial.print(temperature);
  Serial.println(" *C");

  Serial.print("Pressure = ");
  Serial.print(pressure);
  Serial.println(" hPa");

  Serial.print("Humidity = ");
  Serial.print(humidity);
  Serial.println(" %");

  Serial.print("CO2 = ");
  Serial.print(CO2);
  Serial.println(" ppm");

  delay(1000);
}
