// FILE TO PUSH autoSuggest.js or client specific autoSuggest file to cdn
var __dirname = __dirname + "/"
var constants = require(__dirname + 'constants');
var fs = require('fs');
var zlib = require('zlib');
var AWS = require('aws-sdk');
var generator = require(UTILS_DIR + 'generator');
var Bus = require(UTILS_DIR + 'bus');

var S3Impl = function(){
	AWS.config.update({accessKeyId: CONFIG['aws.key'], secretAccessKey: CONFIG['aws.secret']});
	var s3 = new AWS.S3();
	
	this.uploadFile = function(fileName, code){
		var bus = new Bus();
		
		bus.on('start', function(){
			zlib.gzip(code, function (_, result) {  // The callback will give you the 
				bus.fire('onZip', result);
		    });
		});
		
		bus.on('onZip', function(data){
			console.log("zipped");
			var params = {	
				Bucket: CONFIG['aws.bucket'], 
				Key: fileName, 
				Body: data,
				ACL : 'public-read',
				CacheControl : "max-age=36",
				ContentType : "application/javascript",
				ContentEncoding : "gzip"
			};
			
			s3.putObject(params, function(err, data) {
				if (err)
					console.log(err);
				else
					console.log("Successfully uploaded data with name : " + params.Key);
			});
			
		});
		
		bus.fire('start');
	}
	
	this.uploadAutosuggest = function(sitename, skip_minify){
		var code = generator.autoSuggestCode(sitename, skip_minify);
		var fileName = (sitename ? sitename + "-" : '') + 'unbxdAutosuggest.js';
		this.uploadFile(fileName, code);
	}

}

var sitename = null;
var skip_minify = false;
if(process.argv && process.argv.length > 2){
	var arguments = process.argv.splice(2);
	sitename = arguments[0];
	skip_minify = arguments[1];

	console.log("sitename", sitename);
	console.log("skip_minify", skip_minify);
}

new S3Impl().uploadAutosuggest(sitename, skip_minify);
