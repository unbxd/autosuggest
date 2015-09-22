/*
Plugin for unbxd autosuggest, which shows recent searhes on focus of input.
Searched terms wil be pushed to local storage, and showed wehn user focuses on input
usage  - jQuery(element).recentSearch( autoSuggest ); , where autoSuggest is the refernce to our autosuggest instance
*/


(function($){
	"use strict"
	//wrapper for localStorage to save json objects and fetch
	var LocalStorageAPI = function( config, autoSuggest){
		return {
		 	key : "unbxdRecebtSearches",
		 	
		 	//flag for rendered widget and data in local storage are same, so we dont fetch again
		 	isDirty : true,		

		    //check if local storage supported by browser
		    isSupported: function() {
		        return window.localStorage;
		    },

		    push: function(  obj ) {
		    	if(!obj || !obj.value || !this.isSupported() || obj.type === config.suggestionTypes.popularProducts )
		    		return;

		    	if(obj.type === config.suggestionTypes.inFields && obj.filtervalue ){
		    		obj.recentSearch = obj.value +" in "+ obj.filtervalue;
		    	}else{
		    		obj.recentSearch = obj.value;
		    	}
				
				//if there is original unbxd obj, set that to _original
		    	if(obj.type !== config.suggestionTypes.simpleQuery && jQuery.isEmptyObject(autoSuggest.currentResults) === false){
		    		obj._original = autoSuggest.currentResults[obj.type][parseInt(obj['index'])]._original;
		    	}else{
		    		obj._original = obj._original || null;
		    	}
		    		

		    	var recentSearches = this.get() || [];
		 		recentSearches.unshift(obj);

		    	for(var k=1; k<recentSearches.length; k++){
		    		if(recentSearches[k].recentSearch === obj.recentSearch )
		    			recentSearches.splice(k,1);
		    	};

		    	if(recentSearches.length > config.maxItems)
		    		recentSearches.length = config.maxItems;
		    	this.isDirty = true;
		        localStorage.setItem( this.key, JSON.stringify(recentSearches));
		    },

		    //get all recent searches stored
		    get: function() {
		    	if(!this.isSupported())
		    		return;
		    	this.isDirty = false;
		    	var value = localStorage.getItem( this.key );
		    	if(value && JSON.parse(value).length > 0){
		    		value = JSON.parse(value);
		    		//if there is more data than maxitems
		    		value.length > config.maxItems ? value.length = config.maxItems : value;
		    		return value;
		    	}
		    		
	    		return false; 
		    },

		    //get data for single recent search selected
		    getByKey:function( recentSearch ){
		    	if(!this.isSupported())
		    		return;

		    	var values = localStorage.getItem( this.key );
		    	if( values )
	    			values = JSON.parse(values);
	    		for(var k=0; k< values.length; k++){
	    			if(values[k].recentSearch === recentSearch)
	    				return values[k];
	    		}
	    		return false;
		    },

		    //return true if data present
		    data:function() {
		    	if(!this.isSupported())
		    		return false;

		    	var value = localStorage.getItem( this.key );
	    		return value && JSON.parse(value).length;
		    },

		    clearAll: function() {
		    	this.isDirty = true;
		        localStorage.clear();
		    }
		};
	};


	$.fn.recentSearch = function( autoSuggest ){
		//here "this" refers to the input box we are binding
		var defaultConfigs = {
			maxItems:5,
			heading  : "RECENT SEARCHES",
			clearMsg : "clear",
			classes  : {
				suggestion: "unbxd-as-keysuggestion", //class for LI
				active: autoSuggest.selectedClass, //active LI
				resultsClass:"unbxd-as-wrapper", //widget class
				containerClass:"unbxd-as-maincontent",//class for UL
				widgetClass : "unbxd-as-rs", // a class for widget to distinguish it from actual autosuggest
				headerClass : "unbxd-as-header",
				clearClass : "unbxd-rs-clear"
			},
			suggestionTypes:{
		 		popularProducts:"POPULAR_PRODUCTS",
		 		inFields:"IN_FIELD",
		 		simpleQuery:"SIMPLE_QUERY"
		 	}
		};

		var config = $.extend({}, defaultConfigs, autoSuggest.options.recentSearchConfig );

		var KEY = {
			UP: 38,
			DOWN: 40,
			RETURN: 13,
			ESC: 27
		};

		var widget,
			ulElement,
			$input = autoSuggest.$input, // this = the elemet library binding to
			localStorageAPI = LocalStorageAPI(config, autoSuggest );


		//show widget on click or focus or keyup of on input
		$input.on("click focus keyup", function( event ){
			if( inputValue() === true || !localStorageAPI.data() || isWidgetActive() )
				return;

			if(localStorageAPI.isDirty){
				var recentSearches = localStorageAPI.get();
				if(!recentSearches || !recentSearches.length)
					return;
				render(recentSearches);
			}
			showWidget();
		});

		//on enter on input push the term to storage
		$input.on("keydown", function( event ){
			if(event.keyCode === KEY.RETURN ){
				getData( event );
			}
		});

		//hide on blur
		$input.blur(function(){
			hideWidget();
		});

		//hide when clicked outside
		$(document).click(function( event ){
			if( $(event.target).is($input) === true || $(event.target).parents("."+config.classes.resultsClass).length > 0 )
				return;

			hideWidget();
		});

        //on click of any typeahead suggestion push that to storage
        $( "div."+config.classes.resultsClass ).on("click", "ul."+config.classes.containerClass+" li", function( event ){
        	getData( event );
        });

        //handle form submit if there is one, and if widget is active return false
        if( $input.parents("form") && $input.parents("form").length > 0 ){
			 $input.parents("form").submit(function( event ){
	        	//ie hack
	        	if( $.browser.msie || navigator.userAgent.indexOf("Trident") > 0 ){
	        		onSelect();
	        	}
	        	if( config.formDisabled === true ){
	        		event.preventDefault();
	        	};
        	});
		};
       

		// only opera doesn't trigger keydown multiple times while pressed, others don't work with keypress at all
		$input.on("keyup", function(event) {

			if(isWidgetVisible() === false)
				return;
			switch(event.keyCode) {

				case KEY.UP:
					moveSelect(-1);
					break;

				case KEY.DOWN:
					moveSelect(1);
					break;

				case KEY.RETURN:
					onSelect();
					break;

				case KEY.ESC:
					hideWidget();
					break;

				default:
					if( inputValue() === true )
						hideWidget();
					break;
			}
		});

	(function init() {
        widget = $("<div/>")
				.hide()
				.addClass( config.classes.resultsClass )
				.addClass( config.classes.widgetClass )
				.css({"position":"absolute","font-weight":"normal"})
				.insertAfter( $input );

		ulElement = $("<ul/>")
			.addClass( config.classes.containerClass )
			.html('<li class="'+config.classes.headerClass+'">'+ config.heading +'<span class="'+config.classes.clearClass+'">'+config.clearMsg+'</span></div>')
			.appendTo(widget);

		//handle click on recent searches
		ulElement.mouseover( function(event) {
			if(getLiNode(event).nodeName && getLiNode(event).nodeName.toUpperCase() == 'LI') {
				ulElement.find('li.'+config.classes.active).removeClass(config.classes.active);
			    $(getLiNode(event)).addClass(config.classes.active);
	        }
		}).mouseout(function(){
			ulElement.find("li").removeClass( config.classes.active );
		}).click(function( event ){
			if( getLiNode(event) )
				onSelect( event );
		}).mousedown(function() {
			config.mouseDownOnSelect = true;
		}).mouseup(function() {
			config.mouseDownOnSelect = false;
		});

		//handle click on headers
		widget.find("li."+ config.classes.headerClass ).mousedown(function( event ){
			if( $(event.target).hasClass( config.classes.clearClass ) ){
				config.mouseDownOnSelect = false;
				localStorageAPI.clearAll();
				hideWidget()
			}else{
				config.mouseDownOnSelect = true;
			}
		}).mouseup(function() {
			config.mouseDownOnSelect = false;
		});

	})();

	//get data from dom and push to local storage
	function getData( event ){
		if( isWidgetVisible() === true ){
			return false;
		};

		var li = getLiNode(event),
			data = {};

		if(li){
			data = $(li).data();
		}else if( autoSuggest.$results.find('li.'+autoSuggest.selectedClass).length > 0 ){
			li = autoSuggest.$results.find('li.'+autoSuggest.selectedClass);
			data = $(li).data();
		}else if( $input.val().trim().length > 0 ){
			data.value = $input.val().trim();
			data.type = config.suggestionTypes.simpleQuery;
		}

		localStorageAPI.push(data);
	};

	function showWidget(){

			if( config.width ){
				config.mainWidth = config.width;
			}
			var pos = $input.offset()
				,iWidth = (config.mainWidth > 0) ? config.mainWidth : $input.innerWidth()
				,bt = parseInt($input.css("border-top-width"),10)
				,bl = parseInt($input.css("border-left-width"),10)
				,br = parseInt($input.css("border-right-width"),10)
				,fwidth = (parseInt(iWidth)-2+bl+br)
				,fpos = {top : pos.top + bt + $input.innerHeight() + 'px', left: pos.left + "px"};
			
			widget.find("ul").css("width", fwidth+"px");
			widget.css(fpos).show();
			config.formDisabled = true;
	};

	function hideWidget(){
		if(!config.mouseDownOnSelect){
			ulElement && ulElement.find("li").removeClass(config.classes.active);
			widget && widget.hide();
			config.formDisabled = false;
		}
	};

	function isWidgetVisible(){
		if(widget && widget.is(":visible") )
			return true;

		return false;
	};

	//returns true if recent search widget active and any item is slected
	function isWidgetActive(){
		if(widget && widget.is(":visible") && ulElement.find("li."+config.classes.active))
			return true;

		return false;
	};

	//returns true if input has a value
	function inputValue(){
		var inputValue = $input.val()  && $input.val().trim();
		return inputValue.length > 0;
	};

	function render( data, container) {
		ulElement.find("li").not("."+config.classes.headerClass).remove();
		for (var i=0; i < data.length; i++) {
			var dataObj = data[i],
				li = $("<li/>").html( dataObj.recentSearch ).addClass( config.classes.suggestion );

			li.attr("data-recentSearch", dataObj.recentSearch);
			ulElement.append(li);
		}
	};

	//return parent LI node
	function getLiNode(event) {
		if( !event )
			return false;
		var element = event.target;
		while(element && element.tagName != "LI")
			element = element.parentNode;
		// hack for IE, sometimes event.target is empty, just ignore it then
		//OR if the target is header
		if(!element || $(element).hasClass(config.classes.headerClass))
			return false;
		return element;
	};

	//on up/down arrow select recent searches
	function moveSelect(step) {
		var listItems,
			activeElemnet,
			nextElement,
			index;

		listItems = widget.find("li." + config.classes.suggestion);
		activeElemnet = listItems.filter("." + config.classes.active)[0];
		if(activeElemnet){
			$(activeElemnet).removeClass(config.classes.active);
			index = listItems.index(activeElemnet) + step;
			if(index < listItems.length && index >= 0)
				nextElement = listItems[index];
			else if(index < 0 )
				nextElement = listItems.last();
			else if(index >= listItems.length)
				nextElement = listItems.first();
		}else{
			if(step < 0 )
				nextElement = listItems.last();
			else
				nextElement = listItems.first();
		}

		//populating input with vlue triggers the typeahead
		$input.val( $(nextElement).attr("data-recentsearch") );
		listItems.removeClass( config.classes.active )
		$(nextElement).addClass( config.classes.active );
    };

    //on select of a recent search
    function onSelect( event ){
    	if( isWidgetActive() ){
    		var selected = ulElement.find("li."+config.classes.active),
    			recentSearch = selected.data().recentsearch,
    			e = $.Event("keydown", {which:KEY.RETURN}),
    			data = localStorageAPI.getByKey( recentSearch );

    		$input.val( recentSearch );

    		//push again so it goes to top of recent searches
    		localStorageAPI.push( data );

    		if(data.type === config.suggestionTypes.simpleQuery){ //for simple query set input val and trigger enter
    			$input.val(data.recentSearch).trigger(e);
    		}else{ // for sugestion from auto suggest, call the callback defined
    			autoSuggest.options.onItemSelect.call(autoSuggest, data, data._original );
    		}
    	}
    };

};//end

})(jQuery);

