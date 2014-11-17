(function($,Handlebars,undefined){
	Handlebars.registerHelper('unbxdIf', function(v1,v2,options){
		return v1 === v2 ? options.fn(this) : options.inverse(this);
	});

	Handlebars.registerHelper('unbxdlog', function(){
		console.log(arguments);
	});

	function autocomplete (input, options) {
		this.input = input;
		this.init(input, options);
	};
	
	$.extend(autocomplete.prototype, {
		default_options: {
			siteName : 'demosite-u1407617955968'
        	,APIKey : '64a4a2592a648ac8415e13c561e44991'
			,inputClass : 'ac_input'
			,resultsClass : 'unbxd-as-wrapper'
			,minChars : 3
			,delay : 400
			,loadingClass : 'ac_loading'
			,selectFirst : false
			,selectOnly : false
			,width : 0
			,zIndex : 0
			,position : 'absolute'
			,sideContentOn : "right" //"left"
			,template : "1column" // "2column"
			,showCarts : true
			,cartType : "inline" // "separate"
			,onCartClick : function(obj){}
			,onSimpleEnter : null
			,inFields:{
				count: 2,
				fields:{
					'brand':3
					,'category':3
					,'color':3
				}
			},
			topQueries:{
				count: 2
			},
			keywordSuggestions:{
				count: 2
			}
			,popularProducts:{
				count: 2
				,title:true
				,price:true
				,priceFunctionOrKey : "price"
				,image:true
				,imageUrlOrFunction: "imageUrl"
				,currency : "Rs."
			}
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
		,init: function(input, options) {
			this.options = $.extend( {}, this.default_options, options);
			this.$input = $(input).attr('autocomplete', 'off').addClass(this.options.inputClass);
			this.$results = $('<div/>', {'class' :this.options.resultsClass})
				.css('position', this.options.position)
				.hide();
			
			if(this.options.zIndex > 0)
				this.$results.css('zIndex',this.options.zIndex);

			$('body').append(this.$results);

			this.wire();
		}
		,wire: function(){
			var self = this;
			
			this.$input.bind('keydown.auto',this.keyevents());
			
			// this.$input.bind('focus.auto',function(){
			// 	self.hasFocus = true;
			// 	if(self.previous === $(this).val())
			// 		self.showResults();
			// });

			// this.$results.bind('click.auto',function(e){
			// 	self.clickOnResults = true;
			// });
			
			// this.$input.bind('blur.auto',function(e) {
			// 	self.hasFocus = false;
			// 	self.hideResults();
			// });
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
						data.quanity = parseFloat(p.find("input.unbxd-popular-product-qty-input").val());

						self.options.onCartClick.call(self,data, self.currentResults.POPULAR_PRODUCTS[parseInt(data['index'])]._original) && self.hideResults();

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
						e.preventDefault();
						self.moveSide(1);
						break;
					case 37: // left
						e.preventDefault();
						self.moveSide(-1);
						break;
					case 9:  // tab
					case 13: // return
						if( self.selectCurrent() ){
							e.preventDefault();
						}else{
							self.hideResultsNow();
						}
						break;
					default:
						self.activeRow = -1;
						
						if (self.timeout) 
							clearTimeout(self.timeout);
						
						self.timeout = setTimeout(function(){self.onChange();}, self.options.delay);
						
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
		
			if (li) {
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
			var v = $.trim(data['value']);
			
			this.previous = v;
			this.input.lastSelected = data;
			this.$results.html('');
			this.$input.val(v);
			this.hideResultsNow(this);
			
			//lets add it to analytics
			if("Unbxd" in window && "track" in window.Unbxd && typeof window.Unbxd.track == "function"){
				this.log("Pushing data to analytics",data);
				Unbxd.track( "search", {query : this.previous, autosuggestParams : { 
					type : data.type,
					suggestion : data.value,
					infield_value : data.filtervalue || null,
					infield_name : data.filtername || null,
					src_field : data.source || null,
					pid : data.pid || null
				}});
			}

			if (typeof this.options.onItemSelect == "function"){
				this.options.onItemSelect.call(this,data);
			}
		}
		,showResults: function () {
			
			var pos = this.$input.offset()
			// either use the specified width, or autocalculate based on form element
			,iWidth = (this.options.width > 0) ? this.options.width : this.$input.innerWidth()
			// reposition
			//,w = parseInt(this.$input.css("width"),10)
			,bt = parseInt(this.$input.css("border-top-width"),10)
			,bl = parseInt(this.$input.css("border-left-width"),10)
			,br = parseInt(this.$input.css("border-right-width"),10)
			//,mt = parseInt(this.$input.css("margin-top"),10)
			//,pt = parseInt(this.$input.css("padding-top"),10)
			,pb = parseInt(this.$input.css("padding-bottom"),10)
			,fwidth = (parseInt(iWidth)-2+bl+br)
			,fpos = {top : pos.top + bt + this.$input.innerHeight() + 'px',left: "auto",right: "auto"}
			,scrollDiv = document.createElement("div");

			scrollDiv.className = "scrollbar-measure";
			document.body.appendChild(scrollDiv);

			var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
            document.body.removeChild(scrollDiv);
			
			this.$results.find("ul.unbxd-as-maincontent").css("width", fwidth+"px");

			//set column direction
			if(this.options.template == "2column"){
				this.$results.removeClass("unbxd-as-extra-left unbxd-as-extra-right");
				this.$results.addClass("unbxd-as-extra-" + this.options.sideContentOn);
			}

			if(this.options.sideContentOn == "left"){
				fpos.right = window.innerWidth - fwidth - pos.left -2 - scrollbarWidth + "px";
			}else{
				fpos.left = pos.left + "px";
			}

			this.$results.css(fpos).show();
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
				} else {
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
			};

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
				}else if("IN_FIELD" == doc.doctype && this.options.inFields.count > this.currentResults.IN_FIELD.length){
					var ins = {}
						,asrc = " " + doc.unbxdAutosuggestSrc + " "
						,highlightedtext = this.highlightStr(doc.autosuggest);

					for(var a in this.options.inFields.fields){
						if( (a+"_in") in doc && doc[a+"_in"].length /*&& asrc.indexOf(" " +a+" ") == -1*/){
							ins[a] = doc[a+"_in"].slice(0, parseInt(this.options.inFields.fields[a]))
						}
					}

					this.currentResults.IN_FIELD.push({
						autosuggest : doc.autosuggest
						,highlighted : highlightedtext
						,type : "keyword" //this is kept as keyword but in template it will be used as "IN_FIELD"
						,source : doc.unbxdAutosuggestSrc
					});

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
		,prepareHTML: function (){
			var temp1 = '<ul class="unbxd-as-maincontent">'
	+'{{#if data.IN_FIELD}}'
		+'{{#each data.IN_FIELD}}'
			+'{{#unbxdIf type "keyword"}}'
			+'<li class="unbxd-as-keysuggestion" data-value="{{autosuggest}}" data-type="IN_FIELD" data-source="{{source}}">'
				+'{{{highlighted}}}'
			+'</li>'
			+'{{else}}'
			+'<li class="unbxd-as-insuggestion" data-type="{{type}}" data-value="{{autosuggest}}" data-filtername="{{filtername}}" data-filtervalue="{{filtervalue}}"  data-source="{{source}}">'
				+'in {{{highlighted}}}'
			+'</li>'
			+'{{/unbxdIf}}'
		+'{{/each}}'
	+'{{/if}}'
	+'{{#if data.KEYWORD_SUGGESTION}}'
		+'{{#each data.KEYWORD_SUGGESTION}}'
		+'<li class="unbxd-as-keysuggestion" data-value="{{autosuggest}}" data-type="{{type}}"  data-source="{{source}}">'
			+'{{{highlighted}}}'
		+'</li>'
		+'{{/each}}'
	+'{{/if}}'
	+'{{#if data.TOP_SEARCH_QUERIES}}'
		+'{{#each data.TOP_SEARCH_QUERIES}}'
		+'<li class="unbxd-as-keysuggestion" data-value="{{autosuggest}}" data-type="{{type}}">'
			+'{{{highlighted}}}'
		+'</li>'
		+'{{/each}}'
	+'{{/if}}'
	+'{{#if data.POPULAR_PRODUCTS}}'
		+'<li class="unbxd-as-header">'
			+'Popular products'
		+'</li>'
		+'{{#data.POPULAR_PRODUCTS}}'
		+'<li class="unbxd-as-popular-product" data-value="{{autosuggest}}" data-index="{{@index}}" data-type="{{type}}" data-pid="{{pid}}" >'
			+'{{#if ../showCarts}}'
				+'{{#unbxdIf ../../cartType "inline"}}'
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
										+'{{{highlighted}}}'
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
							+'{{{highlighted}}}'
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
						+'{{{highlighted}}}'
					+'</div>'
				+'</div>'
			+'{{/if}}'
		+'</li>'
		+'{{/data.POPULAR_PRODUCTS}}'
	+'{{/if}}'
+'</ul>'
			,temp2 = '<ul class="unbxd-as-sidecontent">'
						+'{{#if data.KEYWORD_SUGGESTION}}'
							+'<li class="unbxd-as-header">'
								+'Keyword Suggestions'
							+'</li>'
							+'{{#each data.KEYWORD_SUGGESTION}}'
							+'<li class="unbxd-as-keysuggestion" data-value="{{autosuggest}}" data-type="{{type}}"  data-source="{{source}}">'
								+'{{{highlighted}}}'
							+'</li>'
							+'{{/each}}'
						+'{{/if}}'
						+'{{#if data.TOP_SEARCH_QUERIES}}'
							+'<li class="unbxd-as-header">'
								+'Top Queries'
							+'</li>'
							+'{{#each data.TOP_SEARCH_QUERIES}}'
							+'<li class="unbxd-as-keysuggestion" data-type="{{type}}" data-value="{{autosuggest}}">'
								+'{{{highlighted}}}'
							+'</li>'
							+'{{/each}}'
						+'{{/if}}'
					+'</ul>'
					+'<ul class="unbxd-as-maincontent">'
						+'{{#if data.IN_FIELD}}'
							+'{{#each data.IN_FIELD}}'
								+'{{#unbxdIf type "keyword"}}'
								+'<li class="unbxd-as-keysuggestion" data-type="IN_FIELD" data-value="{{autosuggest}}"  data-source="{{source}}">'
									+'{{{highlighted}}}'
								+'</li>'
								+'{{else}}'
								+'<li class="unbxd-as-insuggestion" data-type="{{type}}" data-value="{{autosuggest}}" data-filtername="{{filtername}}" data-filtervalue="{{filtervalue}}"  data-source="{{source}}">'
									+'in {{{highlighted}}}'
								+'</li>'
								+'{{/unbxdIf}}'
							+'{{/each}}'
						+'{{/if}}'
						+'{{#if data.POPULAR_PRODUCTS}}'
							+'<li class="unbxd-as-header">'
								+'Popular products'
							+'</li>'
							+'{{#data.POPULAR_PRODUCTS}}'
							+'<li class="unbxd-as-popular-product" data-value="{{autosuggest}}" data-index="{{@index}}" data-type="{{type}}" data-pid="{{pid}}" >'
								+'{{#if ../showCarts}}'
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
															+'{{{highlighted}}}'
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
												+'{{{highlighted}}}'
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
											+'{{{highlighted}}}'
										+'</div>'
									+'</div>'
								+'{{/if}}'
							+'</li>'
							+'{{/data.POPULAR_PRODUCTS}}'
						+'{{/if}}'
					+'</ul>';
			var cmpld = Handlebars.compile( this.options.template == "2column" ? temp2 : temp1);
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
			self.$input.removeAttr('autocomplete', 'off').removeClass(self.options.inputClass);
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
			console.log(new Date(),arguments);
		}
	});

	$.fn.autocomplete = function(options) {
		return this.each(function() {
			var self = this;
			
			try{
				this.auto = new autocomplete(self, options);
			}catch(e){
				console.log('autocomplete error',e);
			}
		});
	};
})(jQuery,Handlebars);