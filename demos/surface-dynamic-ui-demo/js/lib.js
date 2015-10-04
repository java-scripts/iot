(function(){
	var q={};	
	var publish=function(name,msg){
		var subscribers = q[name];
		for(var i in subscribers){
			subscribers[i](msg);
		}
	};	
	var subscribe = function(name, callback){
		if(!q[name]){q[name]=[];}
		q[name].push(callback);
	};
	
	var	unsubscribe = function(name,callback){
		var subscribers = q[name];
		var index = (subscribers||[]).indexOf(callback);
		if(index > -1){
			subscribers.splice(index,1);
		}
	}
	
	
	window.pubsub={
		publish:publish,
		subscribe:subscribe,
		unsubscribe:unsubscribe
	}
}());


var demoUtil={};
//worksheet
(function(){
	var WorkSheet = function(){
		var lcds=[],charts=[],conditions=[],outputs=[];		
		var lcdcount=0,chartCount=0;
		var lcdDispatcher=0,chartDispatcher=0;
		
		//subscribes
		var subscribes={
			light:function(msg){notifyDisplay('light',msg);},
			temp:function(msg){	notifyDisplay('temp',msg);},
			sound:function(msg){notifyDisplay('sound',msg);},
			touch:function(msg){notifyDisplay('touch',msg);},
			rotary:function(msg){notifyDisplay('rotary',msg);}
		};
		
		
		var notifyDisplay = function(name, msg){
			if(lcdcount>0){				
				lcds[lcdDispatcher].display(name+': '+msg);
				lcdDispatcher=(lcdDispatcher+1)%lcdcount;
			}
			if(chartCount > 0){
				charts[chartDispatcher].display(name,msg);
				chartDispatcher=(chartDispatcher+1)%chartCount;
			}
			
			for(var i in conditions){
				conditions[i].notifyInput(name,msg);
			}
			
		};	
	
		var addInput = function(input){
			console.log('adding',input);
			pubsub.subscribe(input.name, subscribes[input.name]);
		};
	
		var addOutPut = function(output){
			outputs.push(output);
			for(var i in conditions){
				conditions[i].notifyOutput(output.name,output);
			}
		};
		
		
		var addLCD = function(lcd){			
			lcds.push(lcd);lcdcount++;
		};
		
		var addChart = function(chart){
			charts.push(chart);chartCount++;			
		};
		
		var addCondition = function(condition){
			conditions.push(condition);		
			for(var i in outputs){
				condition.notifyOutput(outputs[i].name,outputs[i]);
			}			
		};
		
		var addMap={input:addInput,output:addOutPut,lcd:addLCD,chart:addChart,condition:addCondition};
		this.addGadget=function(gadget){				
			addMap[gadget.gtype](gadget);
		};
		
	};

	demoUtil.createWorkSheet = function(){
		return new WorkSheet();
	}

}());

//gadget creation
(function(){

	var Input = function($node){
		//console.log('atINPUT:',$node[0])	
		this.gtype='input';
		this.name = $node.attr('name');
	};
	
	var Output = function($node){
		this.gtype='output';
		this.name = $node.attr('name');
		this.$node=$node;
	};
	
	var LCD = function($node){
		console.log($node.find('.lcdtext')[0])
		this.gtype='lcd';
		this.name = $node.attr('name');
		
		this.display = function(msg){			
			$node.find('.lcdtext').text(msg);
		}
	};
	
	var Chart = function($node){
		var series,data,index=0,chartData=0;
		var datalength=50;
		
		$node.removeClass('chart-icon').addClass('chart-medium');
		this.gtype='chart';
		this.name = $node.attr('name');
		
		var seriesMap={light:{data:[]},temp:{data:[]},sound:{data:[]},touch:{data:[]},rotary:{data:[]}};		
		var chart = $node.highcharts({}).highcharts();
	
		this.display = function(name, val){			
			series = seriesMap[name];
			if(!series.existed){
				series.existed=true;
				series.index=index++;
				chart.addSeries({name:name,data:[]});			
			}			
			chartData = chart.series[series.index];			
			data = seriesMap[name].data;
			if(data.length>=datalength){data.splice(0,1);}
			data.push(val);			
			chartData.setData(data);			
		};
	};
	
	
	
	function Condition($node){
		this.gtype='condition';
		this.name = $node.attr('name');		
		
		var $image = $node.find('img').css({'height': '88', 'width': '106'});
		var $input = $node.find('#input').css('display','block');
		var $condition = $node.find('#condition').css('display','block');
		var $threshold = $node.find('#threshold').css('display','block');		
		var $output = $node.find('#output').css('display','block');
		
		var inputs={},result;	var outputs={};
		
		this.notifyInput = function(input, val){			
			if(!inputs[input]){
				inputs[input]=true;
				renderInput(input);
			}
			//if condition is met
			//result = evaluate(val,$condition.val(),$threshold.val())
			//console.log($input.val(), input, val, $condition.val(),$threshold.val(), result)
			var output=$output.val(); $outputNode = (outputs[output]||{}).$node;
			if($input.val()==input && evaluate(val,$condition.val(),$threshold.val())){
				pubsub.publish(output,1);			
				if($outputNode)$outputNode.addClass('active');
			}else{
				pubsub.publish(output,0);
				console.log($output)
				if($outputNode)$outputNode.removeClass('active');
			}
			
		}
		
		
		this.notifyOutput = function(output,$output){			
			if(!outputs[output]){
				outputs[output]=$output;
				renderOutput(output);
			}
		
		}
		
		function renderInput(name){
			$input.append('<option value="'+name+'">'+name+'</option>')
		}
		
		function renderOutput(name){		
			$output.append('<option value="'+name+'">'+name+'</option>')
		}
		
		function evaluate(input, condition, output){						
			return eval(input+""+condition+""+output);
		}
		
	};
	
	
	demoUtil.createGadget = function($node){
		var type = $node.attr('gtype');		
		if(type=='input'){
			return new Input($node);
		}else if(type == 'output'){
			return new Output($node);
		}else if(type == 'lcd'){
			return new LCD($node);
		}else if(type == 'chart'){
			return new Chart($node);
		}else if(type == 'condition'){
			return new Condition($node);
		}
		return null;
	}

}());






























var statemap={}
function detectStateChange(name, state){
	if(state!==statemap[name]){
		console.log(name,state);
		statemap[name]=state;
	}
}

var loop = function(){
	pubsub.publish('light',Math.round(Math.random()*500));
	pubsub.publish('temp',Math.round(Math.random()*30));
	pubsub.publish('sound',Math.round(Math.random()*30));	
	pubsub.publish('touch',Math.random()>0.5?1:0);	
	pubsub.publish('rotary',Math.round(Math.random()*360));	
	setTimeout(loop,1500);
	
	
	pubsub.subscribe('buzzer',function(msg){
		detectStateChange('buzzer',msg);
	});
	pubsub.subscribe('led',function(msg){
		detectStateChange('led',msg);
	});
	pubsub.subscribe('relay',function(msg){
		detectStateChange('relay',msg);
	});	
}
loop();







