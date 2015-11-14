var serialPort = require("serialport");
var SerialPort = serialPort.SerialPort


var readCallback = function(){};
var arduino={
	port:null,
	ready:function(callback){
		init(callback);
	},
	read:function(callback){
		readCallback=callback;
	},
	write:function(data,fn){
		this.port.write(data, fn);	
	},
}

function init(callback){
	getArduinoPort(function(port){			
		port.open(function (error) {
			  if ( error ) {
				console.log('failed to open: '+error);
			  } else {
				console.log('port opened...........');
				arduino.port = port;
				callback.call(arduino,null);			
				port.on('data', function(chunk) {
					readUntilbreak(chunk,function(data){
						console.log(data);
						//arduino.read(data);
						readCallback(data);
					});
				});			
			  }
			});	
	});
}




module.exports=arduino;
/*
* the data chunk received from arduino serial and pooled until '\n' and then retuns consolidated data
*/
var msgpool='';
function readUntilbreak(chunk,callback){
	 msgpool += chunk;
	 if(msgpool.indexOf("\n")!=-1){							
		var parts=msgpool.split("\n");
		var output = parts[0].trim();
		if(output!=""){
			output=output.replace(/\n/,"");
			callback(output);	
		}
		msgpool=parts[1];
	 }
}

/*
* scans the list of ports and returns the port where arduino is connected.
* null: if arduino is not connected..
*/
function getArduinoPort(fn){
	var port;
	serialPort.list(function (err, ports) {	  
	  for(var i in ports){
		var p = ports[i];
		if(p.manufacturer.indexOf("Arduino") != -1){port=p;break;}
	  }	  
	  if(port){
		console.log('Arduino Port found');	
		fn(new SerialPort(port.comName, { baudrate: 9600}, false))
	  }else{
		console.log('Arduino Port not found');	
	  }
	});	
}
