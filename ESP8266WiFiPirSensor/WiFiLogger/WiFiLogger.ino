#include "DHT.h"
#include <ESP8266WiFi.h>

#define DHTTYPE DHT11

//const char* ssid = "ESP8266Haven";
const char* ssid = "Tejaswi";
const char* password = "12345678";

const char* host = "52.34.69.96";

const int lightPin = A0;
int lightVal = 0;         // variable for reading the pushbutton status

const int tempPin = D1;
int tempVal;

DHT dht(tempPin, DHTTYPE);

//DHT dht;

void setup() {
  pinMode(lightPin, INPUT);

  Serial.begin(115200);
  delay(10);


  // We start by connecting to a WiFi network

  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

}

int lastValTemp = 1;
int lastValLight = 1;
int num = 1;

void sendMessage()
{
  float tval = dht.readTemperature(true);
  float hval = dht.readHumidity();
  float lval = analogRead(lightPin);

  float newLVal = map(lval, 0, 1023, 0, 100);
  
  Serial.print("Button Val #");
  Serial.println(num);
  num++;

  // Use WiFiClient class to create TCP connections
  WiFiClient client;
  const int httpPort = 8080;
  if (!client.connect(host, httpPort)) {
    Serial.println("connection failed");
    return;
  }

  // We now create a URI for the request
  String url = "/update?light=";
  url += newLVal;

  url += "&temp=";
  url += tval;

  url+= "&humidity=";
  url+= hval;

  Serial.print("Requesting URL: ");
  Serial.println(url);

  // This will send the request to the server
  client.print(String("GET ") + url + " HTTP/1.1\r\n" +
               "Host: " + host + "\r\n" +
               "Connection: close\r\n\r\n");
  unsigned long timeout = millis();
  while (client.available() == 0) {
    if (millis() - timeout > 5000) {
      Serial.println(">>> Client Timeout !");
      client.stop();
      return;
    }
  }

  // Read all the lines of the reply from server and print them to Serial
  while (client.available()) {
    String line = client.readStringUntil('\r');
    Serial.print(line);
  }

  Serial.println();
  Serial.println("closing connection");

  dht.begin();
}

void loop() {
  float f = dht.readTemperature(true);
  float h = dht.readHumidity();
  lightVal = analogRead(lightPin);
  //  tempVal = dht.read11(tempPin);
  //Serial.println(lightVal);
  if (lightVal != lastValLight || f != lastValTemp) {
    sendMessage();
  }
  lastValLight = lightVal;
  lastValTemp = f;

  /*
    delay(5000);


    Serial.print("connecting to ");
    Serial.println(host);


  */
}

