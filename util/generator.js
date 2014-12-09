var fs = require('fs');
var UglifyJS = require("uglify-js");

/**
 * It generated the JS file to be given to the user
 */
var Generator = function(){

	var autoSuggest = fs.readFileSync(UTILS_DIR + '../unbxdAutosuggest.js');
	
	this.autoSuggestCode = function(sitename, skip_minify){
		var sourceCode = '';
		
		if(sitename && sitename != ''){
			sourceCode = fs.readFileSync(CLIENTS_DIR + sitename + '.js');
		}else{
			sourceCode = autoSuggest;
		}
		
		sourceCode = sourceCode.toString();
		
		//uglify the code
		var final_code = UglifyJS.minify(sourceCode, {
			fromString : true
		});

		
		if(skip_minify){
			console.log("Skip Minify : " + skip_minify);
			return sourceCode;
		}else{
			return final_code.code;
		}
	};

	
};

module.exports = new Generator();