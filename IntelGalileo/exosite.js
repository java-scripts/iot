/*

*/
var querystring = require('querystring');
var request = require('request');
var baseURL = 'http://m2.exosite.com/onep:v1/stack/alias?';

function readwrite(options){
	var formData = querystring.stringify(options.write||{});
	var contentLength = formData.length;	
	var uri = baseURL+(options.read||[]).join("&");	
	request({
		headers: {
		  'Content-Length': contentLength,
		  'Content-Type': 'application/x-www-form-urlencoded',
		  'X-Exosite-CIK': options.CIK,
		  'Accept': 'application/x-www-form-urlencoded; charset=utf-8'
		},
		uri: uri,
		body: formData,
		method: 'POST'
	  }, function (err, res, body) {		
		if(err){			
			(options.error||emptyFn)(err);
		}else{			
			(options.success||emptyFn)(body?urlparamsToObject(body):undefined);
		}
	  });
}  

function read(options){options.read=options.data;readwrite(options);}
function write(options){options.write=options.data;	readwrite(options);}
function urlparamsToObject(urlparams){var data={};urlparams.split('&').forEach(function(v){var k=v.split("=");data[k[0]]=k[1];});return data;}
function emptyFn(data){}  
var exosite = {read:read, write:write, request:readwrite};
module.exports = exosite;

/*
usage................
var exosite = require('./exosite');
exosite.read({CIK:CIK, data:['pressure','assetswitch'],	success:function(data){},error:function(){}});
exosite.write({CIK:CIK,	data:{temperature:22,pressure:100},	success:function(){},error:function(){}});
exosite.post({CIK:CIK, write:{temperature:22,pressure:100},	read:['pressure','assetswitch'],success:function(data){},error:function(err){}});	
*/