/*
 * Unbxd Autosuggest JS 0.0.1
 *
 * Copyright 2015, Unbxd
 *
*/
var unbxdAutoSuggestFunction = function($,Handlebars,undefined){
	var isMobile = {
	    Android: function() {
	      return navigator.userAgent.match(/Android/i);
	    },
	    BlackBerry: function() {
	      return navigator.userAgent.match(/BlackBerry/i);
	    },
	    iOS: function() {
	      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	    },
	    Opera: function() {
	      return navigator.userAgent.match(/Opera Mini/i);
	    },
	    Windows: function() {
	      return navigator.userAgent.match(/IEMobile/i);
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
			,noResultTpl: null
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
				,tpl: ['{{#if ../showCarts}}'
						,'{{#unbxdIf ../../cartType "inline"}}'//"inline" || "separate"
							,'<div class="unbxd-as-popular-product-inlinecart">'
								,'<div class="unbxd-as-popular-product-image-container">'
									,'{{#if image}}'
									,'<img src="{{image}}"/>'
									,'{{/if}}'
								,'</div>'
								,'<div  class="unbxd-as-popular-product-name">'
									,'<div style="table-layout:fixed;width:100%;display:table;">'
										,'<div style="display:table-row">'
											,'<div style="display:table-cell;text-overflow:ellipsis;overflow: hidden;white-space: nowrap;">'
												,'{{{safestring highlighted}}}'
											,'</div>'
										,'</div>'
									,'</div>'
								,'</div>'
								,'{{#if price}}'
									,'<div class="unbxd-as-popular-product-price">'
										,'{{currency}}{{price}}'
									,'</div>'
								,'{{/if}}'
								,'<div class="unbxd-as-popular-product-quantity">'
									,'<div class="unbxd-as-popular-product-quantity-container">'
										,'<span>Qty</span>'
										,'<input class="unbxd-popular-product-qty-input" value="1"/>'
									,'</div>'
								,'</div>'
								,'<div class="unbxd-as-popular-product-cart-action">'
									,'<button class="unbxd-as-popular-product-cart-button">Add to cart</button>'
								,'</div>'
							,'</div>'
						,'{{else}}'
							,'<div class="unbxd-as-popular-product-info">'
								,'<div class="unbxd-as-popular-product-image-container">'
									,'{{#if image}}'
									,'<img src="{{image}}"/>'
									,'{{/if}}'
								,'</div>'
								,'<div>'
								,'<div  class="unbxd-as-popular-product-name">'
									,'{{{safestring highlighted}}}'
								,'</div>'
							
								,'<div class="unbxd-as-popular-product-cart">'
									,'<div class="unbxd-as-popular-product-cart-action">'
										,'<button class="unbxd-as-popular-product-cart-button">Add to cart</button>'
									,'</div>'
									,'<div class="unbxd-as-popular-product-quantity">'
										,'<div class="unbxd-as-popular-product-quantity-container">'
											,'<span>Qty</span>'
											,'<input class="unbxd-popular-product-qty-input" value="1"/>'
										,'</div>'
									,'</div>'
									,'{{#if price}}'
									,'<div class="unbxd-as-popular-product-price">'
										,'{{currency}}{{price}}'
									,'</div>'
									,'{{/if}}'
								,'</div>'
								,'</div>'
							,'</div>'
						,'{{/unbxdIf}}'
					,'{{else}}'
						,'<div class="unbxd-as-popular-product-info">'
							,'<div class="unbxd-as-popular-product-image-container">'
								,'{{#if image}}'
								,'<img src="{{image}}"/>'
								,'{{/if}}'
							,'</div>'
							,'<div  class="unbxd-as-popular-product-name">'
								,'{{{safestring highlighted}}}'
							,'</div>'
							,'{{#if price}}'
								,'<div class="unbxd-as-popular-product-price">'
									,'{{currency}}{{price}}'
								,'</div>'
							,'{{/if}}'
						,'</div>'
					,'{{/if}}'].join('')
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
				.css('position', this.options.position === 'relative' ? 'absolute': this.options.position )
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
					self.selectItem(p.data());
				}else{
					self.hasFocus = false;
					self.hideResults();
				}
			});

		}
		,keyevents : function(){
			var self = this;
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

			if(this.options.showCarts)
				this.$results.find(".unbxd-as-popular-product-cart-button").css("background-color",this.options.theme);

			if(typeof this.options.processResultsStyles == "function"){
				fpos = this.options.processResultsStyles.call(this,fpos);
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
				self.$input.removeClass(self.options.loadingClass);
				self.$results.hide();
			});
		}
		,autosuggestUrl : function(){
			var host_path = this.getHostNPath();

			var url = "q=" + encodeURIComponent(this.params.q);
			if(this.options.maxSuggestions){
				url += '&inFields.count=' + this.options.maxSuggestions
				+ '&topQueries.count=' + this.options.maxSuggestions
				+ '&keywordSuggestions.count=' + this.options.maxSuggestions
				+ '&popularProducts.count=' + this.options.popularProducts.count;
				+ '&indent=off';
			}
			else{
				url += '&inFields.count=' + this.options.inFields.count
				+ '&topQueries.count=' + this.options.topQueries.count
				+ '&keywordSuggestions.count=' + this.options.keywordSuggestions.count
				+ '&popularProducts.count=' + this.options.popularProducts.count;
				+ '&indent=off';
			}

			for(var x in this.params.filters){
				if(this.params.filters.hasOwnProperty(x)){
					var a = [];
					for(var y in this.params.filters[x]){
						if(this.params.filters[x].hasOwnProperty(y)){
							a.push((x+':\"'+ encodeURIComponent(y.replace(/(^")|("$)/g, '')) +'\"').replace(/\"{2,}/g, '"'));
						}
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
				if( !this.hasFocus || data.response.numberOfProducts == 0 || "error" in data ){
					if(!this.options.noResultTpl){
						return this.hideResultsNow(this)
					}
				}
				this.processData(data);

				this.addToCache(this.params.q, this.currentResults);

				this.$results.html(this.prepareHTML());
				
				this.showResults();
			} else {
				this.hideResultsNow(this);
			}
		}
		,max_suggest: function(data){
			var infield_result = 0, topquery_result = 0, keyword_result = 0;
			var infield_sugg = Math.floor(this.options.maxSuggestions * 0.2);
			var keyword_sugg = Math.floor(this.options.maxSuggestions * 0.4);
			var topquery_sugg = Math.ceil(this.options.maxSuggestions * 0.4);
			var keyword_rem = 0,
				topquery_rem =0;
			for(var x = 0; x < data.response.products.length; x++){
				if(data.response.products[x].doctype == "IN_FIELD"){
					infield_result++;
				}
				else if(data.response.products[x].doctype == "KEYWORD_SUGGESTION"){
					keyword_result++;
				}
				else if(data.response.products[x].doctype == "TOP_SEARCH_QUERIES"){
					topquery_result++;
				}
			}

			
			if(infield_result < infield_sugg){
				var infield_rem = infield_sugg - infield_result;
				while(infield_rem > 0){
					if(keyword_result > keyword_sugg){
						if((keyword_result - keyword_sugg) >= infield_rem){
							keyword_sugg = keyword_sugg + infield_rem;
							infield_rem = 0;
						}
						else{
							infield_rem = infield_rem - keyword_result + keyword_sugg;
							keyword_sugg = keyword_result;

						}
					}
					else if(topquery_result > topquery_sugg){
						if((topquery_result - topquery_sugg) >= infield_rem){
							topquery_sugg = topquery_sugg + infield_rem;
							infield_rem = 0;
						}
						else{
							infield_rem = infield_rem - topquery_result + topquery_sugg;
							topquery_sugg = topquery_result;
						}
					}
					else
						infield_rem = 0;
				
				}
				infield_sugg = infield_result;
			}

			if(topquery_result < topquery_sugg){
				var topquery_rem = topquery_sugg - topquery_result;
				while(topquery_rem > 0 && keyword_result > keyword_sugg){
					if(keyword_result >keyword_sugg){
						if((keyword_result - keyword_sugg) >= topquery_rem){
							keyword_sugg = keyword_sugg + topquery_rem;
							topquery_rem = 0;
						}
						else{
							topquery_rem = topquery_rem - keyword_result +keyword_sugg;
							keyword_sugg =keyword_result;
						}
					}
					// else if(infield_result > infield_sugg){
					// 	if((infield_result - infield_sugg) >= topquery_rem){
					// 		infield_sugg = infield_sugg + topquery_rem;
					// 		topquery_rem = 0;
					// 	}
					// 	else{
					// 		topquery_rem = topquery_rem - infield_result + infield_sugg;
					// 		infield_sugg = infield_result;
					// 	}
					// }
					// else
					// 	topquery_rem = 0;
				}
				topquery_sugg = topquery_result;
			}
			// else{
			// 	// topquery_rem = 0;
			// 	// topquery_sugg = keyword_result;
			// }

			if(keyword_result < keyword_sugg){
				keyword_rem = keyword_sugg - keyword_result;
				while(keyword_rem > 0 && topquery_result > topquery_sugg){
					if(topquery_result > topquery_sugg){
						if((topquery_result - topquery_sugg) >= keyword_rem){
							topquery_sugg = topquery_sugg + keyword_rem;
							keyword_rem = 0;
						}
						else{
							keyword_rem = keyword_rem - topquery_result + topquery_sugg;
							topquery_sugg = topquery_result;
						}
					}
					// else if(infield_result > infield_sugg){
					// 	if((infield_result - infield_sugg) >= keyword_rem){
					// 		infield_sugg = infield_sugg + keyword_rem;
					// 		keyword_rem = 0;
					// 	}
					// 	else{
					// 		keyword_rem = keyword_rem -infield_result + infield_sugg;
					// 		keyword_sugg = keyword_result;
					// 	}
					// }
					// else
					// 	keyword_rem = 0;
				}

				keyword_sugg = keyword_result;
			}
			// else{
			// 	keyword_rem = 0;
			// 	keyword_sugg = keyword_result;
			// }
			var count = {};
			count['infields'] = infield_sugg;
			count['topquery'] = topquery_sugg;
			count['keyword'] = keyword_sugg;
			count['key_rem'] = keyword_rem;
			count['top_rem'] = topquery_rem;
			return count;
			
		}
		,isUnique:function( autosuggest, arr ){
			try{
				autosuggest = autosuggest.toLowerCase();
				var unique = true;
				for(var k=0; k<arr.length; k++){
					var suggestion = arr[k];
					if( Math.abs(suggestion.length - autosuggest.length) < 3 
						&&  (suggestion.indexOf(autosuggest) != -1 || autosuggest.indexOf(suggestion) != -1 ) ){
						unique = false;
						break;
					}
						
				}
				if(unique)
					arr.push(autosuggest);
				return unique;
			}catch(e){
				return true;
			}
		}
		,processTopSearchQuery: function(doc){
			o = {
				autosuggest : doc.autosuggest
				,highlighted : this.highlightStr(doc.autosuggest)
				,type : "TOP_SEARCH_QUERIES"
				,_original : doc.doctype
			};
			this.currentResults.TOP_SEARCH_QUERIES.push(o);
		}
		,processKeywordSuggestion: function(doc){
			o = {
				autosuggest : doc.autosuggest
				,highlighted : this.highlightStr(doc.autosuggest)
				,type : "KEYWORD_SUGGESTION"
				,_original : doc
				,source : doc.unbxdAutosuggestSrc || ""
			};
			this.currentResults.KEYWORD_SUGGESTION.push(o);
		}
		,processPopularProducts: function(doc){
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
				}else if(typeof this.options.popularProducts.priceFunctionOrKey == "string" 
					&& this.options.popularProducts.priceFunctionOrKey){
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
				}else if(typeof this.options.popularProducts.imageUrlOrFunction == "string" 
					&& this.options.popularProducts.imageUrlOrFunction){
					o.image = this.options.popularProducts.imageUrlOrFunction in doc ? doc[this.options.popularProducts.imageUrlOrFunction] : null;
				}
			}

			this.currentResults.POPULAR_PRODUCTS.push(o);
		}
		,processInFields: function(doc){
			var ins = {}
				,asrc = " " + doc.unbxdAutosuggestSrc + " "
				,highlightedtext = this.highlightStr(doc.autosuggest);

			for(var a in this.options.inFields.fields){
				if( (a+"_in") in doc && doc[a+"_in"].length && asrc.indexOf(" " +a+" ") == -1){
					ins[a] = doc[a+"_in"].slice(0, parseInt(this.options.inFields.fields[a]))
				}
			}
			if( !$.isEmptyObject(ins)){
				this.currentResults.IN_FIELD.push({
					autosuggest : doc.autosuggest
					,highlighted : highlightedtext
					,type : "keyword" //this is kept as keyword but in template it will be used as "IN_FIELD"
					,source : doc.unbxdAutosuggestSrc
				});
				infieldsCount++;

				for(var a in ins){
					for(var b = 0; b < ins[a].length; b++){		
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
				}
			}
			else{
				this.currentResults.KEYWORD_SUGGESTION.push({
					autosuggest : doc.autosuggest
					,highlighted : highlightedtext
					,type : "KEYWORD_SUGGESTION" //this is kept as keyword but in template it will be used as "IN_FIELD"
					,source : doc.unbxdAutosuggestSrc
				});
			}

		}
		,processData: function(data){
			var count;
			if(this.options.maxSuggestions){
				count = this.max_suggest(data);
			}
			this.currentResults = {
				KEYWORD_SUGGESTION : []
				,TOP_SEARCH_QUERIES : []
				,POPULAR_PRODUCTS : []
				,IN_FIELD : []
			}
			,infieldsCount = 0;
			var key_count = 0,
				uniqueInfields = [],
				uniqueSuggestions = [];


			for(var x = 0; x < data.response.products.length; x++){
				
				var doc = data.response.products[x]
					,o = {};

				if(this.options.maxSuggestions){
					if("TOP_SEARCH_QUERIES" == doc.doctype && count['topquery'] > this.currentResults.TOP_SEARCH_QUERIES.length 
						&& this.isUnique(doc.autosuggest, uniqueSuggestions) ){
						this.processTopSearchQuery(doc);
					}else if("IN_FIELD" == doc.doctype && (count['infields']+count['key_rem']+count['top_rem']) > infieldsCount 
						&& this.isUnique(doc.autosuggest, uniqueInfields)){
							if(count['infields'] > infieldsCount){
								this.processInFields(doc);
							}
							else if(count['key_rem'] + count['top_rem'] > this.currentResults.KEYWORD_SUGGESTION.length 
								&& this.isUnique(doc.autosuggest, uniqueSuggestions)){
								this.processKeywordSuggestion(doc);
							}
								
					}else if("KEYWORD_SUGGESTION" == doc.doctype  && (count['keyword'] > this.currentResults.KEYWORD_SUGGESTION.length) 
						&& this.isUnique(doc.autosuggest, uniqueInfields) ){
						this.processKeywordSuggestion(doc);
					}else if("POPULAR_PRODUCTS" == doc.doctype 
						&& this.options.popularProducts.count > this.currentResults.POPULAR_PRODUCTS.length){
						this.processPopularProducts(doc);
					}
				}else{
					if("TOP_SEARCH_QUERIES" == doc.doctype && this.options.topQueries.count > this.currentResults.TOP_SEARCH_QUERIES.length
					 && this.isUnique(doc.autosuggest, uniqueSuggestions) ){
						this.processTopSearchQuery(doc);
					}else if("IN_FIELD" == doc.doctype && this.options.inFields.count > infieldsCount 
						&& this.isUnique(doc.autosuggest, uniqueInfields) ){
						this.processInFields(doc);
					}else if("KEYWORD_SUGGESTION" == doc.doctype  
						&& (this.options.keywordSuggestions.count > this.currentResults.KEYWORD_SUGGESTION.length) 
						&& this.isUnique(doc.autosuggest, uniqueSuggestions) ){
						this.processKeywordSuggestion(doc);
					}else if("POPULAR_PRODUCTS" == doc.doctype 
						&& this.options.popularProducts.count > this.currentResults.POPULAR_PRODUCTS.length){
						this.processPopularProducts(doc);
					}
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
					+'<li class="unbxd-as-insuggestion" style="color:'+ this.options.theme +';" data-index="{{@index}}" data-type="{{type}}" data-value="{{autosuggest}}" data-filtername="{{filtername}}" data-filtervalue="{{filtervalue}}"  data-source="{{source}}">'
						+'in ' + (this.options.inFields.tpl ? this.options.inFields.tpl : this.default_options.inFields.tpl)
					+'</li>'
					+'{{/unbxdIf}}'
				+'{{/each}}'
			+'{{/if}}';
		}
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
				+'</li>'
				+'{{/data.POPULAR_PRODUCTS}}'
			+'{{/if}}';
		}
		,prepareHTML: function (){
			var html = '<ul class="unbxd-as-maincontent">',
				self = this ,
				mainlen = 0 ,
				sidelen = 0 ;
			if(!self.currentResults['IN_FIELD'].length && !self.currentResults['KEYWORD_SUGGESTION'].length 
				&& !self.currentResults['POPULAR_PRODUCTS'].length && !self.currentResults['TOP_SEARCH_QUERIES'].length && this.options.noResultTpl){

				if(typeof this.options.noResultTpl === "function"){
					html = html + '<li>'+ this.options.noResultTpl.call(self,self.params.q) +'</li>';
				}
				else if(typeof this.options.noResultTpl == "string"){
					html = html + '<li>'+ this.options.noResultTpl +'</li>';
				}
			}
			this.options.mainTpl.forEach(function(key){
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
					this.options.sideTpl.forEach(function(key){
						key = 'prepare' + key + 'HTML';
						html = html + self[key]();
					});
				}
				else{
					if(sidelen != 0){
						html = '<ul class="unbxd-as-sidecontent">';
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
			// console.log("unbxd auto :",arguments);
		}
	});

	$.fn.unbxdautocomplete = function(options) {
		return this.each(function() {
			var self = this;
			
			try{
				this.auto = new autocomplete(this, options);
			}catch(e){
				//console.log('autocomplete error',e);
			}
		});
	};
};
