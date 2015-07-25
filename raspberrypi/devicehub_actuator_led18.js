var GPIO = require('onoff').Gpio;
var mqtt    = require('mqtt');
var led = new GPIO(18, 'out');

var host='mqtt://mqtt.devicehub.net';
var port='1883';
var message = '{"state":1}';
var topic ='';//put you unique topic id from devicehub



var client  = mqtt.connect(host);
 
client.on('connect', function () {
  client.subscribe(topic);  
  //client.publish(topic, message, {retain: true});
});
 
client.on('message', function (topic, message) {  	
	var data = JSON.parse(message.toString());
	console.log(data);
  	led.write(parseInt(data.state));
});
console.log('topic for actuator_led18 subsribed on mqtt://mqtt.devicehub.net');