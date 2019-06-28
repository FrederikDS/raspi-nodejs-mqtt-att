//import MQTT
const mqtt = require('mqtt');


/*********************************************************************
 *  AllThingsTalk Maker IoT configurations
 ********************************************************************/

 // ATT MQTT borker endpoint
const broker = 'mqtt://api.allthingstalk.io';

// ATT MQTT username = device token, password = something
const connectOptions = {
	username: "YOUR DEVICE TOKEN", 
	password: "justapassword"
}

// ATT Device config
const deviceID =  'YOUR DEVICE ID';
const assetName = 'Counter';

// ATT MQTT topic
const publishTopic = `device/${deviceID}/asset/${assetName}/state`;
const subscribeTopic = `device/${deviceID}/asset/*/feed`;

const mqttOptions={
	retain:true,
	qos:1
};

/*********************************************************************/


// connect the client to the att mqtt broker
let client = mqtt.connect(broker, connectOptions);
console.log(`connected flag ${client.connected}`);

//handle incoming messages
client.on('message', (topic, message, packet) => {
	console.log("message is "+ message);
	console.log("topic is "+ topic);
});

//conect
client.on("connect", () => {	
	console.log("connected  "+ client.connected);
});

//handle errors
client.on("error", (error) => {
	console.log("Can't connect" + error);
	process.exit(1)
});

//publish
function publish(topic,msg,mqttOptions){

	console.log("publishing",msg);

	if (client.connected == true){
		client.publish(topic,msg,mqttOptions);
	}
}

console.log("subscribing to topics");
client.subscribe(subscribeTopic, mqttOptions);


let counter = 1;
var timer_id = setInterval(function(){
	
	let payload = `{"value": ${counter}}`;
	publish(publishTopic,payload,mqttOptions);
	counter++;

},5000);

//Clean up on end (Ctr+C)
process.on('SIGINT', (err) => {
	console.log('ending...');
	clearTimeout(timer_id); //stop timer
	client.end();
	process.removeAllListeners(); 
	process.exit();
	if (typeof err != 'undefined'){
		console.log(err); 
	}
});

//notice this is printed even before we connect
console.log("end of script");
