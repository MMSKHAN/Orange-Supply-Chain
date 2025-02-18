#include <TinyGPS++.h>
#include <SoftwareSerial.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecure.h>
#include <DHT.h>

// GPS Pins
const int RX_PIN = 3, TX_PIN = 4;  
const uint32_t GPS_BAUD = 9600;    // Default baud rate for NEO-6M GPS

// Initialize GPS object
TinyGPSPlus gps;  
SoftwareSerial gpsSerial(RX_PIN, TX_PIN);  // GPS Serial connection

// DHT Sensor configuration
#define DHTPIN D2           // Pin where DHT11 data is connected
#define DHTTYPE DHT11       // DHT 11 sensor type
DHT dht(DHTPIN, DHTTYPE);  // Create an instance of the DHT sensor

// WiFi and Firebase credentials
#define WIFI_SSID "Thunder"
#define WIFI_PASSWORD "Sssh1245"
#define FIREBASE_HOST "iot-a3dd1-default-rtdb.firebaseio.com"
#define FIREBASE_WEB_API_KEY "AIzaSyCI5nL-n-djoo1IzhjCdpX3PdAUmcW9xmo"

// Timing control
unsigned long previousMillis = 0;  // Stores the last time data was sent
const long interval = 2000;         // Interval between sending data (2 seconds)

void setup() {
  // Initialize Serial Monitor
  Serial.begin(9600);
  gpsSerial.begin(GPS_BAUD);  // GPS communication

  // Connect to Wi-Fi
  Serial.print("Connecting to WiFi");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("\nConnected to WiFi");
  Serial.println("IP Address: " + WiFi.localIP().toString());

  // Initialize DHT Sensor
  dht.begin();
}

void loop() {
  // Read GPS data
  if (gpsSerial.available() > 0) {
    if (gps.encode(gpsSerial.read())) {
      if (gps.location.isValid()) {
        // Read GPS data
        float latitude = gps.location.lat();
        float longitude = gps.location.lng();
        float altitude = gps.altitude.isValid() ? gps.altitude.meters() : 0;
        float speed = gps.speed.isValid() ? gps.speed.kmph() : 0;

        // Print GPS data to Serial Monitor
        Serial.println(F("GPS Data:"));
        Serial.print(F("- Latitude: "));
        Serial.println(latitude, 6);
        Serial.print(F("- Longitude: "));
        Serial.println(longitude, 6);
        Serial.print(F("- Altitude: "));
        Serial.println(altitude);
        Serial.print(F("- Speed: "));
        Serial.println(speed);

        // Read DHT11 data (Temperature and Humidity)
        float temperature = dht.readTemperature();  // Temperature in Celsius
        float humidity = dht.readHumidity();        // Humidity in percentage

        // Validate DHT data
        if (isnan(temperature) || isnan(humidity)) {
          Serial.println("Failed to read from DHT sensor!");
        } else {
          // Print DHT data to Serial Monitor
          Serial.println("DHT Data:");
          Serial.print("Temperature: ");
          Serial.print(temperature);
          Serial.print(" °C, Humidity: ");
          Serial.print(humidity);
          Serial.println(" %");

          // Get current time in milliseconds
          unsigned long currentMillis = millis();

          // If enough time has passed since last sending data, send data to Firebase
          if (currentMillis - previousMillis >= interval) {
            // Save the last time data was sent
            previousMillis = currentMillis;
            
            // Send data to Firebase
            sendDataToFirebase(latitude, longitude, altitude, speed, temperature, humidity);
          }
        }
      } else {
        Serial.println(F("- GPS location: INVALID"));
      }
    }
  }

  // Error if GPS is not providing data
  if (millis() > 5000 && gps.charsProcessed() < 10) {
    Serial.println(F("No GPS data received: check wiring or signal."));
  }
}

// Function to send data to Firebase
void sendDataToFirebase(float latitude, float longitude, float altitude, float speed, float temperature, float humidity) {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClientSecure client;
    client.setInsecure();  // Disable SSL certificate verification for Firebase

    HTTPClient http;

    // Prepare JSON payload for Firebase
    String jsonPayload = String("{\"latitude\":") + latitude +
                         String(",\"longitude\":") + longitude +
                         String(",\"altitude\":") + altitude +
                         String(",\"speed\":") + speed +
                         String(",\"temperature\":") + temperature +
                         String(",\"humidity\":") + humidity + "}";

    // Firebase URL with API key
    String url = String("https://") + FIREBASE_HOST + "/sensor_data.json?auth=" + FIREBASE_WEB_API_KEY;
    http.begin(client, url);  // Initialize HTTP client with secure connection

    // Set content type header for the request
    http.addHeader("Content-Type", "application/json");

    // Send the POST request
    int httpResponseCode = http.POST(jsonPayload);

    // Handle the response
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("Data sent successfully to Firebase!");
      Serial.println(response);  // Print Firebase response
    } else {
      Serial.print("Error sending data: ");
      Serial.println(httpResponseCode);
    }

    // End the HTTP request
    http.end();
  } else {
    Serial.println("WiFi not connected. Unable to send data to Firebase.");
  }
}
