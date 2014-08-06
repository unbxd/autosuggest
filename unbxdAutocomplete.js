

var unbxdAutocomplete = (function () {

	var _CONST = {

		inFields:{
			count: 1,
			fields:[
				{
					name:'brand',
					count:3
				},
				{
					name:'category',
					count:3
				}
			]
		},

		topQueries:{
			count: 3
		},

		keywordSuggestions:{
			count: 3
		},

		popularProducts:{
			count: 3,
			title:true,
			price:true,
			priceFunction:false,
			currency:'$',
			image:true,
			imageUrl:'imageUrl',
			productUrl:'productUrl'
		},

		callbackfunction:function(){}, //will be called on select

		inCat:['brand_in', 'category_in'],
		
		autoCompltListClass : "unbxd-autocomplete-list-ul",
		
		autoCompltHintClass : "unbxd-autocomplete-list-li",

		unbxdCatageryClass: "unbxd-autocomplete-category",
		
		autoCompltHintSelectedClass : "unbxd-autoComplt-hint-selected",

		unbxdProductClass:"unbxd-prouct-suggest",

		unbxdShowProductImg:true,

		unbxdShowProductName:true,

		unbxdShowProductPrice:true,

		unbxdSelectorClass:'_unbxd-hint',

		callSearch: false,

		formSubmit : false,

		catageries:['brand_in', 'category_in'],

		type:"productname",

		productDetails:true,

		searchUrl:'',

		jsonpCallback:'?json.wrf=unbxdAutocomplete.parseResponse',

		rows:20,
		
		autoCompltDelay : 0.1, // in ms
		
		listStatus : {
			attr : "data-listStatus",
			open : "open",
		},
		
		keyCode : {
			up : 38,
			down : 40,
			esc : 27,
			enter : 13
		},

		widgetWidth:null,

		widgetLeft:null,

		widgetTop:null,

		widgetMaxheight:400,

		widgetBackground:'white',

		hintHeight:null,

		imgClass :'product-imageas',

		prodName:'product-nameas',
	
		
		defaultStyles : {
		    //STYLES FOR WIDGET
			autoCompltList : {
				maxHeight : "400px",
				border : "1px solid rgb(170, 170, 170)",
				padding : "0",
				margin: "0",
				overflowX : "hidden",
				overflowY : "auto",
				display : "none",
				position: "absolute",
				backgroundColor : "#FFF",
				width:'',
				top:'',
				left:''
			},
			//STYLES FOR EACH ROW INSIDE WIDGET
			autoCompltHint : {
				height : "22px",
				padding: "0 2px 0 5px",
				margin: "0",
				overflow: "auto",
				listStyleType: "none",
				color : "#ffff",
				cursor : "default",
				fontSize : "14px"
			},
			//STYLES FOR SELECTED ROW ( MOUSE OVER )
			autoCompltHintSelected : {
				// color : "none",
				// backgroundColor : "#f2f2f2"
			}
		},
		
		adjStyleAttrs : {
			autoCompltList : [ "border", "maxHeight", "backgroundColor" ],
			autoCompltHint : [ "height", "padding", "margin", "color", "backgroundColor", "fontSize" ],
			autoCompltHintSelected : [ "color", "backgroundColor" ]
		}
};


function myAjax(openCallback) {
		var xmlHttp = new XMLHttpRequest();
		var url=_CONST.searchUrl
		var parameters = "first=barack&last=obama";
		xmlHttp.open("GET", url, true);

		//Black magic paragraph
		xmlHttp.setRequestHeader("Content-type", "application/json");
		xmlHttp.setRequestHeader("Content-length", parameters.length);
		xmlHttp.setRequestHeader("Connection", "close");

		xmlHttp.onreadystatechange = function() {
			if(xmlHttp.readyState == 4 && xmlHttp.status == 200) {
				
				response = JSON.parse(xmlHttp.responseText);
				var buckets = response.buckets,
					types = ['brand', 'category', 'product'],
					result = [];

				for(var k=0; k<types.length; k++){
					if( buckets[types[k]] ){
						var temp = buckets[types[k]].products,
						    arr = [];

						for(var j=0; j<temp.length; j++){
							var obj = {"name":temp[j].autosuggest };

							if(types[k] == 'product'){
								obj.imgUrl = temp[j].image_url;
								obj.price = temp[j].price;
							}
							arr.push( obj );
						}


						var v = {}
    					v[types[k]] = arr;
					    result.push( v );
					}
				}
				
				openCallback(result)
				//return xmlHttp.responseText;
			}
		}

		xmlHttp.send(parameters);
 };

	var _DBG = 0; 
	
	
	var _normalizeEvt = function (e) {					
		// e = e || window.event;
		// e.target = e.target || e.srcElement;
		// e.stopBubble = function () {
		// 	this.cancelBubble = true;
		// 	if (this.stopPropoagation) {
		// 	 this.stopPropoagation(); 
		// 	}
		// }
		// e.stopDefault = function () {
		// 	if (this.preventDefault) { 
		// 		this.preventDefault(); }
		// 	this.returnValue = false;
		// 	return false;
		// }
		return e;
	}
	
	var _addEvt = function (elem, evt, eHandle) {
		if (elem.addEventListener) {
			elem.addEventListener(evt, eHandle);
		} else if (elem.attachEvent) { // The IE 8 case
			elem.attachEvent("on" + evt, eHandle);
		}
	}
	/*	Arg: Refer to _addEvt
	*/
	var _rmEvent = function (elem, evt, eHandle) {
		if (elem.removeEventListener) {
			elem.removeEventListener(evt, eHandle);
		} else if (elem.detachEvent) { // The IE 8 case
			elem.detachEvent("on" + evt, eHandle);
		}
	}
	
	var _getComputedStyle = function (elem, name) {
		var v = null;
		
		if (window.getComputedStyle) {
			
			v = window.getComputedStyle(elem)[name] || null;
			
		} else if (elem.currentStyle) { // Hack for IE...Reference from the jQuery
			
			v = elem.currentStyle && elem.currentStyle[name]
			
			var left,
				rsLeft,
				style = elem.style;

			// Avoid setting v to empty string here
			// so we don't default to auto
			if ( v == null && style && style[name] ) {
				v = style[ name ];
			}

		
			// Remember the original values
			left = style.left;
			rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				elem.runtimeStyle.left = elem.currentStyle.left;
			}
			//style.left = name === "fontSize" ? "1em" : v;
			v = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				elem.runtimeStyle.left = rsLeft;
			}
			
		}
		
		return v;
	}
	
	var _ui = {
		
		buildElem : function (html) {
			var div = document.createElement("DIV");
			div.innerHTML = html;
			return div.firstChild.cloneNode(true);
		},
		
		buildHint : function (hint, styles) {
			if ( hint) {

				var value = hint.name,
				    reg = new RegExp(_CONST.inputText, 'gi'),
		
				hint = this.buildElem('<li value="'+value+'" class="' + _CONST.autoCompltHintClass + '">' + hint.name + '</li>');
				hint.innerHTML = hint.innerHTML.replace(reg, function(str) {
				    	return '<em>'+str+'</em>'
				    });

                if( _CONST.hintHeight )
                	hint.style.height = _CONST.hintHeight +'px';

                hint.style.height = hint.style.lineHeight = styles.autoCompltHint.height; // line-height shall always be equal to the height
				hint.style.padding = styles.autoCompltHint.padding;
				hint.style.margin = styles.autoCompltHint.margin;
				hint.style.overflow = styles.autoCompltHint.overflow;
				hint.style.listStyleType = styles.autoCompltHint.listStyleType;
				hint.style.color = styles.autoCompltHint.color;
				hint.style.backgroundColor = styles.autoCompltHint.backgroundColor;
				hint.style.cursor = styles.autoCompltHint.cursor;
				hint.style.fontSize = styles.autoCompltHint.fontSize;

				return hint;
			}
			return null;
		},

		buildCategory : function(hint, styles, value, key){
			if (hint) {
				var filter 	= hint,
					key 	= key,
				    hint 	= this.buildElem('<li value="'+value+'" filter="'+filter+'"  key="'+key+'" class="' + _CONST.autoCompltHintClass + '">&nbsp;&nbsp;&nbsp;&nbsp;in&nbsp; <span value="'+value+'" filter="'+filter+'"  key="'+key+'" class="' + _CONST.autoCompltHintClass + '">' + hint + '</span></li>');
				
				if( _CONST.hintHeight )
                	hint.style.height = _CONST.hintHeight +'px';

                hint.style.height = hint.style.lineHeight = styles.autoCompltHint.height; // line-height shall always be equal to the height
				hint.style.padding = styles.autoCompltHint.padding;
				hint.style.margin = styles.autoCompltHint.margin;
				hint.style.overflow = styles.autoCompltHint.overflow;
				hint.style.listStyleType = styles.autoCompltHint.listStyleType;
				hint.style.color = styles.autoCompltHint.color;
				hint.style.backgroundColor = styles.autoCompltHint.backgroundColor;
				hint.style.cursor = styles.autoCompltHint.cursor;
				hint.style.fontSize = styles.autoCompltHint.fontSize;

				return hint;
			}
			return null;
		},	

		buildProduct : function(hint){
			if (hint) {
				var value = hint.name,
				    reg = new RegExp(_CONST.inputText, 'gi');
		

				hint.name = hint.name.replace(reg, function(str) {
				    	return '<em>'+str+'</em>'
				    });
				
				if( hint.productUrl ){
					var hint = this.buildElem('<li isProduct="'+hint.productUrl+'" value="'+value+'" class="' + _CONST.autoCompltHintClass +" "+ _CONST.unbxdProductClass+'">'
				
				
				    +'<div isProduct="'+hint.productUrl+'" class="_unbxd-hint unbxd-product-suggest" value="'+value+'" >'
				         +'<div isProduct="'+hint.productUrl+'" value="'+value+'" class="' + _CONST.unbxdShowProductImg+' _unbxd-hint unbxd-product-img">'
				         	+ '<img isProduct="'+hint.productUrl+'" class="_unbxd-hint" value="'+value+'" src="'+hint.imgUrl+'">'
				         +'</div>'
				         +'<div isProduct="'+hint.productUrl+'" value="'+value+'" class="' + _CONST.unbxdShowProductName+' _unbxd-hint unbxd-product-name" >'
				             +hint.name
				         + '</div>'
				          +'<div isProduct="'+hint.productUrl+'" value="'+value+'" class="' + _CONST.unbxdShowProductPrice+' _unbxd-hint unbxd-product-price" >'
				             +hint.price
				         + '</div>'
				         +'<div isProduct="'+hint.productUrl+'" value="'+value+'" class="clearfix"></div>'
				    +'</div>'
				    + '</li>');
				}else{
					var hint = this.buildElem('<li value="'+value+'" class="' + _CONST.autoCompltHintClass +" "+ _CONST.unbxdProductClass+'">'
				
				
				    +'<div class="_unbxd-hint unbxd-product-suggest" value="'+value+'" >'
				         +'<div value="'+value+'" class="' + _CONST.unbxdShowProductImg+' _unbxd-hint unbxd-product-img">'
				         	+ '<img class="_unbxd-hint" value="'+value+'" src="'+hint.imgUrl+'">'
				         +'</div>'
				         +'<div value="'+value+'" class="' + _CONST.unbxdShowProductName+' _unbxd-hint unbxd-product-name" >'
				             +hint.name
				         + '</div>'
				          +'<div value="'+value+'" class="' + _CONST.unbxdShowProductPrice+' _unbxd-hint unbxd-product-price" >'
				             +hint.price
				         + '</div>'
				         +'<div value="'+value+'" class="clearfix"></div>'
				    +'</div>'
				    + '</li>');
				}
				
			

				return hint;
			}
			return null;
		},	
		//to give header like popular prducts, top queries
		buildHeader:function( headerValue ){

				var header = "";
		
				hint = this.buildElem('<li class="unbxd-header" ><span class="text">'+headerValue+'</span></li>');
		
				return hint;
			
		},			
		/*	Arg:
				<OBJ> styles = the obk holding the styles to set. Refer to _CONST.defaultStyles.autoCompltList for the required styles
			Return:
				@ OK: <ELM> the list ui elem
				@ NG: null
		*/
		buildList : function (styles) {
			var list = this.buildElem('<ul class="' + _CONST.autoCompltListClass + '"></ul>');

			list.style.maxHeight = styles.autoCompltList.maxHeight;
			list.style.border = styles.autoCompltList.border;	
			list.style.padding = styles.autoCompltList.padding;
			list.style.margin = styles.autoCompltList.margin;
			list.style.overflowX = styles.autoCompltList.overflowX;
			list.style.overflowY= styles.autoCompltList.overflowY;
			list.style.display = styles.autoCompltList.display;
			list.style.position = styles.autoCompltList.position;
			list.style.backgroundColor = styles.autoCompltList.backgroundColor;

			return list;
		}


	};
	
	var _AutoCompltList = function (assocInput) {

		this.uiElem = null;
		this.assocInput = assocInput;
		this.mouseOnList = false;
		this.pauseMouseoverSelection = false;
		this.pauseMouseoutDeselection = false;
		this.maxHintNum = _CONST.maxHintNum;
		this.styles = JSON.parse(JSON.stringify(_CONST.defaultStyles)); // Copy the default first

	}; 

	{


		/*
		*/
		_AutoCompltList.prototype.genList = function () {
			if (!this.uiElem) {
			
				var that = this;
				
				this.uiElem = _ui.buildList(this.styles);						
				
				// Make hint selected onmouseover
				_addEvt(this.uiElem, "mouseover", function (e) {
					e = _normalizeEvt(e);
					if (that.isHint(e.target)) {
						that.select(e.target);
						//that.autoScroll();
					}
				});
				
				// Make hint not selected onmouseout
				_addEvt(this.uiElem, "mouseout", function (e) {					
					e = _normalizeEvt(e);
					that.deselect();
				});
				
				// Prepare for the hint selection by clicking
				_addEvt(this.uiElem, "mousedown", function (e) {
					e = _normalizeEvt(e);	
					that.mouseOnList = true;						
					// One hack for FF.
					// Even call focus methos on the input's onblur event, however, still the input losese its focus.
					// As a result we have to set a timeout here
					setTimeout(function () {
						that.assocInput.focus();
					}, 50);
					if (that.isHint(e.target)) {
						that.select(e.target);
						that.assocInput.value = that.getSelected() ? that.getSelected().getAttribute("value") : e.target.parentNode.getAttribute("value");
						window.unbxdSelected = { val:that.assocInput.value, filterValue:e.target.getAttribute("filter"), filterName:e.target.getAttribute("key"), isProduct:e.target.getAttribute("isProduct") }; 
						that.assocInput.autoComplt.close();
						that.assocInput.autoComplt.unbxdSearch();
					}
				});				
				
				// Select hint by clicking
				_addEvt(this.uiElem, "mouseup", function (e) {
					e = _normalizeEvt(e);
					if (that.isHint(e.target)) {
						that.select(e.target);
						that.assocInput.value = that.getSelected() ? that.getSelected().getAttribute("value") : e.target.parentNode.getAttribute("value");
						window.unbxdSelected = { val:that.assocInput.value, filterValue:e.target.getAttribute("filter"), filterName:e.target.getAttribute("key"),  isProduct:e.target.getAttribute("isProduct") }; 
						that.assocInput.autoComplt.close();
						that.assocInput.autoComplt.unbxdSearch();
					}
				});
				
				document.body.appendChild(this.uiElem);
			}
		}
		/*	Arg:
				<ELM> el = the elem to check
			Return:
				@ Ok: true
				@ NG: false
		*/
		_AutoCompltList.prototype.isHint = function (el) {
			if (el && typeof el == "object" && el.nodeType === 1) {
				 var cls = " " + el.className + " ";
				 var isHint = (cls.indexOf(" " + _CONST.autoCompltHintClass + " ") >= 0)  ;
				return true;
			}
			return false;
		}
		/*	Arg:
				<ARR> hints = the array of hint texts
			Return:
				<NUM> the number of hints put
		*/
		_AutoCompltList.prototype.putHints = function ( result ) {
			var count = 0;
			if (result instanceof Object) {				
				var i,
					j,
					k,
					len,
					hs = [],
					hints = [],
					hintObject = {},
					product = {};
				
			  //build hints
			  if(result && result.inFields && result.inFields.length > 0){
			  	 hints = result.inFields
			  	for(var k=0; k<hints.length;k++ ){
			  		hintObject = hints[k];

			  		hs.push( _ui.buildHint(hintObject, this.styles) );
							if (!hs[hs.length - 1]) {
								hs.pop();
							}
					
	
						for(var j= 0; j < _CONST.inFields.fields.length; j++){
							var arr = [],
								value = hintObject.name,
								field = _CONST.inFields.fields[j],
								propertyName = field.name+'_in';

							if( hintObject[ propertyName ] && hintObject[ propertyName ].length > 0)
								arr = hintObject[ propertyName ];

								for (i = 0; i < arr.length; i++) {
									hs.push( _ui.buildCategory( arr[i], this.styles, value, propertyName ));
									if (!hs[hs.length - 1]) {
										hs.pop();
									}
								}
						}

			  	}
			  }

			  if(result.queries && result.queries.length > 0){
			  	   	queries = result.queries
				  	for(var k=0; k<queries.length;k++ ){
				  		querie = queries[k];

				  		hs.push( _ui.buildHint(querie, this.styles) );
								if (!hs[hs.length - 1]) {
									hs.pop();
								}
				  	}
			  }

			  if(result.suggestions && result.suggestions.length > 0){
			  	   	suggestions = result.suggestions
				  	for(var k=0; k<suggestions.length;k++ ){
				  		suggestion = suggestions[k];

				  		hs.push( _ui.buildHint(suggestion, this.styles) );
								if (!hs[hs.length - 1]) {
									hs.pop();
								}
				  	}
			  }
			  //build products with thunmbnails
			  if(result.prods && result.prods.length > 0 && _CONST.productDetails === true){
			  	  hs.push( _ui.buildHeader(' Popular Products ') );
			  	  prods = result.prods;
			  	  for(var k=0; k < prods.length; k++){
			  	  	product = prods[k];
			  	  	hs.push( _ui.buildProduct(product, this.styles) );
							if (!hs[hs.length - 1]) {
								hs.pop();
							}
			  	  }
			  }

			 
				
				if (hs.length > 0) {
					var buf = document.createDocumentFragment();
					for (i = 0, count = hs.length; i < count; i++) {
						buf.appendChild(hs[i]);
					}
					this.clearHints();
					
					this.genList(); // Geneate the list in case there is none
					this.uiElem.appendChild(buf);							
				}
			}
			return count;
		}
		/*
		*/
		_AutoCompltList.prototype.clearHints = function () {
			if (this.uiElem) {
				this.uiElem.innerHTML = "";
			}
		}
		/*
			Return:
				@ Ok: true
				@ NG: false
		*/		
		_AutoCompltList.prototype.isOpen = function () {
			if (this.uiElem) {
				return !!(this.uiElem.getAttribute(_CONST.listStatus.attr) == _CONST.listStatus.open);
			}
			return false;
		}
		/*
		*/
		_AutoCompltList.prototype.open = function () {	
			var hints;
				
			if (this.uiElem
				&& (hints = this.uiElem.querySelectorAll("." + _CONST.autoCompltHintClass))
				&& hints.length // At lease one hint exists, we would open...
			) {
				var i,
					buf,
					top,
					left,
					width,
					maxHeight,
					widgetWidth,
					widgetTop,
					widgetLeft;

				
				// Position the list
				buf = this.assocInput.getBoundingClientRect();

				widgetWidth = 	this.styles.autoCompltList.width? this.styles.autoCompltList.width.replace("px", ''):null;
				widgetTop 	=	this.styles.autoCompltList.top? this.styles.autoCompltList.top.replace("px", ''):null;
				widgetLeft =    this.styles.autoCompltList.left? this.styles.autoCompltList.left.replace("px", ''):null;

				top =_CONST.widgetTop || (document.documentElement && document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop)
									  + buf.bottom;
				left = _CONST.widgetLeft || buf.left;
	
				this.uiElem.style.top = top + "px";
				this.uiElem.style.left = left + "px";
				this.uiElem.style.maxHeight = this.styles.autoCompltList.maxHeight;
				this.uiElem.style.background = this.styles.autoCompltList.backgroundColor;
				
				// Calculate the list's width
				buf = widgetWidth || buf.right - buf.left - parseFloat(_getComputedStyle(this.uiElem, "borderLeftWidth")) - parseFloat(_getComputedStyle(this.uiElem, "borderRightWidth"));
				this.uiElem.style.width = buf + "px";

				// Calculate the list's height
				for (i = 0, buf = 0; i < hints.length; i++) {
					buf += parseFloat(_getComputedStyle(hints[i], "height"))
					     + parseFloat(_getComputedStyle(hints[i], "paddingTop"))
					     + parseFloat(_getComputedStyle(hints[i], "paddingBottom"));						 
						 
					if (hints[i+1]) { // Compute the margin between the hints
						buf += Math.max(
							parseFloat(_getComputedStyle(hints[i], "marginBottom")), parseFloat(_getComputedStyle(hints[i+1], "marginTop"))
						);
					}
				}
				buf += parseFloat(_getComputedStyle(hints[0], "marginTop"))
					 + parseFloat(_getComputedStyle(hints[hints.length - 1], "marginBottom"));
				//this.uiElem.style.height = (buf + 1) + "px"; // Plus one for a little buffer

				// Open
				this.uiElem.setAttribute(_CONST.listStatus.attr, _CONST.listStatus.open);				
				this.uiElem.style.display = "block";
			}
		}
		/*
		*/
		_AutoCompltList.prototype.close = function () {
			if (this.uiElem && !_DBG) {
				this.mouseOnList = false;
				this.uiElem.parentNode.removeChild(this.uiElem);
				this.uiElem = null;
			}
		}
		/*
		*/
		_AutoCompltList.prototype.autoScroll = function () {
			var hint = this.getSelected();
			if (hint) {
				var currHint,
					offset = 0,
					minDisplayH = 0,
					hintH = hint.clientHeight,
					hintMT = parseFloat(_getComputedStyle(hint, "marginTop")),
					hintMB = parseFloat(_getComputedStyle(hint, "marginBottom"));
				
				currHint = hint.previousSibling;

				minDisplayH = hintH + (currHint ? Math.max(hintMT, hintMB) : hintMT); // The min height to display one hint
				
				while (currHint) {
				
					offset += hintH; // Add the current hint' hintH
					
					currHint = currHint.previousSibling;
					if (currHint) {
						// There is one hint before the current hint so calculate based on the collapsed model
						offset += Math.max(hintMT, hintMB);
					} else {
						// No more previous hint, this is the 1st hint so just take the marign top
						offset += hintMT;
					}
				}
				
				if (this.uiElem.clientHeight + this.uiElem.scrollTop - offset < minDisplayH
					|| offset - this.uiElem.scrollTop < minDisplayH
				) {
				// Ther is no enough room displaying the current selected hint so adjust the scroll
					this.uiElem.scrollTop = offset;
				}
			}
		}
		/*	Arg:
				<ELM|NUM> candidate = could be
				                      1) the hint elem or
									  2) the index of the hint in the list. Passing in -1 would select the last hint. Passing in 0 would select the 1st hint.
		*/
		_AutoCompltList.prototype.select = function (candidate) {

			if (this.uiElem) {
			
				var hint = null;
			
				if (typeof candidate == "object" && this.isHint(candidate)) {
				
					hint = candidate;
				
				} else if (typeof candidate == "number" && (candidate >= 0 || candidate === -1)) {
				
					var hints = this.uiElem.querySelectorAll("." + _CONST.autoCompltHintClass);
					
					if (hints.length > 0) {
						hint = +candidate;
						hint = (hint === -1 || hint > hints.length - 1) ? hints.length - 1 : hint;
						hint = hints[hint];
					}					
				}
				
			    var cls = hint.className ,
				    isHint = (cls.indexOf( _CONST.autoCompltHintClass) >= 0) ||  (cls.indexOf( _CONST.unbxdSelectorClass ) >= 0) ;

				if (   hint !== null 
					&& hint.tagName !=='EM' 
					&& hint.tagName !=='UL' 
					&& isHint ) {
					
					this.deselect();	
					hint.className = hint.className.trim();				
					hint.className += " " + _CONST.autoCompltHintSelectedClass;
					if(hint.tagName ==="LI" || hint.tagName ==="DIV" ){
						hint.style.color = this.styles.autoCompltHintSelected.color;
					}
					
				}
			}
		}
		/*
		*/
		_AutoCompltList.prototype.deselect = function () {
			if (this.uiElem) {
				var slct = this.getSelected();
				if (slct && slct.tagName !=='EM') {
					slct.className = slct.className.replace(_CONST.autoCompltHintSelectedClass, "").replace(_CONST.autoCompltHintClass, "");
					slct.className = slct.className + _CONST.autoCompltHintClass;
					if(slct.tagName ==="LI" || slct.tagName ==="DIV" ){
						slct.style.color = this.styles.autoCompltHint.color;
						slct.style.backgroundColor = this.styles.autoCompltHint.backgroundColor;
					}	
				}
			}
		}
		/*	Return:
				@ OK: <ELM> the selected hint element
				@ NG: null
		*/
		_AutoCompltList.prototype.getSelected = function () {
			var ret =  !this.uiElem ? null : this.uiElem.querySelector("." + _CONST.autoCompltHintSelectedClass) ||   null;
			return ret;
		}
	}

	var publicProps = {
		parseResponse :function(response) {
				   if(_CONST.inputText !== response.searchMetaData.queryParams.q)
				   	 return;

				var products = response.response.products,
					types = ["IN_FIELD", "POPULAR_PRODUCTS", "TOP_SEARCH_QUERIES", "KEYWORD_SUGGESTION"],
					//categories = ['category_in', 'brand_in'],
					result = {}, 
					hints = [],
					inFields=[], 
					prods = [], 
					queries = [], 
					suggestions=[];

			
				for(var k=0; k<products.length; k++){
		            var obj = {};
					    obj = { "name":products[k].autosuggest };

						if(products[k].doctype === 'IN_FIELD'  ){

							var product = products[k],
								fields = _CONST.inFields.fields;

							for(var j=0; j<fields.length; j++){

								var propertyName = fields[j].name + '_in',
									field = fields[j];


								if(product[propertyName] && product[propertyName].length > 0 && product.unbxdAutosuggestSrc !== field.name ){
									obj[propertyName] = product[propertyName];
						    		if(obj[propertyName] && obj[propertyName].length > field.count)
										obj[propertyName].length = field.count;
								}

							}
							

							inFields.push(obj);
						}else if(products[k].doctype ===  "POPULAR_PRODUCTS" ){
							var imageUrl 	= _CONST.popularProducts.imageUrl;  
							obj.imgUrl 		= 	products[k][ imageUrl ] ? products[k][ imageUrl ] : products[k].image_url;
							if(_CONST.popularProducts.priceFunction){
								 obj.price  = _CONST.popularProducts.priceFunction(products[k]);
							}else{
								obj.price 	= 	products[k].price ? products[k].price.toFixed(2) : "";
							}
							obj.uniqueId 	=  	products[k].uniqueId;
							obj.isProduct 	= 	true;
							obj.productUrl	=   products[k][_CONST.popularProducts.productUrl];
							obj.price ? obj.price = _CONST.popularProducts.currency+obj.price:false ;
							prods.push(obj);
					    }else if( products[k].doctype ===  "TOP_SEARCH_QUERIES" ){
					    	queries.push( obj );
					    }else if( products[k].doctype ===  "KEYWORD_SUGGESTION" ){
					    	suggestions.push( obj );
					    }
				}

				if(inFields.length > _CONST.inFields.count){
					inFields.length = _CONST.inFields.count;
					
				}
					
				if(prods.length > _CONST.popularProducts.count){
					prods.length = _CONST.popularProducts.count;
					
				}

				if(queries.length > _CONST.topQueries.numSuggestions){
					queries.length = _CONST.topQueries.numSuggestions;
					
				}

				if(suggestions.length > _CONST.keywordSuggestions.count){
					suggestions.length = _CONST.keywordSuggestions.count;		
				}
				result.inFields = inFields;
				result.prods = prods;
				result.queries = queries;
				result.suggestions = suggestions;
				//console.log(  result );
				this.openCallback(result);
		 },

		myJsonpAjax : function( input, openCallback ){
			input = input.trim();
			if(input.length < 1)
				return;

			this.openCallback = openCallback;
			_CONST.inputText = input;
			var script = document.createElement('script');
			script.src = _CONST.searchUrl+"&q="+input;
			document.body.appendChild(script);
		},

		setConfigValues:function(_CONST, config){

			for(var k in _CONST ){

				  if( Object.prototype.toString.call( _CONST[k] )  === '[object Array]' ){
				  	 _CONST[k] = config[k];
				  }if( typeof _CONST[k] === 'object'  &&   config[k] ){
                      unbxdAutocomplete.setConfigValues( _CONST[k], config[k] );
				  }else if( config[k] || config[k] === false ){
				  	 _CONST[k] = config[k];
				  }
			}

		   return;
		},

		formUrl:function(){
			_CONST.searchUrl = _CONST.searchUrl + _CONST.jsonpCallback;

			_CONST.searchUrl = _CONST.searchUrl 
							+ '&inFields.count=' + _CONST.inFields.count
		   					+ '&topQueries.count=' + _CONST.topQueries.count
		   					+ '&keywordSuggestions.count=' + _CONST.keywordSuggestions.count
		   					+ '&popularProducts.count=' + _CONST.popularProducts.count;
		   					+ '&indent=off'
		},

		enable : function (input, config) {
			if (   input
				&& typeof input == "object"
				&& typeof input.tagName == "string"
				&& input.tagName.toLowerCase() == "input"
				&& input.type == "text"
				&& input.nodeType === 1
				&& !input.autoComplt
			) {
				
				
				input.autoComplt = {};
			    //read config file
			    config = config || {};
			    unbxdAutocomplete.setConfigValues(_CONST, config);
			    unbxdAutocomplete.formUrl(_CONST);
				// for(var k in _CONST ){
				//   if( config[k] || config[k] === false )
				//     _CONST[k] = config[k];
				// };

				_CONST.popularProducts.image === false ? _CONST.unbxdShowProductImg = '_unbxd-hide' : _CONST.unbxdShowProductImg = ' ';
				_CONST.popularProducts.title === false ? _CONST.unbxdShowProductName = '_unbxd-hide' : _CONST.unbxdShowProductName = ' ';
				_CONST.popularProducts.price === false ? _CONST.unbxdShowProductPrice = '_unbxd-hide' : _CONST.unbxdShowProductPrice = ' ';

				
				var params = {					
						hintsFetcher : function (v, openCallback) {
				  			unbxdAutocomplete.myJsonpAjax(v, openCallback);
						}
				};

				var input_autoComplt_delay = _CONST.autoCompltDelay,
					input_autoComplt_enabled = true,
					input_autoComplt_currentTarget = "",
					input_autoComplt_hintsFetcher = null,
					input_autoComplt_list = new _AutoCompltList(input),
					/*
					*/
					input_autoComplt_startFetcher = function () {
						if (this.value.length > 0
							&& input_autoComplt_enabled
							&& typeof input_autoComplt_hintsFetcher == "function"
							&& input_autoComplt_currentTarget !== this.value // If equals, it means we've already been searching for the hints for the same value
						) {
							var fetcherCaller = {};
							
							fetcherCaller.call = function () {
								input_autoComplt_hintsFetcher.call(
									fetcherCaller.that,
									fetcherCaller.compltTarget,
									fetcherCaller.openHint
								);
							};
							
							fetcherCaller.that = input;
							
							// Record the autocomplete target for this fetching job
							fetcherCaller.compltTarget = input_autoComplt_currentTarget = this.value;
							//opencallback
							fetcherCaller.openHint = function (hints) {
								// If the user's input has changed during the fetching, this fetching job is useless.
								// So only when the user's input doesn't change, we will proceed further.
								if (fetcherCaller.compltTarget === input_autoComplt_currentTarget) {							
									if (input_autoComplt_list.putHints(hints)) {
										input_autoComplt_list.open();
									} else {
										fetcherCaller.that.autoComplt.close();
									}
								}
							}
							
							setTimeout(fetcherCaller.call, input_autoComplt_delay);
						}
					},
					/*
					*/
					input_autoComplt_compltInput= function () {
						if (input_autoComplt_enabled) {
							var hint = input_autoComplt_list.getSelected();
							if (hint) {
								this.value = hint.getAttribute("value");
							} else {
							// If no hint is selected, just use the original user input to autocomplete
								this.value = input_autoComplt_currentTarget;
							}
							window.unbxdSelected = {val:this.value, filterValue:hint.getAttribute("filter"), filterName:hint.getAttribute("key"),  isProduct:hint.getAttribute("isProduct")}
							//input.autoComplt.unbxdSearch();
						}
					},
					/*
					*/
					input_autoComplt_blurEvtHandle = function (e) {
						input.autoComplt.close();
						// e = _normalizeEvt(e);
						// if (input_autoComplt_list.mouseOnList) {
						// // If the mouse is on the autocomplete list, do not close the list
						// // and still need to focus on the input.
						// 	input.focus();
						// 	input_autoComplt_list.mouseOnList = false; // Assign false for the next detection
						// } else {
						// 	input.autoComplt.close();
						// }
					},
					/*
					*/
					input_autoComplt_keyEvtHandle = function (e) {
						e = _normalizeEvt(e);
						if (input_autoComplt_enabled) {
							
							if (e.type == "keydown"
								&& input_autoComplt_list.isOpen()
								&& (e.keyCode === _CONST.keyCode.up || e.keyCode === _CONST.keyCode.down)
							) {
							// At the case that the hint list is open ans user is walkin thru the hints.
							// Let's try to autocomplete the input by the selected input.
		
								var hint = input_autoComplt_list.getSelected();
								
								if (e.keyCode === _CONST.keyCode.up) {
								
									if (!hint) {
									// If none is selected, then select the last hint
										input_autoComplt_list.select(-1);												
									} else if (hint.previousSibling.className==='unbxd-header') {
									// If some hint is selected and the next hint exists, then select the next hint
										input_autoComplt_list.select(hint.previousSibling.previousSibling);
									}else if (hint.previousSibling) {
									// If some hint is selected and the previous hint exists, then select the previous hint
										input_autoComplt_list.select(hint.previousSibling);
									} else {
									// If some hint is selected but the previous hint doesn't exists, then deselect all
										input_autoComplt_list.deselect();
									}
									
								} else if (e.keyCode === _CONST.keyCode.down) {
									if (!hint) {
									// If none is selected, then select the first hint
										input_autoComplt_list.select(0);												
									} else if (hint.nextSibling.className==='unbxd-header') {
									// If some hint is selected and the next hint exists, then select the next hint
										input_autoComplt_list.select(hint.nextSibling.nextSibling);	
									}else if (hint.nextSibling) {
									// If some hint is selected and the next hint exists, then select the next hint
										input_autoComplt_list.select(hint.nextSibling);
									}  else {
									// If some hint is selected but the next hint doesn't exists, then deselect all
										input_autoComplt_list.deselect();
									}
									
								}
								
								input_autoComplt_list.autoScroll();
								
								input_autoComplt_compltInput.call(input);

							}
							else if (e.type == "keyup") {
								
								var startFetching = false;
								
								switch (e.keyCode) {
									case _CONST.keyCode.up: case _CONST.keyCode.down:
										if (input_autoComplt_list.isOpen()) {
											// We have handled this 2 key codes onkeydown, so must do nothing here
										} else {
											startFetching = true;
										}
									break;
									
									case _CONST.keyCode.esc:
										if (input_autoComplt_list.isOpen()) {
											// When pressing the ESC key, let's resume back to the original user input
											input.value = input_autoComplt_currentTarget;
											input.autoComplt.close();
										}										
									break;
									
									case _CONST.keyCode.enter:
										if (input_autoComplt_list.isOpen()) {
											// When pressing the enter key, let's try autocomplete
											input_autoComplt_compltInput.call(input);
											input.autoComplt.close();
											 input.autoComplt.unbxdSearch();
										}
									break;
									
									default:
										startFetching = true;
									break;
								}
								
								if (startFetching) {
									if (input.value.length > 0) {
										input_autoComplt_startFetcher.call(input);
									} else {
										input.autoComplt.close();
									}
								}
							}
						}
					};

				input.autoComplt.setHintsFetcher = function (hintsFetcher) {
					if (typeof hintsFetcher == "function") {
						input_autoComplt_hintsFetcher = hintsFetcher;
						return true;
					}
					return false;
				}
				
				input.autoComplt.config = function (params) {
					if (params instanceof Object) {
						
						
						var buf,
							pms = {};
						
						// Config the fetching delay timing
						//
						buf = Math.floor(+params.delay);
						if (buf > 0) {
							input_autoComplt_delay = pms.delay = buf;
						}
						
						// Config the max number of displayed hints
						//
						buf = Math.floor(+params.maxHintNum);
						if (buf > 0) {
							input_autoComplt_list.maxHintNum = pms.maxHintNum = buf;
						}
						
						return pms;
					}
					return false;
				}
				
				input.autoComplt.setStyles = function (targetClass, styles) {
				
					var tStyles,
						adjStyleAttrs,
						newStyles = false;
					
					// Let's find out which the target UI part is being set
					switch (targetClass) {
						case _CONST.autoCompltListClass:
							tStyles = input_autoComplt_list.styles.autoCompltList;
							adjStyleAttrs = _CONST.adjStyleAttrs.autoCompltList;
						break;
						
						case _CONST.autoCompltHintClass:
							tStyles = input_autoComplt_list.styles.autoCompltHint;
							adjStyleAttrs = _CONST.adjStyleAttrs.autoCompltHint;
						break;
						
						case _CONST.autoCompltHintSelectedClass:
							tStyles = input_autoComplt_list.styles.autoCompltHintSelected;
							adjStyleAttrs = _CONST.adjStyleAttrs.autoCompltHintSelected;
						break;
					}

					if (styles instanceof Object && tStyles && adjStyleAttrs) {
						
						for (var i = 0; i < adjStyleAttrs.length; i++) {
							
							if (typeof styles[adjStyleAttrs[i]] == "string" || typeof styles[adjStyleAttrs[i]] == "number") { // A simple type checking
								if (!newStyles) {
									newStyles = {};
								}
								newStyles[adjStyleAttrs[i]] = tStyles[adjStyleAttrs[i]] = styles[adjStyleAttrs[i]];
							}
							
						}						
					
					}
					
					return newStyles;
				}
				
				//CLOSING AUTO COMPLETE PDN
				input.autoComplt.close = function () {
				  //return;
					input_autoComplt_currentTarget = ""; // Closing means no need for autocomplete hint so no autocomplete target either
					input_autoComplt_list.close();

				}

				//fire search api
				input.autoComplt.unbxdSearch = function () {

					 if(unbxdSelected.isProduct)
					 	 document.location = unbxdSelected.isProduct;
					 else
					 	_CONST.callbackfunction(unbxdSelected.val, unbxdSelected.filterName, unbxdSelected.filterValue, unbxdSelected.isProduct );
					
					unbxdSelected = null;

					if( _CONST.formSubmit )
						input.form.submit();
					if( _CONST.callSearch )
						unbxdApi.getSearchResults( this.getSelected().getAttribute("value"), 'search', paintHomePage, 1, 12 );						
				}
				
				input.autoComplt.enable = function () {
					input_autoComplt_enabled = true;
				}
				
				input.autoComplt.disable = function () {
					this.close();
					input_autoComplt_enabled = false;
				}
				
				input.autoComplt.destroy = function () {
					_rmEvent(input, "blur", input_autoComplt_blurEvtHandle);
					_rmEvent(input, "keyup", input_autoComplt_keyEvtHandle);
					_rmEvent(input, "keydown", input_autoComplt_keyEvtHandle);
					this.close();
					delete input.autoComplt;
				}
				
				_addEvt(input, "blur", input_autoComplt_blurEvtHandle);
				_addEvt(input, "keyup", input_autoComplt_keyEvtHandle);
				_addEvt(input, "keydown", input_autoComplt_keyEvtHandle);
				
				if (params instanceof Object) {
					input.autoComplt.config(params);
					input.autoComplt.setHintsFetcher(params.hintsFetcher);
				}
				
				return input;
			}
			return null;
		}
		
	};

	return publicProps;
}());
