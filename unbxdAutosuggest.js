
var unbxdAutoSuggestFunction = function($,Handlebars,undefined){
	var isMobile = {
	    Android: function() {
	      return navigator.userAgent.match(/Android/i);
	    },
	    BlackBerry: function() {
	    },
	    iOS: function() {
	      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	    },
	    Opera: function() {
	      return navigator.userAgent.match(/Opera Mini/i);
	    },
	    Windows: function() {
	      return navigator.userAgent.match(/IEMobile/i);
	      return navigator.userAgent.match(/BlackBerry/i);
	    },
	    any: function() {
	      return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
	    }
	};

	Handlebars.registerHelper('unbxdIf', function(v1,v2,options){
		return v1 === v2 ? options.fn(this) : options.inverse(this);
	});

	Handlebars.registerHelper('safestring', function(value) {
		return new Handlebars.SafeString(value);
	});

	function autocomplete (input, options) {
		this.input = input;
		this.init(input, options);
	};
	
	function debounce(func, wait, immediate) {
		var timeout;
		return function() {
			var context = this, args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	};
	
	$.extend(autocomplete.prototype, {
		default_options: {
			siteName : 'demosite-u1407617955968'
      		,APIKey : '64a4a2592a648ac8415e13c561e44991'
			,resultsClass : 'unbxd-as-wrapper'
			,minChars : 3
			,delay : 100
			,loadingClass : 'unbxd-as-loading'
			,mainWidth:0
			,sideWidth:180
			,zIndex : 0
			,position : 'absolute'
			,sideContentOn : "right" //"left"
			,template : "1column" // "2column"
			,theme : "#ff8400"
			,mainTpl: ['inFields', 'keywordSuggestions', 'topQueries', 'popularProducts']
			,sideTpl: []
			,showCarts : true // will be used in default template of popular products
			,cartType : "inline" // "separate" will be used in default template popular products
			,onCartClick : function(obj){}
			,hbsHelpers: null // handlebar helper functions
			,onSimpleEnter : null
			,onItemSelect: null
			,inFields:{
				count: 2
				,fields:{
					'brand':3
					,'category':3
					,'color':3
				}
				,header: ""
				,tpl: "{{{safestring highlighted}}}"
			},
			topQueries:{
				count: 2
				,hidden: false
				,header: ""
				,tpl: "{{{safestring highlighted}}}"
			},
			keywordSuggestions:{
				count: 2
				,header: ""
				,tpl: "{{{safestring highlighted}}}"
			}
			,popularProducts:{
				count: 2
				,price:true
				,priceFunctionOrKey : "price"
				,image:true
				,imageUrlOrFunction: "imageUrl"
				,currency : "Rs."
				,header: ""
				,tpl: '{{#if ../showCarts}}'
						+'{{#unbxdIf ../../cartType "inline"}}'//"inline" || "separate"
							+'<div class="unbxd-as-popular-product-inlinecart">'
								+'<div class="unbxd-as-popular-product-image-container">'
									+'{{#if image}}'
									+'<img src="{{image}}"/>'
									+'{{/if}}'
								+'</div>'
								+'<div  class="unbxd-as-popular-product-name">'
									+'<div style="table-layout:fixed;width:100%;display:table;">'
										+'<div style="display:table-row">'
											+'<div style="display:table-cell;text-overflow:ellipsis;overflow: hidden;white-space: nowrap;">'
												+'{{{safestring highlighted}}}'
											+'</div>'
										+'</div>'
									+'</div>'
								+'</div>'
								+'{{#if price}}'
									+'<div class="unbxd-as-popular-product-price">'
										+'{{currency}}{{price}}'
									+'</div>'
								+'{{/if}}'
								+'<div class="unbxd-as-popular-product-quantity">'
									+'<div class="unbxd-as-popular-product-quantity-container">'
										+'<span>Qty</span>'
										+'<input class="unbxd-popular-product-qty-input" value="1"/>'
									+'</div>'
								+'</div>'
								+'<div class="unbxd-as-popular-product-cart-action">'
									+'<button class="unbxd-as-popular-product-cart-button">Add to cart</button>'
								+'</div>'
							+'</div>'
						+'{{else}}'
							+'<div class="unbxd-as-popular-product-info">'
								+'<div class="unbxd-as-popular-product-image-container">'
									+'{{#if image}}'
									+'<img src="{{image}}"/>'
									+'{{/if}}'
								+'</div>'
								+'<div  class="unbxd-as-popular-product-name">'
									+'{{{safestring highlighted}}}'
								+'</div>'
							+'</div>'
							+'<div class="unbxd-as-popular-product-cart">'
								+'<div class="unbxd-as-popular-product-cart-action">'
									+'<button class="unbxd-as-popular-product-cart-button">Add to cart</button>'
								+'</div>'
								+'<div class="unbxd-as-popular-product-quantity">'
									+'<div class="unbxd-as-popular-product-quantity-container">'
										+'<span>Qty</span>'
										+'<input class="unbxd-popular-product-qty-input" value="1"/>'
									+'</div>'
								+'</div>'
								+'{{#if price}}'
								+'<div class="unbxd-as-popular-product-price">'
									+'{{currency}}{{price}}'
								+'</div>'
								+'{{/if}}'
							+'</div>'
						+'{{/unbxdIf}}'
					+'{{else}}'
						+'<div class="unbxd-as-popular-product-info">'
							+'<div class="unbxd-as-popular-product-image-container">'
								+'{{#if image}}'
								+'<img src="{{image}}"/>'
								+'{{/if}}'
							+'</div>'
							+'<div  class="unbxd-as-popular-product-name">'
								+'{{{safestring highlighted}}}'
							+'</div>'
						+'</div>'
					+'{{/if}}'
				+'</li>'
			}
			,resultsContainerSelector : null
			,processResultsStyles : null
		}
		,$input : null
		,$results : null
		,timeout : null
		,previous  : ''
		,activeRow : -1//keeps track of focused result in navigation
		,activeColumn : 0
		,keyb : false
		,hasFocus : false
		,lastKeyPressCode : null
		,ajaxCall : null//keeps track of current ajax call
		,currentResults	: []
		,cache : {}
		,params : {
			query : '*'
			,filters : {}
		}
		,selectedClass : "unbxd-ac-selected"
		,scrollbarWidth : null
		,init: function(input, options) {
			this.options = $.extend({}, this.default_options, options);
			this.$input = $(input).attr('autocomplete', 'off');
			this.$results = $('<div/>', {'class' :this.options.resultsClass})
				.css('position', this.options.position)
				.hide();
			
			if(this.options.zIndex > 0)
				this.$results.css('zIndex',this.options.zIndex);

			if(typeof this.options.resultsContainerSelector == "string" && this.options.resultsContainerSelector.length)
				$(this.options.resultsContainerSelector).append(this.$results);
			else
				$("body").append(this.$results);

			if(typeof this.options.hbsHelpers === 'function')
				this.options.hbsHelpers.call(this)


			this.wire();
		}
		,wire: function(){
			var self = this;
			
			this.$input.bind('keydown.auto',this.keyevents());

			this.$input.bind('select.auto',function(){
				self.log("select : setting focus");
				self.hasFocus = true;
			});
			
			$(document).bind("click.auto",function(e){
				if(e.target == self.input){
					self.log("clicked on input : focused");
					self.hasFocus = true;
					if(self.previous === self.$input.val())
						self.showResults();
				}else if(e.target == self.$results[0]){
					self.log("clicked on results block : selecting")
					self.hasFocus = false;
				}else if($.contains(self.$results[0], e.target)){
					self.log("clicked on element for selection",e.target.tagName);
					var $et = $(e.target), p = $et;

					self.hasFocus = false;

					if(e.target.tagName !== "LI"){
						p = $et.parents("li");
					}

					if(!p || p.hasClass(".unbxd-as-header") || e.target.tagName == "INPUT")
						return;

					if(e.target.tagName == "BUTTON" && $et.hasClass("unbxd-as-popular-product-cart-button") && typeof self.options.onCartClick == "function"){
						self.log("BUTTON click");
						var data = p.data();
						data.quantity = parseFloat(p.find("input.unbxd-popular-product-qty-input").val());

						self.addToAnalytics("click",{
							pr : parseInt(data.index) + 1
							,pid : data.pid || null
							,url : window.location.href
						});

						self.options.onCartClick.call(self,data, self.currentResults.POPULAR_PRODUCTS[parseInt(data['index'])]._original) && self.hideResults();

						self.addToAnalytics("addToCart",{
							pid : data.pid || null
							,url : window.location.href
						});

						return;
					}

<<<<<<< HEAD
		filter:false,
		
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

		types:{
			infield:"inField",
			topquery:"topQuery",
			suggestion:"keywordSuggestion",
			product:"popularProduct"
		},
	
		defaultStyles : {
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
			autoCompltHint : {
				height : "22px",
				padding: "0 2px 0 5px",
				margin: "0",
				overflow: "auto",
				listStyleType: "none",
				color : "#ffff",
				fontSize : "14px",
				backgroundColor:'white'
			},
			autoCompltHintSelected:{
				color:'black',
				backgroundColor:"green"
			}
		}
};

	var getParent = function( element ){
			 	if(!element)
			 		return;
				if(element && element.tagName && element.tagName === "LI")
					return element;
				else
					return getParent(element.parentElement)
			}
	//push analytics
    var pushAnalytics = function( element ){
                    try{
                        var data = element.dataset,

                            analyticObj = { 
                                        autosuggest_type          : data.type,
                                        autosuggest_suggestion    : data.value,
                                        field_value 			  : data.filtervalue,
                                        field_name  			  : data.filtername,
                                        src_field     			  : data.source,
                                        pid           			  : data.pid
                                    };
                        Unbxd.track( "search", {query : _CONST.inputText, autosuggestParams : analyticObj});
                    }catch(e){
                        console.warn("pushAnalytics failed", e);
                    }
                }
=======
					self.selectItem(p.data());
				}else{
					self.hasFocus = false;
					self.hideResults();
				}
			});

		}
		,keyevents : function(){
			var self = this;
>>>>>>> jquery-unbxdautosuggest

			
			return function(e){
				self.lastKeyPressCode = e.keyCode;
				self.lastKeyEvent = e;
				
				switch(e.keyCode) {
					case 38: // up
						e.preventDefault();
						self.moveSelect(-1);
						break;
					case 40: // down
						e.preventDefault();
						self.moveSelect(1);
						break;
					case 39: // right
						if(self.activeRow > -1){
							e.preventDefault();
							self.moveSide(1);
						}
						break;
					case 37: // left
						if(self.activeRow > -1){
							e.preventDefault();
							self.moveSide(-1);
						}
						break;
					case 9:  // tab
					case 13: // return
						if( self.selectCurrent() ){
							e.preventDefault();
						}
						else{
							self.hideResultsNow();
						}
						break;
					default:
						self.activeRow = -1;
						self.hasFocus = true;
						
						if (self.timeout) 
							clearTimeout(self.timeout);
						
						self.timeout = setTimeout(debounce(function(){self.onChange();}, 250), self.options.delay);
						
						break;
				}
			};
		}
		,moveSide: function(step){
			//step : 1 -> right click
			//step : -1 ->left click
			var newcolumn = this.activeColumn;
			if(this.options.template == "2column"){
				//if(this.options.sideContentOn == "left" && ((this.activeColumn == 0 && step == -1) || (this.activeColumn == 1 && step == 1)))
				if(this.options.sideContentOn == "left"){
					(this.activeColumn == 0 && step == -1) && (newcolumn = 1);
					(this.activeColumn == 1 && step == 1) && (newcolumn = 0);
				}else{//it is on right
					(this.activeColumn == 0 && step == 1) && (newcolumn = 1);
					(this.activeColumn == 1 && step == -1) && (newcolumn = 0);
				}

				if(newcolumn != this.activeColumn){
					this.activeColumn = newcolumn;
					this.activeRow = -1
					this.moveSelect(1);
				}
			}
		}
		,moveSelect: function (step) {
			var lis = this.$results.find("ul." + (this.activeColumn ? "unbxd-as-sidecontent" : "unbxd-as-maincontent")).find('li:not(.unbxd-as-header)');
			
			if (!lis) return;

			this.activeRow += step;
			
			if(this.activeRow < -1)
				this.activeRow = lis.size()-1;
			else if(this.activeRow == -1)
				this.$input.focus();
			else if(this.activeRow >= lis.size()){
				this.activeRow = -1;
				this.$input.focus();
			}

			$("."+this.selectedClass).removeClass(this.selectedClass);

			$(lis[this.activeRow]).addClass(this.selectedClass);
			
			if(this.activeRow >= 0 && this.activeRow < lis.size())
				this.$input.val($(lis[this.activeRow]).data('value'));
			else if(this.activeRow == -1)
				this.$input.val(this.previous);
		}
		,selectCurrent: function () {
			var li = this.$results.find('li.'+this.selectedClass),self = this;
		
<<<<<<< HEAD
		return v;
	}
	
	var _ui = {
		
		buildElem : function (html) {
			var div = document.createElement("DIV");
			div.innerHTML = html;
			return div.firstChild.cloneNode(true);
		},
		
		buildHint : function (hint, styles, type) {
			if ( hint) {
				var value = hint.name.replace (/"/g,''),
				    reg = new RegExp(_CONST.inputText, 'gi'),
		
				hint = this.buildElem('<li data-type="'+type+'" data-value="'+value+'" class="' + _CONST.autoCompltHintClass + '">' + hint.name + '</li>');
				hint.innerHTML = hint.innerHTML.replace(reg, function(str) {
				    	return '<em>'+str+'</em>'
				    });

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

		buildCategory : function(hint, styles, key, type, obj){
			if (hint) {
				var filter 	= hint,
					key 	= key,
                    src_field = obj.unbxdSrc || "",
				    hint 	= this.buildElem('<li data-type="'+type+'" data-value="'+obj.name+'" data-filterValue="'+filter+'"  data-filterName="'+key+'" data-source="'+src_field+'"  class="' + _CONST.autoCompltHintClass + '">'
				    			+'&nbsp;&nbsp;&nbsp;&nbsp;in&nbsp;' 
				    			+'<span  class="' + _CONST.autoCompltHintClass + '">' + hint + '</span>'
				    			+'</li>');
=======
			if (li.length) {
				this.selectItem(li.data());
				return true;
			} else {
				if (typeof this.options.onSimpleEnter == "function" && (this.lastKeyPressCode == 10 || this.lastKeyPressCode == 13)){
					this.lastKeyEvent.preventDefault();
					self.options.onSimpleEnter.call(self);
				}
				
				return false;
			}
		}
		,selectItem: function (data) {
			if (!('value' in data))
				return ;
			this.log("selected Item : ",data);
			var v = $.trim(data['value']),prev = this.previous;
			
			this.previous = v;
			this.input.lastSelected = data;
			this.$results.html('');
			this.$input.val(v);
			this.hideResultsNow(this);
			
			this.addToAnalytics("search",{query : data.value, autosuggestParams : { 
				autosuggest_type : data.type
				,autosuggest_suggestion : data.value
				,field_value : data.filtervalue || null
				,field_name : data.filtername || null
				,src_field : data.source || null
				,pid : data.pid || null
				,internal_query : prev
			}});

			if (typeof this.options.onItemSelect == "function"){
				this.options.onItemSelect.call(this,data,this.currentResults[data.type][parseInt(data['index'])]._original);
			}
		}
		,addToAnalytics:function(type,obj){
			if("Unbxd" in window && "track" in window.Unbxd && typeof window.Unbxd.track == "function"){
				this.log("Pushing data to analytics",type,obj);
				Unbxd.track( type, obj );
			}
		}
		,showResults: function () {
			if(this.options.width){
				this.options.mainWidth = this.options.width;
			}
			var pos = this.$input.offset()
			// either use the specified width or calculate based on form element
			,iWidth = (this.options.mainWidth > 0) ? this.options.mainWidth : this.$input.innerWidth()
			,bt = parseInt(this.$input.css("border-top-width"),10)
			,bl = parseInt(this.$input.css("border-left-width"),10)
			,br = parseInt(this.$input.css("border-right-width"),10)
			,pb = parseInt(this.$input.css("padding-bottom"),10)
			,fwidth = (parseInt(iWidth)-2+bl+br)
			,fpos = {top : pos.top + bt + this.$input.innerHeight() + 'px', left: pos.left + "px"};
			
			this.$results.find("ul.unbxd-as-maincontent").css("width", fwidth+"px");
>>>>>>> jquery-unbxdautosuggest
			
			if(this.scrollbarWidth == null){
				this.setScrollWidth();
			}

			//set column direction
			if(this.options.template == "2column"){
				this.$results.find("ul.unbxd-as-sidecontent").css("width", this.options.sideWidth+"px");
				this.$results.removeClass("unbxd-as-extra-left unbxd-as-extra-right");
				this.$results.addClass("unbxd-as-extra-" + this.options.sideContentOn);
				if(this.$results.find("ul.unbxd-as-sidecontent").length > 0 && this.options.sideContentOn == "left"){
					fpos.left = pos.left - this.options.sideWidth + "px";
				}
			}

<<<<<<< HEAD
		buildProduct : function(hint, type){
			if (hint) {
				var value = hint.name,
				    reg = new RegExp(_CONST.inputText, 'gi');
		

				hint.name = hint.name.replace(reg, function(str) {
				    	return '<em>'+str+'</em>'
				    });
				
				if( hint.productUrl ){
					var hint = this.buildElem('<li isProduct="'+hint.productUrl+'" data-type="'+type+'" data-pid="'+hint.pid+'" data-productUrl="'+hint.productUrl+'" data-value="'+value+'" data-price="'+hint.price+'" class="' + _CONST.autoCompltHintClass +" "+ _CONST.unbxdProductClass+'">'
					    +'<div class="_unbxd-hint unbxd-product-suggest" >'
					         +'<div class="' + _CONST.unbxdShowProductImg+' _unbxd-hint unbxd-product-img">'
					         	+ '<img class="_unbxd-hint" value="'+value+'" src="'+hint.imgUrl+'">'
					         +'</div>'
					         +'<div class="' + _CONST.unbxdShowProductName+' _unbxd-hint unbxd-product-name" >'
					             +hint.name
					         + '</div>'
					          +'<div class="' + _CONST.unbxdShowProductPrice+' _unbxd-hint unbxd-product-price" >'
					             +hint.price
					         + '</div>'
					         +'<div class="_unbxd-autosuggest-clearfix"></div>'
					    +'</div>'
				    + '</li>');
				}else{
					var hint = this.buildElem('<li data-productUrl="'+hint.productUrl+'"  data-type="'+type+'" data-pid="'+hint.pid+'" data-type="'+type+'" data-value="'+value+'" data-price="'+hint.price+'" class="' + _CONST.autoCompltHintClass +" "+ _CONST.unbxdProductClass+'">'
					    +'<div class="_unbxd-hint unbxd-product-suggest" >'
					         +'<div class="' + _CONST.unbxdShowProductImg+' _unbxd-hint unbxd-product-img">'
					         	+ '<img class="_unbxd-hint" value="'+value+'" src="'+hint.imgUrl+'">'
					         +'</div>'
					         +'<div class="' + _CONST.unbxdShowProductName+' _unbxd-hint unbxd-product-name" >'
					             +hint.name
					         + '</div>'
					          +'<div class="' + _CONST.unbxdShowProductPrice+' _unbxd-hint unbxd-product-price" >'
					             +hint.price
					         + '</div>'
					         +'<div class="_unbxd-autosuggest-clearfix"></div>'
					    +'</div>'
				    + '</li>');
				}
				
				return hint;
=======

			if(typeof this.options.processResultsStyles == "function"){
				fpos = this.options.processResultsStyles.call(this,fpos);
>>>>>>> jquery-unbxdautosuggest
			}

			this.$results.css(fpos).show();
		}
		,setScrollWidth:function(){
			var scrollDiv = document.createElement("div");
			scrollDiv.setAttribute("style","width: 100px;height: 100px;overflow: scroll;position: absolute;top: -9999px;");

			document.body.appendChild(scrollDiv);

			this.scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
            document.body.removeChild(scrollDiv);
		}
		,hideResults: function () {
			if (this.timeout)
				clearTimeout(this.timeout);

			var self = this;

			this.timeout = setTimeout(function(){self.hideResultsNow();}, 200);
		}
		,hideResultsNow: function () {
			this.log("hideResultsNow");
			if (this.timeout) clearTimeout(this.timeout);
			
			this.$input.removeClass(this.options.loadingClass);
			
			if (this.$results.is(':visible')) {
				this.$results.hide();
			}
			
			if(this.ajaxCall) this.ajaxCall.abort();
		}
		,addFilter : function(field, value){
			if(!(field in this.params.filters))
				this.params.filters[field] = {};

			this.params.filters[field][value] = field;

			return this;
		}
		,removeFilter  : function(field, value){
			if(value in this.params.filters[field])
				delete this.params.filters[field][value];

			if(Object.keys(this.params.filters[field]).length == 0)
				delete this.params.filters[field];			

			return this;
		}
		,clearFilters : function(){
			this.params.filters = {}
			return this;
		}
		,onChange: function () {
			// ignore if the following keys are pressed: [del] [shift] [capslock]
			if( this.lastKeyPressCode == 46 || (this.lastKeyPressCode > 8 && this.lastKeyPressCode < 32) )
			{
				if(this.lastKeyPressCode == 27 && typeof this.input.lastSelected == 'object'){
					this.$input.val(this.input.lastSelected.value);
				}

				return this.$results.hide();
			}
			
			var v = this.$input.val();
			if (v == this.previous) return;
			
			this.params.q = v
			this.previous = v;
			this.currentResults	=	{};
			
			if(this.inCache(v)){
				this.log("picked from cache : " + v);
				this.currentResults = this.getFromCache(v);
				this.$results.html(this.prepareHTML());
				this.showResults();
			}else{
				if(this.ajaxCall) this.ajaxCall.abort();
			
				if (v.length >= this.options.minChars) {
					this.$input.addClass(this.options.loadingClass);
					this.requestData(v);
				} 
				else {
					this.$input.removeClass(this.options.loadingClass);
					this.$results.hide();
				}	
			}
		}
		,getClass : function(object){return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];}
		,requestData: function (q) {
			var self = this,url = self.autosuggestUrl();
			this.log("requestData", url);
			this.ajaxCall = $.ajax({
				url: url
				,dataType: "jsonp"
				,jsonp: 'json.wrf'
			})
			.done(function(d) { 
				self.receiveData(d);
			})
			.fail(function(f) {	
				self.$input.removeClass(self.options.asLoadingClass);
				self.$results.hide();
			});
		}
<<<<<<< HEAD
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
					product = {},
                    isheaderset = false;
				
			  //build hints
			  if(result && result.inFields && result.inFields.length > 0){
			  	 hints = result.inFields
			  	for(var k=0; k<hints.length;k++ ){
			  		hintObject = hints[k];

                    if(!isheaderset) {
                            hs.push(_ui.buildHeader(' SEARCH SUGGESTIONS '));
                            isheaderset = true;
                    }

			  		hs.push( _ui.buildHint(hintObject, this.styles, _CONST.types.infield ) );
							if (!hs[hs.length - 1]) {
								hs.pop();
							}
					
	
						for(var j= 0; j < _CONST.inFields.fields.length; j++){
							var arr = [],
								value = hintObject.name,
								unbxdSrc = hintObject.unbxdSrc ? hintObject.unbxdSrc : "",
								field = _CONST.inFields.fields[j],
								propertyName = field.name+'_in';

							if( hintObject[ propertyName ] && hintObject[ propertyName ].length > 0)
								arr = hintObject[ propertyName ];

								for (i = 0; i < arr.length; i++) {
                                    hs.push( _ui.buildCategory( arr[i], this.styles, propertyName, "infield", hintObject ));
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

				  		hs.push( _ui.buildHint(querie, this.styles, _CONST.types.topquery ) );
								if (!hs[hs.length - 1]) {
									hs.pop();
								}
				  	}
			  }

			  if(result.suggestions && result.suggestions.length > 0){
			  	   	suggestions = result.suggestions
				  	for(var k=0; k<suggestions.length;k++ ){
				  		suggestion = suggestions[k];

				  		hs.push( _ui.buildHint(suggestion, this.styles, _CONST.types.suggestion) );
								if (!hs[hs.length - 1]) {
									hs.pop();
								}
				  	}
			  }
			  //build products with thunmbnails
			  if(result.prods && result.prods.length > 0 && _CONST.productDetails === true){
			  	  hs.push( _ui.buildHeader(' POPULAR PRODUCTS ') );
			  	  prods = result.prods;
			  	  for(var k=0; k < prods.length; k++){
			  	  	product = prods[k];
			  	  	hs.push( _ui.buildProduct(product, _CONST.types.product ) );
							if (!hs[hs.length - 1]) {
								hs.pop();
							}
			  	  }
			  }

			 
				
				if (hs.length > 0) {
					var buf = document.createDocumentFragment();
					for (i = 0, count = hs.length; i < count; i++) {
						buf.appendChild(hs[i]);
=======
		,autosuggestUrl : function(){
			var host_path = this.getHostNPath();

			var url = "q=" + encodeURIComponent(this.params.q);

			url += '&inFields.count=' + this.options.inFields.count
				+ '&topQueries.count=' + this.options.topQueries.count
				+ '&keywordSuggestions.count=' + this.options.keywordSuggestions.count
				+ '&popularProducts.count=' + this.options.popularProducts.count;
				+ '&indent=off';

			for(var x in this.params.filters){
				if(this.params.filters.hasOwnProperty(x)){
					var a = [];
					for(var y in this.params.filters[x]){
						if(this.params.filters[x].hasOwnProperty(y)){
							a.push((x+':\"'+ encodeURIComponent(y.replace(/(^")|("$)/g, '')) +'\"').replace(/\"{2,}/g, '"'));
						}
>>>>>>> jquery-unbxdautosuggest
					}

					url += '&filter='+a.join(' OR ');
				}
			}

			return host_path + "?" + url;
		}
		,getHostNPath: function(){
			return "//search.unbxdapi.com/"+ this.options.APIKey + "/" + this.options.siteName + "/autosuggest"
		}
		,receiveData: function (data) {
			if (data) {
				this.$input.removeClass(this.options.loadingClass);
				this.$results.html('');

				// if the field no longer has focus or if there are no matches, do not display the drop down
				if( !this.hasFocus || data.response.numberOfProducts == 0 || "error" in data ) return this.hideResultsNow(this);

				this.processData(data);

				this.addToCache(this.params.q, this.currentResults);

				this.$results.html(this.prepareHTML());
				
				this.showResults();
			} else {
				this.hideResultsNow(this);
			}
		}
		,processData: function(data){
			this.currentResults = {
				KEYWORD_SUGGESTION : []
				,TOP_SEARCH_QUERIES : []
				,POPULAR_PRODUCTS : []
				,IN_FIELD : []
			}
			,infieldsCount = 0;

			for(var x = 0; x < data.response.products.length; x++){
				var doc = data.response.products[x]
					,o = {};
				if("TOP_SEARCH_QUERIES" == doc.doctype && this.options.topQueries.count > this.currentResults.TOP_SEARCH_QUERIES.length){
					o = {
						autosuggest : doc.autosuggest
						,highlighted : this.highlightStr(doc.autosuggest)
						,type : "TOP_SEARCH_QUERIES"
						,_original : doc.doctype
					};
					this.currentResults.TOP_SEARCH_QUERIES.push(o);
				}else if("IN_FIELD" == doc.doctype && this.options.inFields.count > infieldsCount){
					var ins = {}
						,asrc = " " + doc.unbxdAutosuggestSrc + " "
						,highlightedtext = this.highlightStr(doc.autosuggest);

					for(var a in this.options.inFields.fields){
						if( (a+"_in") in doc && doc[a+"_in"].length && asrc.indexOf(" " +a+" ") == -1){
							ins[a] = doc[a+"_in"].slice(0, parseInt(this.options.inFields.fields[a]))
						}
					}

					this.currentResults.IN_FIELD.push({
						autosuggest : doc.autosuggest
						,highlighted : highlightedtext
						,type : "keyword" //this is kept as keyword but in template it will be used as "IN_FIELD"
						,source : doc.unbxdAutosuggestSrc
					});

					infieldsCount++;

					for(var a in ins){
						for(var b = 0; b < ins[a].length; b++)
							this.currentResults.IN_FIELD.push({
								autosuggest : doc.autosuggest
								,highlighted : ins[a][b]
								,type : doc.doctype
								,filtername : a
								,filtervalue : ins[a][b]
								,_original : doc
								,source : doc.unbxdAutosuggestSrc
							})
					}
				}else if("KEYWORD_SUGGESTION" == doc.doctype  && this.options.keywordSuggestions.count > this.currentResults.KEYWORD_SUGGESTION.length){
					o = {
						autosuggest : doc.autosuggest
						,highlighted : this.highlightStr(doc.autosuggest)
						,type : doc.doctype
						,_original : doc
						,source : doc.unbxdAutosuggestSrc || ""
					};
					this.currentResults.KEYWORD_SUGGESTION.push(o);
				}else if("POPULAR_PRODUCTS" == doc.doctype && this.options.popularProducts.count > this.currentResults.POPULAR_PRODUCTS.length){
					o = {
						autosuggest : doc.autosuggest
						,highlighted : this.highlightStr(doc.autosuggest)
						,type : doc.doctype
						,pid : doc.uniqueId.replace("popularProduct_","")
						,_original : doc
					};

					if(this.options.popularProducts.price){
						if(typeof this.options.popularProducts.priceFunctionOrKey == "function"){
							o.price = this.options.popularProducts.priceFunctionOrKey(doc);
						}else if(typeof this.options.popularProducts.priceFunctionOrKey == "string" && this.options.popularProducts.priceFunctionOrKey){
							o.price = this.options.popularProducts.priceFunctionOrKey in doc ? doc[this.options.popularProducts.priceFunctionOrKey] : null;
						}else{
							o.price = "price" in doc ? doc["price"] : null;
						}

						if(this.options.popularProducts.currency)
							o.currency = this.options.popularProducts.currency;
					}

					if(this.options.popularProducts.image){
						if(typeof this.options.popularProducts.imageUrlOrFunction == "function"){
							o.image = this.options.popularProducts.imageUrlOrFunction(doc);
						}else if(typeof this.options.popularProducts.imageUrlOrFunction == "string" && this.options.popularProducts.imageUrlOrFunction){
							o.image = this.options.popularProducts.imageUrlOrFunction in doc ? doc[this.options.popularProducts.imageUrlOrFunction] : null;
						}
					}

					this.currentResults.POPULAR_PRODUCTS.push(o);
				}
			}
			//lenth of result list
			outLength=this.currentResults.POPULAR_PRODUCTS.length+this.currentResults.IN_FIELD.length;
		}
		,escapeStr: function(str){return str.replace(/([\\{}()|.?*+\-\^$\[\]])/g,'\\$1');}
		,highlightStr : function(str){
			var output	=	str
				,q = $.trim(this.params.q +'');

			if(q.indexOf(' ')){
				var arr = q.split(' ');
				for(var k in arr){
					if(!arr.hasOwnProperty(k))continue;
					
					var l	= output.toLowerCase().lastIndexOf("</strong>");
					if(l != -1) l += 9;
					output = output.substring(0,l) + output.substring(l).replace(new RegExp(this.escapeStr( arr[k] ), 'gi') , function($1){
						return '<strong>'+$1+'<\/strong>';
					});
				}
			}else{
				var st = output.toLowerCase().indexOf( q );
				output = st >= 0 ? output.substring(0,st) + '<strong>' + output.substring(st, st+q.length) + '</strong>' + output.substring(st+q.length) : output;
			}

			return output;
		}
		,prepareinFieldsHTML: function (){
			return '{{#if data.IN_FIELD}}'
				+ (this.options.inFields.header ? '<li class="unbxd-as-header">'+ this.options.inFields.header +'</li>' : '')
				+'{{#each data.IN_FIELD}}'
					+'{{#unbxdIf type "keyword"}}'
					+'<li class="unbxd-as-keysuggestion" data-index="{{@index}}" data-value="{{autosuggest}}" data-type="IN_FIELD" data-source="{{source}}">'
						+ (this.options.inFields.tpl ? this.options.inFields.tpl : this.default_options.inFields.tpl)
					+'</li>'
					+'{{else}}'
					+'<li class="unbxd-as-insuggestion" style="color:'+this.options.theme+'" data-index="{{@index}}" data-type="{{type}}" data-value="{{autosuggest}}" data-filtername="{{filtername}}" data-filtervalue="{{filtervalue}}"  data-source="{{source}}">'
						+'in ' + (this.options.inFields.tpl ? this.options.inFields.tpl : this.default_options.inFields.tpl)
					+'</li>'
					+'{{/unbxdIf}}'
				+'{{/each}}'
			+'{{/if}}';
		}
<<<<<<< HEAD
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

								if(product.unbxdAutosuggestSrc)
									obj.unbxdSrc = product.unbxdAutosuggestSrc;

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
                            obj.pid         =  products[k].uniqueId ? products[k].uniqueId : null;

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
=======
		,preparekeywordSuggestionsHTML: function (){
			return '{{#if data.KEYWORD_SUGGESTION}}'
				+ (this.options.keywordSuggestions.header ? '<li class="unbxd-as-header">'+ this.options.keywordSuggestions.header +'</li>' : '')
				+'{{#each data.KEYWORD_SUGGESTION}}'
				+'<li class="unbxd-as-keysuggestion" data-value="{{autosuggest}}" data-index="{{@index}}" data-type="{{type}}"  data-source="{{source}}">'
					+ (this.options.keywordSuggestions.tpl ? this.options.keywordSuggestions.tpl : this.default_options.keywordSuggestions.tpl)
				+'</li>'
				+'{{/each}}'
			+'{{/if}}';
		}
		,preparetopQueriesHTML: function (){
			return '{{#if data.TOP_SEARCH_QUERIES}}'
				+ (this.options.topQueries.header ? '<li class="unbxd-as-header">'+ this.options.topQueries.header +'</li>' : '')
				+'{{#each data.TOP_SEARCH_QUERIES}}'
				+'<li class="unbxd-as-keysuggestion" data-type="{{type}}" data-index="{{@index}}" data-value="{{autosuggest}}">'
					+ (this.options.topQueries.tpl ? this.options.topQueries.tpl : this.default_options.topQueries.tpl)
				+'</li>'
				+'{{/each}}'
			+'{{/if}}';
		}
		,preparepopularProductsHTML: function (){
			return '{{#if data.POPULAR_PRODUCTS}}'
				+ (this.options.popularProducts.header ? '<li class="unbxd-as-header">'+ this.options.popularProducts.header +'</li>' : '')
				+'{{#data.POPULAR_PRODUCTS}}'
				+'<li class="unbxd-as-popular-product" data-value="{{autosuggest}}" data-index="{{@index}}" data-type="{{type}}" data-pid="{{pid}}" >'
					+ (this.options.popularProducts.tpl ? this.options.popularProducts.tpl : this.default_options.popularProducts.tpl)
				+'{{/data.POPULAR_PRODUCTS}}'
			+'{{/if}}';
		}
		,prepareHTML: function (){
			var html = '<style> .unbxd-as-popular-product-cart-button{background-color:'+this.options.theme+';}</style><ul class="unbxd-as-maincontent">',
				self = this ,
				mainlen = 0 ,
				sidelen = 0 ;
				//$(".unbxd-as-insuggestion").css("color:",this.options.theme);
			this.options.mainTpl.forEach(function(key){
				if(key === "inFields"){
					key = "IN_FIELD";
>>>>>>> jquery-unbxdautosuggest
				}
				else if(key === "popularProducts"){
					key = "POPULAR_PRODUCTS";
				}
				else if(key === "topQueries"){
					key = "TOP_SEARCH_QUERIES";
				}
				else
					key = "KEYWORD_SUGGESTION";
				mainlen=mainlen+self.currentResults[key].length;
			});

			this.options.sideTpl.forEach(function(key){
				if(key === "inFields"){
					key = "IN_FIELD";
				}
				else if(key === "popularProducts"){
					key = "POPULAR_PRODUCTS";
				}
				else if(key === "topQueries"){
					key = "TOP_SEARCH_QUERIES";
				}
				else
					key = "KEYWORD_SUGGESTION";
				sidelen=sidelen+self.currentResults[key].length;
			});
				
			if(isMobile.any()) this.options.template = '1column';

			if(this.options.template === '2column' && !this.options.sideTpl.length && !this.options.mainTpl){
				this.options.sideTpl = ['keywordSuggestions', 'topQueries'];
				this.options.mainTpl = ['inFields', 'popularProducts'];
			}

			if(this.options.template === '2column') {

				//main zero side not zero
				if((mainlen == 0)&&(sidelen != 0)){
					html = '<ul class="unbxd-as-maincontent">';
					this.options.sideTpl.forEach(function(key){
						key = 'prepare' + key + 'HTML';
						html = html + self[key]();
					});
				//html = html + '</ul><ul class="unbxd-as-maincontent">';
				}
				else{
					if(sidelen == 0){
						html = html + '<ul class="unbxd-as-maincontent">';
					}
					else{
						html = '<style> .unbxd-as-popular-product-cart-button{background-color:'+this.options.theme+';}</style><ul class="unbxd-as-sidecontent">';
						this.options.sideTpl.forEach(function(key){
						key = 'prepare' + key + 'HTML';
						html = html + self[key]();
						});
						html = html + '</ul><ul class="unbxd-as-maincontent">';
					}
				}
				 
			}
			this.options.mainTpl.forEach(function(key){
				key = 'prepare' + key + 'HTML';
				html = html + self[key]();
			});
			html = html + '</ul>';

			var cmpld = Handlebars.compile( html );
			this.log("prepraing html :-> template : " + this.options.template + " ,carts : " + this.options.showCarts + " ,cartType : " + this.options.cartType);
			this.log("html data : ",this.currentResults);
			return cmpld({
				data : this.currentResults
				,showCarts : this.options.showCarts
				,cartType : this.options.cartType
			});
		}
		,addToCache: function(q, processedData){
			if(!(q in this.cache)) this.cache[q] = $.extend({},processedData);
		}
		,inCache: function(q){
			return q in this.cache && this.cache.hasOwnProperty(q);
		}
		,getFromCache: function(q){
			return this.cache[q];
		}
		,destroy: function(self){
			self.$input.unbind('.auto');
			self.input.lastSelected = null;
			self.$input.removeAttr('autocomplete', 'off');
			self.$results.remove();
			self.$input.removeData('autocomplete');
		}
		,setOption : function(name,value){
			var a = name.split(".")

			if(a.length > 1){
				var o = this.options;
				for(var i = 0; i < a.length-1; i++){
					if(!(a[i] in o))
						o[a[i]] = {};

					o = o[a[i]]
				}

				o[a[a.length-1]] = value;
			}else
				this.options[name] = value;

			this.previous = "";
			this.$results.html("");
			this.cache = {};
			this.cache.length = 0;
		}
		,log: function(){
			//console.log("unbxd auto :",arguments);
		}
	});

	$.fn.unbxdautocomplete = function(options) {
		return this.each(function() {
			var self = this;
			
			try{
				this.auto = new autocomplete(self, options);
			}catch(e){
				//console.log('autocomplete error',e);
			}
		});
	};
};
