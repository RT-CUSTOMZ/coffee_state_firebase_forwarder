import {Notifications} from "./notifications";
import {MqttClient} from "./mqttClient";

console.log("Coffee state firebase forwarder is starting")

const mqttUri = process.env.MQTT_URI || 'ws://mqtt.42volt.de:9001/';

let mqttClient = new MqttClient(mqttUri);
const notifications = new Notifications();

mqttClient.on("message", notifications.sendToAll);

process.on('SIGTERM' || 'SIGINT', function () {
  console.log("Coffee state firebase forwarder is shuting down")
  mqttClient.end();

  // shutdown anyway after some time
  setTimeout(function(){
      process.exit(0);
  }, 8000);
});
