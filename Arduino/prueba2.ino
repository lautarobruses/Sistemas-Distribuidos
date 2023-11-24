#include <SPI.h>
#include <MFRC522.h>
#include <PubSubClient.h>
#include <WiFi.h>

#define RST_PIN         16          // Configurable, see typical pin layout above
#define SS_PIN          5         // Configurable, see typical pin layout above

MFRC522 mfrc522(SS_PIN, RST_PIN);  // Create MFRC522 instance

// Update these with values suitable for your network.
const char* ssid = "ClaroFibra";
const char* password = "20222022";

const char* mqtt_server = "test.mosquitto.org";

WiFiClient espClient;
PubSubClient client(espClient);

//*****************************************************************************************//

void setup_wifi() {

  delay(10);      // We start by connecting to a WiFi network
  
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  randomSeed(micros());

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

//*****************************************************************************************//

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
}

//*****************************************************************************************//

void reconnect() {                                 // Loop until we're reconnected
  
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Create a random client ID
    String clientId = "ESP8266Client-";
    clientId += String(random(0xffff), HEX);
    // Attempt to connect
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
      // Once connected, publish an announcement...
      client.publish("SistemasDistribuidos2023", "Conectado MQTT");
      // ... and resubscribe
      //client.subscribe("SistemasDistribuidos2023");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

//*****************************************************************************************//

void setup() {
	Serial.begin(9600);		// Initialize serial communications with the PC
	SPI.begin();			// Init SPI bus
	mfrc522.PCD_Init();		// Init MFRC522
	delay(4);				// Optional delay. Some board do need more time after init to be ready, see Readme
	setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

//*****************************************************************************************//

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  
  MFRC522::MIFARE_Key key;
  for (byte i = 0; i < 6; i++) key.keyByte[i] = 0xFF;

  byte block;
  byte len = 18;
  MFRC522::StatusCode status;

  if ( mfrc522.PICC_IsNewCardPresent()) {
    
    if ( mfrc522.PICC_ReadCardSerial()) {

      Serial.println(F("**Card Detected:**"));

      //mfrc522.PICC_DumpDetailsToSerial(&(mfrc522.uid)); //dump some details about the card

      byte buffer1[18];
      String json;
      block=32;

      while (block <= 38){
        
        status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, block, &key, &(mfrc522.uid)); //line 834 of MFRC522.cpp file
        if (status != MFRC522::STATUS_OK) {
          Serial.print(F("Authentication failed: "));
          Serial.println(mfrc522.GetStatusCodeName(status));
          return;
        }

        status = mfrc522.MIFARE_Read(block, buffer1, &len);
        if (status != MFRC522::STATUS_OK) {
          Serial.print(F("Reading failed: "));
          Serial.println(mfrc522.GetStatusCodeName(status));
          return;
        }
        
        block = block + 1;
        if (block == 35){ 
          block = 36;
        }
              
        String aux = String((char*)buffer1);

        aux.remove(16);
        json.concat(aux);

      }

      const char* dat= json.c_str();

      client.publish("SistemasDistribuidos2023",dat);

      Serial.print(json);  
    
    mfrc522.PICC_HaltA();
    mfrc522.PCD_StopCrypto1();

    }
  }
  delay(1000);
}
