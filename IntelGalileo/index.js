var exosite = require('./exosite');
var mraa = require('mraa'); //require mraa
var querystring = require('querystring');
var request = require('request');


console.log('MRAA Version:' + mraa.getVersion()); //write the mraa version to the console

var CIK = '';//put your device CIK from exosite.com;
//here temperature, pressure and assetswitch are the alias names of the data ports. you can change by yours.


var a0 = new mraa.Aio(0);
var a1 = new mraa.Aio(1);

var data={};
function loop(){
	data.temperature = Math.round(calculateTemperature(a0.read()).f);//datasource alias
	data.pressure = a1.read();//datasource alias
	//data.assetswitch = 0: // 0 or 1. Using this only for reading the state changes from exosite switch
	
	exosite.request({
		CIK:CIK,
		write:data,
		read:['temperature','pressure','assetswitch'],
		success:function(data){
			console.log(data);
			if(data.assetswitch==1){
				//switch on the light				
			}else{
				//switch of the light
			}
			setTimeout(loop,10000);
		},
		error:function(err){
			console.log(err);
		}
	});	
}
loop();  


  
function calculateTemperature(a){
	var B = 3975;
    var resistance = (1023 - a) * 10000 / a; //get the resistance of the sensor;
	var celsius_temperature = 1 / (Math.log(resistance / 10000) / B + 1 / 298.15) - 273.15;//convert to temperature via datasheet ;
    var fahrenheit_temperature = (celsius_temperature * (9 / 5)) + 32;
    return {c:celsius_temperature,f:fahrenheit_temperature};
}