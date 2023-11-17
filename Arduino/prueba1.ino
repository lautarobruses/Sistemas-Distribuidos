#include <SPI.h>
#include <MFRC522.h>
#define RST_PIN         16          // Configurable, see typical pin layout above
#define SS_PIN          5         // Configurable, see typical pin layout above

MFRC522 mfrc522(SS_PIN, RST_PIN);  // Create MFRC522 instance

#include <PubSubClient.h>
#include <WiFi.h>

// Update these with values suitable for your network.
const char* ssid = "";
const char* password = "";

//const char* ssid = "Hands On IoT";
//const char* password = "handsoniot";

const char* mqtt_server = "test.mosquitto.org";

WiFiClient espClient;
PubSubClient client(espClient);


void setup_wifi() {

  delay(10);
  // We start by connecting to a WiFi network
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

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
  
}

void reconnect() {
  // Loop until we're reconnected
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

void setup() {
	Serial.begin(9600);		// Initialize serial communications with the PC
	SPI.begin();			// Init SPI bus
	mfrc522.PCD_Init();		// Init MFRC522
	delay(4);				// Optional delay. Some board do need more time after init to be ready, see Readme
	setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  
  if ( mfrc522.PICC_IsNewCardPresent()) {
    
    if ( mfrc522.PICC_ReadCardSerial()) {
            
      String user="";      
      String uid_str="";
      int num=0;
      char buffer[2]="";
      for (byte i = 0; i < mfrc522.uid.size; i++) {
          
          num=(int)mfrc522.uid.uidByte[i];
          sprintf(buffer,"%02X",num);
          uid_str.concat((String)buffer);
          uid_str.concat(" ");
         
      } 
      Serial.print("Card UID:");
      Serial.println(uid_str);
      const char* dat= uid_str.c_str();

      client.publish("SistemasDistribuidos2023",dat);//uid_str.c_str() );
      uid_str="";
    
    }
  }
  delay(1000);
}
