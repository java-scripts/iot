var GPIO = require('onoff').Gpio;
var mqtt    = require('mqtt');
var led = new GPIO(18, 'out');

var host='mqtt://mqtt.devicehub.net';
var port='1883';
var message = '{"state":1}';
var topic ='/a/813e788e-81f5-45a8-bd89-d8200a5bb9e8/p/4826/d/263401a7-95fe-40c1-9feb-069e0a95640c/actuator/actuator_led18/state';



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