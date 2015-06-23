hljs.initHighlightingOnLoad();
var ractive = new Ractive({
	el: 'container',
	template: '#template',
	data: {
		
      	themes: [
            { id: '#ff8400', name: 'Orange' },
            { id: '#19af91', name: 'Green' },
            { id: '#6f6f6f', name: 'Gray' },
            { id: '#004c92', name: 'Blue' }
            ],
        config: [
           	{ id: '0', name: 'None' },
            { id: '1', name: 'config-1' },
            { id: '2', name: 'config-2' },
            { id: '3', name: 'config-3' },
            { id: '4', name: 'config-4' }
            ],
        mainfields: [
        	{ id: 'inFields', name: 'inFields' },
        	{ id: 'topQueries', name: 'topQueries' },
        	{ id: 'popularProducts', name: 'popularProducts' },
        	{ id: 'keywordSuggestions', name: 'keywordSuggestions'}
        	],
        sidefields: [
        	{ id: 'inFields', name: 'inFields' },
        	{ id: 'topQueries', name: 'topQueries' },
        	{ id: 'popularProducts', name: 'popularProducts' },
        	{ id: 'keywordSuggestions', name: 'keywordSuggestions'}
        	]
         }
    });

	Ractive.decorators.chosen.type.demo = {
    	width: '25%',
	};

	// $(function(){
		unbxdAutoSuggestFunction($, Handlebars);

		window.auto = $("#input").unbxdautocomplete({
			siteName : 'demosite-u1407617955968'
			,APIKey : '64a4a2592a648ac8415e13c561e44991'
			,inputID : '#input'
			,minChars : 2
			,showCarts : false
			,template : "1column" // "2column"
			,cartType : "separate"
			// ,noResultConfigMsg: 'No Results were Found'
			,onItemSelect : function(){
				console.log("onItemSelect",arguments);
			}
			,onCartClick : function(obj){
				console.log("addtocart",this, arguments);
				return true;
			}
			,noResultTpl: function(query){
				return 'No results found for '+ query;
			}
			,inFields:{
				count: 2,
				fields:{
					'brand':3
					,'category':3
					,'color':3
				}
				,header:''
			},
			topQueries:{
				count: 2
				,header:''
			},
			
			keywordSuggestions:{
				count: 2
				,header:''
			}
			,popularProducts:{
				count: 2
				,price:true
				,priceFunctionOrKey : "price"
				,image:true
				,imageUrlOrFunction: "imageUrl"
				,currency : "Rs."
				,header:''
			}
		});
		ractive.set('selectedmain', ['inFields','keywordSuggestions','topQueries','popularProducts']);
		$('#MainTpl').trigger('liszt:updated');


		ractive.observe( 'maxSuggestions', function ( newValue, oldValue, keypath ) {
			if(newValue||oldValue){
				auto[0].auto.setOption("maxSuggestions", isNaN(newValue)?0:parseInt(newValue));
			}
		});
		/*counts start*/
		ractive.observe( 'keycount', function ( newValue, oldValue, keypath ) {
			if(newValue||oldValue){
				auto[0].auto.setOption("keywordSuggestions.count", isNaN(newValue)?0:parseInt(newValue));
			}
		});
		ractive.observe( 'topcount', function ( newValue, oldValue, keypath ) {
			if(newValue||oldValue){
				auto[0].auto.setOption("topQueries.count", isNaN(newValue)?0:parseInt(newValue));
			}
		});
		ractive.observe( 'incount', function ( newValue, oldValue, keypath ) {
			if(newValue||oldValue){
				auto[0].auto.setOption("inFields.count", isNaN(newValue)?0:parseInt(newValue));
			}
		});
		ractive.observe( 'prodcount', function ( newValue, oldValue, keypath ) {
			if(newValue||oldValue){
				auto[0].auto.setOption("popularProducts.count", isNaN(newValue)?0:parseInt(newValue));
			}
		});
		/*counts end*/

		
		/*header starts*/
		ractive.observe( 'keyheader', function ( newValue, oldValue, keypath ) {
			if(newValue||oldValue){
				auto[0].auto.setOption("keywordSuggestions.header", newValue);
			}
		});
		ractive.observe( 'topheader', function ( newValue, oldValue, keypath ) {
			if(newValue||oldValue){
				auto[0].auto.setOption("topQueries.header", newValue);
			}
		});
		ractive.observe( 'inheader', function ( newValue, oldValue, keypath ) {
			if(newValue||oldValue){
				auto[0].auto.setOption("inFields.header", newValue);
			}
		});
		ractive.observe( 'prodheader', function ( newValue, oldValue, keypath ) {
			if(newValue||oldValue){
				auto[0].auto.setOption("popularProducts.header", newValue);
			}
		});
		/*header ends*/

		ractive.observe( 'widthMain', function ( newValue, oldValue, keypath ) {
			if(newValue||oldValue){
				auto[0].auto.setOption("mainWidth", isNaN(newValue)?0:parseInt(newValue));
			}
		});
		ractive.observe( 'widthSide', function ( newValue, oldValue, keypath ) {
			if(newValue||oldValue){
				auto[0].auto.setOption("sideWidth", isNaN(newValue)?0:parseInt(newValue));
			}
		});
		ractive.observe( 'siteName', function ( newValue, oldValue, keypath ) {
			if(newValue||oldValue){
				auto[0].auto.setOption("siteName", newValue);
			}
		});
		ractive.observe( 'APIKey', function ( newValue, oldValue, keypath ) {
			if(newValue||oldValue){
				auto[0].auto.setOption("APIKey", newValue);
			}
		});
		ractive.observe( 'inputID', function ( newValue, oldValue, keypath ) {
			if(newValue||oldValue){
				auto[0].auto.setOption("inputID", '#'+newValue);
			}
		});
		ractive.observe( 'on', function ( newValue, oldValue, keypath ) {
			if(newValue||oldValue){
				auto[0].auto.setOption("showCarts",newValue);
			}
		});
		ractive.observe( 'cartType', function ( newValue, oldValue, keypath ) {
			if(newValue||oldValue){
				auto[0].auto.setOption("cartType", newValue);
			}
		});
		ractive.observe( 'sideContent', function ( newValue, oldValue, keypath ) {
			if(newValue||oldValue){
				auto[0].auto.setOption("sideContentOn", newValue);
			}
		});
		ractive.observe( 'template', function ( newValue, oldValue, keypath ) {
			if(newValue||oldValue){
				auto[0].auto.setOption("template", newValue);
			}
		});
		ractive.observe( 'selectedTheme', function ( newValue, oldValue, keypath ) {
			if(newValue||oldValue){
				auto[0].auto.setOption("theme", newValue);
			}
		});
		ractive.observe( 'selectedconfig', function ( newValue, oldValue, keypath ) {
			if(oldValue){
					if(newValue === "0"){
					$("#MainTpl, #SideTpl, .content").prop("disabled",false);
					$('#MainTpl,#SideTpl').trigger('chosen:updated');
					ractive.set('selectedmain', []);
					ractive.set('selectedside', []);
					values=[];
					$("#MainTpl option").each(function(){
    					$(this).attr('disabled',false);
    					$('#MainTpl').trigger('chosen:updated');
					});
					$('#SideTpl :selected').each(function(i, selectedElement) {
 						values[i] = $(selectedElement).val();
 						$("#MainTpl option[value='"+ values[i] + "']").attr('disabled', true );
 						$('#MainTpl').trigger('chosen:updated');
					});
					$("#SideTpl option").each(function(){
    					$(this).attr('disabled',false);
    					$('#SideTpl').trigger('chosen:updated');
					});
					$('#MainTpl :selected').each(function(i, selectedElement) {
 						values[i] = $(selectedElement).val();
 						$("#SideTpl option[value='"+ values[i] + "']").attr('disabled', true ); 
 						$('#SideTpl').trigger('chosen:updated');
					});
				}
				else{
					$("#MainTpl, #SideTpl, .content").prop("disabled",true);
					$('#MainTpl, #SideTpl').trigger('chosen:updated');
					if(newValue === "1"){
						ractive.set('selectedside', []);
						$('#SideTpl').trigger('liszt:updated');
						ractive.set('selectedmain', ['inFields','keywordSuggestions','topQueries','popularProducts']);
						$('#MainTpl').trigger('liszt:updated');
						ractive.set('template', '1column');
						ractive.set('on',true);
						$('#MainTpl,#SideTpl').trigger('chosen:updated');
					}
					else if(newValue === "2"){
						ractive.set('selectedmain', ['inFields','popularProducts']);
						$('#MainTpl').trigger('liszt:updated');
						ractive.set('selectedside', ['topQueries','keywordSuggestions']);
						$('#SideTpl').trigger('liszt:updated');
						ractive.set('template','2column');
						ractive.set('sideContent', 'right');
						ractive.set('on',true);
					}
					else if(newValue === "3"){
						ractive.set('selectedmain', ['inFields','popularProducts']);
						$('#MainTpl').trigger('liszt:updated');
						ractive.set('selectedside', ['topQueries','keywordSuggestions']);
						$('#SideTpl').trigger('liszt:updated');
						ractive.set('template','2column');
						ractive.set('sideContent', 'left');
						ractive.set('on',true);
					}
					else if(newValue === "4"){
						ractive.set('selectedmain', ['popularProducts']);
						$('#MainTpl').trigger('liszt:updated');
						ractive.set('template', '1column');
						ractive.set('selectedside', []);
						$('#SideTpl').trigger('liszt:updated');
						ractive.set('on',true);
					}
				}
			}

		});
		var values=[];
		ractive.observe( 'selectedmain', function ( newValue, oldValue, keypath ) {
			//if(oldValue){
				auto[0].auto.setOption("mainTpl", newValue);
				values=[];
				$("#SideTpl option").each(function(){
    				$(this).attr('disabled',false);
    				$('#SideTpl').trigger('liszt:updated');

				});
				$('#MainTpl :selected').each(function(i, selectedElement) {
 					values[i] = $(selectedElement).val();
 					$("#SideTpl option[value='"+ values[i] + "']").attr('disabled', true ); 
 					$('#SideTpl').trigger('liszt:updated');
				});
		
			//}
		});

		ractive.observe( 'selectedside', function ( newValue, oldValue, keypath ) {

			if(oldValue){
				auto[0].auto.setOption("sideTpl", newValue);
				values=[];
				$("#MainTpl option").each(function(){
    				$(this).attr('disabled',false);
    				$('#MainTpl').trigger('liszt:updated');
				});
				$('#SideTpl :selected').each(function(i, selectedElement) {
 					values[i] = $(selectedElement).val();
 					$("#MainTpl option[value='"+ values[i] + "']").attr('disabled', true);
 					$('#MainTpl').trigger('liszt:updated');
				});
				
 				
			}
		});
	
		$('button#copy-description').zclip({
        	path:'bower_components/jquery-zclip/ZeroClipboard.swf',
        	copy:function(){return $('code#description').text();}
   		});

    	$('button#copy-description').click(function(){        
            $('button#copy-description').html('copied!!');
            setTimeout(function(){$('button#copy-description').html('copy to clipboard')},2000);
        });
		
		ractive.observe( 'keycount topcount incount prodcount inheader keyheader topheader prodheader widthMain widthSide siteName APIKey on cartType sideContent template selectedTheme selectedmain selectedside selectedconfig inputID maxSuggestions', function ( newValue, oldValue, keypath ) {
			var jscode = JSON.stringify(auto[0].auto.options, replace, "\t");
			jscode = jscode.replace(/\"function/g,"function");
			jscode = jscode.replace(/\}\"/g,"}");
			jscode = jscode.replace(/\\n/g,"\n");
			jscode = jscode.replace(/\\t/g,"\t");
			jscode = jscode.replace(/\\"/g,"\"");
			jscode = jscode.replace(/\n/g,"\n\t");
			jscode = '<link rel="stylesheet" href="//d21gpk1vhmjuf5.cloudfront.net/jquery-unbxdautosuggest.css">\n<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/handlebars.js/2.0.0/handlebars.min.js"></script>\n<script src="//code.jquery.com/jquery-1.10.2.js"></script>\n<script src="//d21gpk1vhmjuf5.cloudfront.net/jquery-unbxdautosuggest.js"></script>\n<script type = "text/javascript">\n\tunbxdAutoSuggestFunction(jQuery, Handlebars);\n\tvar config = '+jscode+';\n\tjQuery(function(){\n\t\tjQuery("'+auto[0].auto.options.inputID+'").unbxdautocomplete(config);\n\t});\n</script>';
			ractive.set('content',jscode);

			$('button#copy-description').zclip({
        		path:'bower_components/jquery-zclip/ZeroClipboard.swf',
        		copy:function(){return $('code#description').text();}
   			});

   			$('button#pastebin').attr('disabled',false);
   			$('span#pastebinUrl').css('display','none');
   			$('span#pastebinError').css('display','none');
		});
		
	// });
		$('#pastebin').click(function(){
		$.ajax({
  			type: "POST",
  			url: "http://localhost:6969/pastebin",
			data: {
				        api_dev_key: "bcf3b3bb55e73dd16bb85ce9cf49c356",
				        api_paste_code: $("#description").text(),
				        api_option: 'paste',
				        api_user_key: 'ae94f6aec0311259030bef6502f8a13e',
				        api_paste_expire_date: '1M'
				    },
  			success: function(data){
  				ractive.set('pastebinUrl',data);
  				$('button#pastebin').attr('disabled',true);
  				$('span#pastebinUrl').css('display','inline');
  			}
		});

		});

	function replace(key, value){
      	if (value instanceof Function || typeof value == 'function') {
        	return value.toString();
      	}
      	if (value instanceof RegExp) {
       		return '_PxEgEr_' + value;
      	}
      	return value;
    }
	