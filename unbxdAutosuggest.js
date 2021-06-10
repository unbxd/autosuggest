/*
 * Unbxd Autosuggest JS 0.0.1
 *
 * Copyright 2015, Unbxd
 *
*/
var unbxdAutoSuggestFunction = function ($, Handlebars, params) {
	//use unbxd scope and add a version for autosuggest
	window.Unbxd = window.Unbxd || {};
	Unbxd.autosuggestVersion = "1.0.1";

	// Polyfill for window.location.origin 
	if (!window.location.origin) {
		window.location.origin = window.location.protocol + "//"
			+ window.location.hostname
			+ (window.location.port ? ':' + window.location.port : '');
	}

	// Production steps of ECMA-262, Edition 5, 15.4.4.18
	// Reference: http://es5.github.io/#x15.4.4.18
	if (!Array.prototype.forEach) {

		Array.prototype.forEach = function (callback, thisArg) {

			var T, k;

			if (this == null) {
				throw new TypeError(' this is null or not defined');
			}

			// 1. Let O be the result of calling ToObject passing the |this| value as the argument.
			var O = Object(this);

			// 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
			// 3. Let len be ToUint32(lenValue).
			var len = O.length >>> 0;

			// 4. If IsCallable(callback) is false, throw a TypeError exception.
			// See: http://es5.github.com/#x9.11
			if (typeof callback !== "function") {
				throw new TypeError(callback + ' is not a function');
			}

			// 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
			if (arguments.length > 1) {
				T = thisArg;
			}

			// 6. Let k be 0
			var k = 0;

			// 7. Repeat, while k < len
			while (k < len) {

				var kValue;

				// a. Let Pk be ToString(k).
				//   This is implicit for LHS operands of the in operator
				// b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
				//   This step can be combined with c
				// c. If kPresent is true, then
				if (k in O) {

					// i. Let kValue be the result of calling the Get internal method of O with argument Pk.
					kValue = O[k];

					// ii. Call the Call internal method of callback with T as the this value and
					// argument list containing kValue, k, and O.
					callback.call(T, kValue, k, O);
				}
				// d. Increase k by 1.
				k++;
			}
			// 8. return undefined
		};
	}

	// Production steps of ECMA-262, Edition 5, 15.4.4.14
	// Reference: http://es5.github.io/#x15.4.4.14
	if (!Array.prototype.indexOf) {
		Array.prototype.indexOf = function (searchElement, fromIndex) {

			var k;

			// 1. Let O be the result of calling ToObject passing
			//    the this value as the argument.
			if (this == null) {
				throw new TypeError('"this" is null or not defined');
			}

			var O = Object(this);

			// 2. Let lenValue be the result of calling the Get
			//    internal method of O with the argument "length".
			// 3. Let len be ToUint32(lenValue).
			var len = O.length >>> 0;

			// 4. If len is 0, return -1.
			if (len === 0) {
				return -1;
			}

			// 5. If argument fromIndex was passed let n be
			//    ToInteger(fromIndex); else let n be 0.
			var n = +fromIndex || 0;

			if (Math.abs(n) === Infinity) {
				n = 0;
			}

			// 6. If n >= len, return -1.
			if (n >= len) {
				return -1;
			}

			// 7. If n >= 0, then Let k be n.
			// 8. Else, n<0, Let k be len - abs(n).
			//    If k is less than 0, then let k be 0.
			k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

			// 9. Repeat, while k < len
			while (k < len) {
				// a. Let Pk be ToString(k).
				//   This is implicit for LHS operands of the in operator
				// b. Let kPresent be the result of calling the
				//    HasProperty internal method of O with argument Pk.
				//   This step can be combined with c
				// c. If kPresent is true, then
				//    i.  Let elementK be the result of calling the Get
				//        internal method of O with the argument ToString(k).
				//   ii.  Let same be the result of applying the
				//        Strict Equality Comparison Algorithm to
				//        searchElement and elementK.
				//  iii.  If same is true, return k.
				if (k in O && O[k] === searchElement) {
					return k;
				}
				k++;
			}
			return -1;
		};
	}

	var topQuery = ''
	var isMobile = {
		Android: function () {
			return navigator.userAgent.match(/Android/i);
		},
		BlackBerry: function () {
			return navigator.userAgent.match(/BlackBerry/i);
		},
		iOS: function () {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
		Opera: function () {
			return navigator.userAgent.match(/Opera Mini/i);
		},
		Windows: function () {
			return navigator.userAgent.match(/IEMobile/i);
		},
		any: function () {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
	};

	var isDesktop = function () {
		return !(typeof (this.options.isMobile) === "function" ? this.options.isMobile() : isMobile.any());
	}

	var customSort = function (a, b) {
		if (a.length - b.length === 0) {
			return a.localeCompare(b);
		}
		else {
			return a.length - b.length;
		}
	}

	Handlebars.registerHelper('unbxdIf', function (v1, v2, options) {
		return v1 === v2 ? options.fn(this) : options.inverse(this);
	});

	Handlebars.registerHelper('safestring', function (value) {
		return new Handlebars.SafeString(value);
	});

	function autocomplete(input, options) {
		this.input = input;
		this.init(input, options);
	};

	function debounce(func, wait, immediate) {
		var timeout;
		return function () {
			var context = this, args = arguments;
			var later = function () {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	};

	window.autoSuggestObj = $.extend(autocomplete.prototype, {
		default_options: {
			siteName: 'demosite-u1407617955968'
			, APIKey: '64a4a2592a648ac8415e13c561e44991'
			, integrations: {} // can have an object of integrations
			/* The value of integrations can be an object with
			 * key - `classical` or `universal`(2 types of GA integrations)
			 * value - can either be a boolean value or the
			 *         value of the global object in string
			 * if the value is boolean, then for a `classical` integration
			 * the default value will be '_gaq' and for `universal` the
			 * default value will be 'ga'
			 * integrations: {
			 *   'classical': true
			 * }
			 * integrations: {
			 *   'universal': 'ga'
			 * }
			 */
			, resultsClass: 'unbxd-as-wrapper'
			, minChars: 3
			, delay: 100
			, loadingClass: 'unbxd-as-loading'
			, mainWidth: 0
			, sideWidth: 180
			, zIndex: 10000
			, position: 'absolute'
			, sideContentOn: "right" //"left"
			, template: "1column" // "2column"
			, theme: "#ff8400"
			, hideOnResize: false
			, mainTpl: ['inFields', 'keywordSuggestions', 'topQueries', 'popularProducts', 'promotedSuggestions']
			, sideTpl: []
			, showCarts: true // will be used in default template of popular products
			, cartType: "inline" // "separate" will be used in default template popular products
			, onCartClick: function (obj) { }
			, hbsHelpers: null // handlebar helper functions
			, onSimpleEnter: null
			, onItemSelect: null
			, noResultTpl: null
			, mobile: {
				template: "1column",
				mainTpl: ['inFields', 'keywordSuggestions', 'topQueries', 'promotedSuggestions', 'popularProducts'],
				popularProducts: {
					count: 2
				}
			}
			, trendingSearches: {
				enabled: true,
				tpl: "{{{safestring highlighted}}}",
				maxCount: 6,
				preferInputWidthTrending: true
			}
			, inFields: {
				count: 2
				, fields: {
					'brand': 3
					, 'category': 3
					, 'color': 3
				}
				, header: ""
				, tpl: "{{{safestring highlighted}}}"
			},
			topQueries: {
				count: 2
				, hidden: false
				, header: ""
				, tpl: "{{{safestring highlighted}}}"
			},
			keywordSuggestions: {
				count: 2
				, header: ""
				, tpl: "{{{safestring highlighted}}}"
			}
			, promotedSuggestions: {
				count: 3,
				tpl: "{{{safestring highlighted}}}"
			}
			, suggestionsHeader: ''
			, popularProducts: {
				count: 2
				, price: true
				, priceFunctionOrKey: "price"
				, name: true
				, nameFunctionOrKey: "title"
				, salePrice: false
				, salePriceKey: ''
				, image: true
				, imageUrlOrFunction: "imageUrl"
				, currency: "Rs."
				, header: ""
				, view: 'list'
				, tpl: ['{{#if ../showCarts}}'
					, '{{#unbxdIf ../../cartType "inline"}}'//"inline" || "separate"
					, '<div class="unbxd-as-popular-product-inlinecart">'
					, '<div class="unbxd-as-popular-product-image-container">'
					, '{{#if image}}'
					, '<img src="{{image}}" alt="{{autosuggest}}"/>'
					, '{{/if}}'
					, '</div>'
					, '<div  class="unbxd-as-popular-product-name popular-title">'
					, '<div style="table-layout:fixed;width:100%;display:table;">'
					, '<div style="display:table-row">'
					, '<div style="display:table-cell;text-overflow:ellipsis;overflow: hidden;white-space: nowrap;">'
					, '{{{safestring highlighted}}}'
					, '</div>'
					, '</div>'
					, '</div>'
					, '</div>'
					, '{{#if price}}'
					, '<div class="unbxd-as-popular-product-price">'
					, '{{#if salePrice}}'
					, '<span class="regular-price">'
					, '{{currency}}{{price}}'
					, '</span>'
					, '<span class="unbxd-as-discount">'
					, '{{currency}}{{salePrice}}'
					, '</span>'
					, '{{else}}'
					, '{{currency}}{{price}}'
					, '{{/if}}'
					, '</div>'
					, '{{/if}}'
					, '<div class="unbxd-as-popular-product-quantity">'
					, '<div class="unbxd-as-popular-product-quantity-container">'
					, '<span>Qty</span>'
					, '<input class="unbxd-popular-product-qty-input" value="1"/>'
					, '</div>'
					, '</div>'
					, '<div class="unbxd-as-popular-product-cart-action">'
					, '<button class="unbxd-as-popular-product-cart-button">Add to cart</button>'
					, '</div>'
					, '</div>'
					, '{{else}}'
					, '<div class="unbxd-as-popular-product-info">'
					, '<div class="unbxd-as-popular-product-image-container">'
					, '{{#if image}}'
					, '<img src="{{image}}" alt="{{autosuggest}}"/>'
					, '{{/if}}'
					, '</div>'
					, '<div>'
					, '<div  class="unbxd-as-popular-product-name popular-title">'
					, '{{{safestring highlighted}}}'
					, '</div>'

					, '<div class="unbxd-as-popular-product-cart">'
					, '<div class="unbxd-as-popular-product-cart-action">'
					, '<button class="unbxd-as-popular-product-cart-button">Add to cart</button>'
					, '</div>'
					, '<div class="unbxd-as-popular-product-quantity">'
					, '<div class="unbxd-as-popular-product-quantity-container">'
					, '<span>Qty</span>'
					, '<input class="unbxd-popular-product-qty-input" value="1"/>'
					, '</div>'
					, '</div>'
					, '{{#if price}}'
					, '<div class="unbxd-as-popular-product-price">'
					, '{{#if salePrice}}'
					, '<span class="regular-price">'
					, '{{currency}}{{price}}'
					, '</span>'
					, '<span class="unbxd-as-discount">'
					, '{{currency}}{{salePrice}}'
					, '</span>'
					, '{{else}}'
					, '{{currency}}{{price}}'
					, '{{/if}}'
					, '</div>'
					, '{{/if}}'
					, '</div>'
					, '</div>'
					, '</div>'
					, '{{/unbxdIf}}'
					, '{{else}}'
					, '<div class="unbxd-as-popular-product-info">'
					, '<div class="unbxd-as-popular-product-image-container">'
					, '{{#if image}}'
					, '<img src="{{image}}" alt="{{autosuggest}}"/>'
					, '{{/if}}'
					, '</div>'
					, '<div  class="unbxd-as-popular-product-name popular-title">'
					, '{{{safestring highlighted}}}'
					, '</div>'
					, '{{#if price}}'
					, '<div class="unbxd-as-popular-product-price">'
					, '{{#if salePrice}}'
					, '<span class="regular-price">'
					, '{{currency}}{{price}}'
					, '</span>'
					, '<span class="unbxd-as-discount">'
					, '{{currency}}{{salePrice}}'
					, '</span>'
					, '{{else}}'
					, '{{currency}}{{price}}'
					, '{{/if}}'
					, '</div>'
					, '{{/if}}'
					, '</div>'
					, '{{/if}}'].join(''),
				viewMore: {
					enabled: false,
					tpl: "",
					redirect: function () {

					}
				}
			}
			, removeDuplicates: false
			, filtered: false
			, preferInputWidthTotalContent: false
			, platform: 'com'
			, sortedSuggestions: {
				tpl: "{{{safestring highlighted}}}"
			}
			, removeOnBackButton: false
			, resultsContainerSelector: null
			, processResultsStyles: null
			, inputContainerSelector: ''
            , getProductsInfo: function (that) {
                return that.productInfo;
            }
			,searchEndPoint: '//search.unbxd.io'
		}
        , productInfo: {}
		, $input: null
		, $results: null
		, timeout: null
		, previous: ''
		, activeRow: -1//keeps track of focused result in navigation
		, activeColumn: 0
		, keyb: false
		, compiledPopularProductHeader: ''
		, hasFocus: false
		, lastKeyPressCode: null
		, ajaxCall: null//keeps track of current ajax call
		, currentResults: []
		, currentTopResults: []
		, cache: {}
		, params: {
			query: '*'
			, filters: {}
		}
		, preferOneColumnFullWidth: false
		, selectedClass: "unbxd-ac-selected"
		, scrollbarWidth: null
        , getPopularProductsHeader: function(ctxt) {
            var popularProductsHeader = ctxt.options.popularProducts.header;
            var ppHeader = "";
            if (typeof popularProductsHeader === "string") {
                ppHeader = popularProductsHeader;
            } else if (typeof popularProductsHeader === "function") {
                ppHeader = popularProductsHeader(ctxt);
            }
            return ppHeader;
        }
		, init: function (input, options) {
			this.options = $.extend({}, this.default_options, options);
			this.setDefaultPopularProductsOptions();
			this.setDefaultOptions();
			this.getPopularProductFields();
			this.$input = $(input).attr('autocomplete', 'off');
			this.$results = $('<div/>', { 'class': this.options.resultsClass + ' ' + 'unbxd-as-overall-autosuggest' })
				.css('position', this.options.position === 'relative' ? 'absolute' : this.options.position)
				.hide();
			if (this.options.zIndex > 0)
				this.$results.css('zIndex', this.options.zIndex);

			if (typeof this.options.resultsContainerSelector == "string" && this.options.resultsContainerSelector.length)
				$(this.options.resultsContainerSelector).append(this.$results);
			else
				$("body").append(this.$results);

			if (typeof this.options.hbsHelpers === 'function')
				this.options.hbsHelpers.call(this)

			// Render trending Search
			if (this.options.trendingSearches.enabled) {
				this.trendingQueries = [];
				var trendingUrl = (this.options.searchEndPoint ? this.options.searchEndPoint + "/" : "https://search.unbxd.io/") + this.options.APIKey + "/" + this.options.siteName + "/autosuggest?trending-queries=true&q=*";
				var that = this;
				$.ajax({
					url: trendingUrl,
					method: "GET"
				})
					.done(function (data) {
						if (data && data.response.products && data.response.products.length > 0) {
							var products = data.response.products.splice(0, that.options.trendingSearches.maxCount);
							that.clickResults.TRENDING_QUERIES = products;
							for (var i = 0; i < products.length; i++) {
								var doc = products[i];
								that.processTrendingQueries(doc);
							}
							that.$results.html('');
							var cmpld = Handlebars.compile(that.prepareTrendingQueriesHTML());
							that.$results.html(cmpld({
								data1: that.trendingQueries
							}));
						}
					})
					.fail(function (xhr) {
						console.log('error', xhr);
					});
			}

			this.wire();
		}
		, wire: function () {
			var self = this;

			this.$input.bind('keydown.auto', this.keyevents());

			this.$input.bind('select.auto', function () {
				self.log("select : setting focus");
				self.hasFocus = true;
			});
			$(".unbxd-as-wrapper").on("mouseover", "ul.unbxd-as-maincontent", function (e) {
				if ($.contains(self.$results[0], e.target) && self.options.filtered) {
					$("." + self.selectedClass).removeClass(self.selectedClass);
					$(e.target).addClass(self.selectedClass);
					var $et = $(e.target), p = $et;
					self.hasFocus = false;
					if (e.target.tagName !== "LI") {
						p = $et.parents("li")
					}
					var dataValue = $(p).attr('data-value') ? $(p).attr('data-value') : '';
					var dataFiltername = $(p).attr('data-filtername') ? $(p).attr('data-filtername') : '';
					var dataFiltervalue = $(p).attr('data-filtervalue') ? $(p).attr('data-filtervalue') : '';
					if (!p || p.hasClass("unbxd-as-header") || p.hasClass("unbxd-as-popular-product") || p.hasClass("topproducts") || e.target.tagName === "INPUT")
						return;
					if (dataValue) {
						var query = dataValue + (dataFiltername != '' ? ':' + dataFiltername + ':' + dataFiltervalue : '')
						// updating product header while hovering on suggestions
						if (self.options.filtered) {
                            var ppHeader = self.getPopularProductsHeader(self);
							var cmpldHeader = Handlebars.compile(ppHeader);
							self.compiledPopularProductHeader = cmpldHeader({ hoverSuggestion: dataValue });
						}

						var cmpld = ""
						if (self.options.popularProducts.viewMore && self.options.popularProducts.viewMore.enabled) {
                            if (self.options.template === "1column") {
                                $('.unbxd-as-maincontent').addClass("unbxd-as-view-more")
                            } else {
                                $('.unbxd-as-sidecontent').addClass("unbxd-as-view-more")
                            }
							cmpld = Handlebars.compile(self.preparefilteredPopularProducts() + self.options.popularProducts.viewMore.tpl);
						} else {
							cmpld = Handlebars.compile(self.preparefilteredPopularProducts());
						}

						if (self.currentTopResults[query] && self.currentTopResults[query].length > 0) {
							$('.unbxd-as-sidecontent').html(cmpld({
								data: self.currentTopResults[query]
								, showCarts: self.options.showCarts
								, cartType: self.options.cartType
							}));
						}
						else {
							$('.unbxd-as-sidecontent').html(cmpld({
								data: self.currentResults.POPULAR_PRODUCTS
								, showCarts: self.options.showCarts
								, cartType: self.options.cartType
							}));
						}
						self.hoveredQuery = dataValue;
					}
					if (self.options.popularProducts.view === 'grid' && self.options.popularProducts.rowCount) {
						$('.unbxd-as-sidecontent').find("li.unbxd-as-popular-product-grid").css("width", (100 / self.options.popularProducts.rowCount) + "%");
					}
				}

			});

			$(window).bind('resize', function () {
				if (self.options.hideOnResize) {
					self.hideResults();
				}
			});

			/** For single page applications, on browser back, the autosuggest doesn't remove */
			window.addEventListener('popstate', function (event) {
				if (self.options.removeOnBackButton) {
					$('.unbxd-as-wrapper').remove();
				}
			});

			$(document).bind("click.auto", function (e) {
				if (e.target == self.input) {
					self.log("clicked on input : focused");
					self.hasFocus = true;
					if (self.previous === self.$input.val())
						if (self.$results.find(".unbxd-as-trending").length) {
							self.showResults();
						} else if (self.$results.find(".unbxd-as-maincontent").length || self.$results.find(".unbxd-as-sidecontent").length) {
							self.$results.html(self.prepareHTML());
							self.showResults();
						} else {
							self.showResults();
						}
				} else if (e.target == self.$results[0]) {
					self.log("clicked on results block : selecting")
					self.hasFocus = false;
				} else if ($(e.target).hasClass("unbxd-as-view-more")) {
					self.options.popularProducts.viewMore.redirect(self.hoveredQuery || self.$input.val())
				} else if ($.contains(self.$results[0], e.target)) {
					self.log("clicked on element for selection", e.target.tagName);
					var $et = $(e.target), p = $et;

					self.hasFocus = false;

					if (e.target.tagName !== "LI") {
						p = $et.parents("li");
					}

					if (!p || p.hasClass(".unbxd-as-header") || e.target.tagName == "INPUT")
						return;

					if (e.target.tagName == "BUTTON" && $et.hasClass("unbxd-as-popular-product-cart-button") && typeof self.options.onCartClick == "function") {
						self.log("BUTTON click");
						var data = p.data();
						data.quantity = parseFloat(p.find("input.unbxd-popular-product-qty-input").val());

						self.addToAnalytics("click", {
							pr: parseInt(data.index) + 1
							, pid: data.pid || null
							, url: window.location.href
						});

						self.options.onCartClick.call(self, data, self.currentResults.POPULAR_PRODUCTS[parseInt(data['index'])]._original) && self.hideResults();

						self.addToAnalytics("addToCart", {
							pid: data.pid || null
							, url: window.location.href
						});

						return;
					}
					self.selectItem(p.data(), e);
				} else {
					self.hasFocus = false;
					self.hideResults();
				}
			});
			if (self.options.trendingSearches.enabled && self.clickResults.TRENDING_QUERIES.length) {
				$(document).bind("keyup.auto", function (e) {
					if (e.target.value === "") {
						self.$results.html('');
						var cmpld = Handlebars.compile(self.prepareTrendingQueriesHTML());
						self.$results.html(cmpld({
							data1: self.trendingQueries
						}));
						self.showResults();
					}
				});
			}
		}
		, keyevents: function () {
			var self = this;
			if (params && params.selfServe) {
				self.onChange();
			} else {
				return function (e) {
					self.lastKeyPressCode = e.keyCode;
					self.lastKeyEvent = e;

					switch (e.keyCode) {
						case 38: // up
							e.preventDefault();
							self.moveSelect(-1);
							break;
						case 40: // down
							e.preventDefault();
							self.moveSelect(1);
							break;
						case 39: // right
							if (self.activeRow > -1) {
								e.preventDefault();
								self.moveSide(1);
							}
							break;
						case 37: // left
							if (self.activeRow > -1) {
								e.preventDefault();
								self.moveSide(-1);
							}
							break;
						case 9:  // tab
						case 13: // return
							if (self.selectCurrent(e)) {
								e.preventDefault();
							}
							else {
								self.hideResultsNow();
							}
							break;
						default:
							self.activeRow = -1;
							self.hasFocus = true;

							if (self.timeout)
								clearTimeout(self.timeout);

							self.timeout = setTimeout(debounce(function () { self.onChange(); }, 250), self.options.delay);

							break;
					}
				}
			}
		}
		, moveSide: function (step) {
			//step : 1 -> right click
			//step : -1 ->left click
			var newcolumn = this.activeColumn;
			if (this.options.template == "2column") {
				//if(this.options.sideContentOn == "left" && ((this.activeColumn == 0 && step == -1) || (this.activeColumn == 1 && step == 1)))
				if (this.options.sideContentOn == "left") {
					(this.activeColumn == 0 && step == -1) && (newcolumn = 1);
					(this.activeColumn == 1 && step == 1) && (newcolumn = 0);
				} else {//it is on right
					(this.activeColumn == 0 && step == 1) && (newcolumn = 1);
					(this.activeColumn == 1 && step == -1) && (newcolumn = 0);
				}

				if (newcolumn != this.activeColumn) {
					this.activeColumn = newcolumn;
					this.activeRow = -1
					this.moveSelect(1);
				}
			}
		}
		, moveSelect: function (step) {
			var lis = this.$results.find("ul." + (this.activeColumn ? "unbxd-as-sidecontent" : "unbxd-as-maincontent")).find('li:not(.unbxd-as-header)');

			if (!lis) return;

			this.activeRow += step;

			if (this.activeRow < -1)
				this.activeRow = (typeof (lis.size) === "function" ? lis.size() : lis.length) - 1;
			else if (this.activeRow == -1)
				this.$input.focus();
			else if (this.activeRow >= (typeof (lis.size) === "function" ? lis.size() : lis.length)) {
				this.activeRow = -1;
				this.$input.focus();
			}

			$("." + this.selectedClass).removeClass(this.selectedClass);

			$(lis[this.activeRow]).addClass(this.selectedClass);

			if (this.activeRow >= 0 && this.activeRow < (typeof (lis.size) === "function" ? lis.size() : lis.length)) {
				this.$input.val($(lis[this.activeRow]).data('value'));
				if (this.options.filtered && this.activeColumn === 0) {
					var dataValue = $(lis[this.activeRow]).attr('data-value') ? $(lis[this.activeRow]).attr('data-value') : '';
					var dataFiltername = $(lis[this.activeRow]).attr('data-filtername') ? $(lis[this.activeRow]).attr('data-filtername') : '';
					var dataFiltervalue = $(lis[this.activeRow]).attr('data-filtervalue') ? $(lis[this.activeRow]).attr('data-filtervalue') : '';
					var query = dataValue + (dataFiltername != '' ? ':' + dataFiltername + ':' + dataFiltervalue : '')
					// updating product header while hovering on suggestions
					if (this.options.filtered) {
                        var ppHeader = this.getPopularProductsHeader(this);
						var cmpldHeader = Handlebars.compile(ppHeader);
						this.compiledPopularProductHeader = cmpldHeader({ hoverSuggestion: dataValue });
					}

					var cmpld = ""
					if (this.options.popularProducts.viewMore && this.options.popularProducts.viewMore.enabled) {
						$('.unbxd-as-sidecontent').addClass("unbxd-as-view-more")
						cmpld = Handlebars.compile(this.preparefilteredPopularProducts() + this.options.popularProducts.viewMore.tpl);
					} else {
						cmpld = Handlebars.compile(this.preparefilteredPopularProducts());
					}

					if (this.currentTopResults[query] && this.currentTopResults[query].length > 0) {
						$('.unbxd-as-sidecontent').html(cmpld({
							data: this.currentTopResults[query]
							, showCarts: this.options.showCarts
							, cartType: this.options.cartType
						}));
					}
					else {
						$('.unbxd-as-sidecontent').html(cmpld({
							data: this.currentResults.POPULAR_PRODUCTS
							, showCarts: this.options.showCarts
							, cartType: this.options.cartType
						}));
					}

					if (this.options.popularProducts.view === 'grid' && this.options.popularProducts.rowCount) {
						this.$results.find("ul li.unbxd-as-popular-product-grid").css("width", (100 / this.options.popularProducts.rowCount) + "%");
					}

				}
			}
			else if (this.activeRow == -1) {
				this.$input.val(this.previous);
				if (this.options.filtered) {

					var cmpld = ""
					if (this.options.popularProducts.viewMore && this.options.popularProducts.viewMore.enabled) {
						$('.unbxd-as-sidecontent').addClass("unbxd-as-view-more")
						cmpld = Handlebars.compile(this.preparefilteredPopularProducts() + this.options.popularProducts.viewMore.tpl);
					} else {
						cmpld = Handlebars.compile(this.preparefilteredPopularProducts());
					}

					if (this.currentTopResults[this.previous] && this.currentTopResults[this.previous].length > 0)
						$('.unbxd-as-sidecontent').html(cmpld({
							data: this.currentTopResults[this.previous]
							, showCarts: this.options.showCarts
							, cartType: this.options.cartType
						}));
					else
						$('.unbxd-as-sidecontent').html(cmpld({
							data: this.currentResults.POPULAR_PRODUCTS
							, showCarts: this.options.showCarts
							, cartType: this.options.cartType
						}));

					if (this.options.popularProducts.view === 'grid' && this.options.popularProducts.rowCount) {
						this.$results.find("ul li.unbxd-as-popular-product-grid").css("width", (100 / this.options.popularProducts.rowCount) + "%");
					}
				}
			}
		}
		, selectCurrent: function (e) {
			var li = this.$results.find('li.' + this.selectedClass), self = this;
			if (li.length) {
				this.selectItem(li.data(), e);
				return true;
			} else {
				if (typeof this.options.onSimpleEnter == "function" && (this.lastKeyPressCode == 10 || this.lastKeyPressCode == 13)) {
					this.lastKeyEvent.preventDefault();
					self.options.onSimpleEnter.call(self, e);
				}

				return false;
			}
		}
		, selectItem: function (data, e) {
			if (!('value' in data))
				return;
			this.log("selected Item : ", data);
			var v = $.trim(data['value']), prev = this.previous;

			this.previous = v;
			this.input.lastSelected = data;
			this.$results.html('');
			this.$input.val(v);
			this.hideResultsNow(this);

			this.addToAnalytics("search", {
				query: data.value, autosuggestParams: {
					autosuggest_type: data.type
					, autosuggest_suggestion: data.value
					, field_value: data.filtervalue || null
					, field_name: data.filtername || null
					, src_field: data.source || null
					, pid: data.pid || null
					, unbxdprank: parseInt(data.index, 10) + 1 || 0
					, internal_query: prev
				}
			});

			if (typeof this.options.onItemSelect == "function" && data.type !== "POPULAR_PRODUCTS_FILTERED") {
				if (data.sorted) {
					this.options.onItemSelect.call(this, data, this.currentResults['SORTED_SUGGESTIONS'][parseInt(data['index'])]._original, e);
				}
				else {
					this.options.onItemSelect.call(this, data, this.currentResults[data.type][parseInt(data['index'])]._original, e);
				}
			} else if (data.type === "POPULAR_PRODUCTS_FILTERED") {
				this.options.onItemSelect.call(this, data, this.currentTopResults[data.src][parseInt(data['index'])]._original, e);
			}
		}
		, addToAnalytics: function (type, obj) {
			if ("Unbxd" in window && "track" in window.Unbxd && typeof window.Unbxd.track == "function") {
				this.log("Pushing data to analytics", type, obj);
				Unbxd.track(type, obj);
			}
			if (type !== 'search') return;

			if ('classical' in this.options.integrations) {
				this.trackclassical(type, obj);
			}
			if ('universal' in this.options.integrations) {
				this.trackuniversal(type, obj);
			}
		}
		, getEventAction: function (autosuggestType) {
			var types = {
				'IN_FIELD': 'Scope_Click',
				'POPULAR_PRODUCTS': 'Pop_Click',
				'KEYWORD_SUGGESTION': 'TQ_Click',
				'TOP_SEARCH_QUERIES': 'TQ_Click',
				'POPULAR_PRODUCTS_FILTERED': 'Filtered_Pop_Click',
				'PROMOTED_SUGGESTION': 'TQ_Click',
			}
			return types[autosuggestType];
		}
		, getEventLabel: function (autosuggest) {
			var params = autosuggest.autosuggestParams;
			var value = params.autosuggest_suggestion;
			var index = params.unbxdprank;
			var filter = params.field_name && params.field_value ?
				params.field_name + ':' + params.field_value : undefined;
			var types = {
				'IN_FIELD': value + (filter ? '&filter=' + filter : '') + '-' + index,
				'POPULAR_PRODUCTS': value + '-' + index,
				'KEYWORD_SUGGESTION': value + '-' + index,
				'TOP_SEARCH_QUERIES': value + '-' + index,
				'POPULAR_PRODUCTS_FILTERED': value + '-' + index,
				'PROMOTED_SUGGESTION': value + '-' + index
			};
			return types[params.autosuggest_type];
		}
		, trackclassical: function (type, obj) {
			var key = this.options.integrations['classical'],
				eventAction = this.getEventAction(obj.autosuggestParams.autosuggest_type),
				eventLabel = this.getEventLabel(obj),
				value = 1;
			if (key) {
				if (key === true) key = '_gaq';
				if (window[key])
					window[key].push(['_trackEvent', 'U_Autocomplete', eventAction, eventLabel, value, true])
			}
		}
		, trackuniversal: function (type, obj) {
			var key = this.options.integrations['universal'],
				eventAction = this.getEventAction(obj.autosuggestParams.autosuggest_type),
				eventLabel = this.getEventLabel(obj),
				value = 1;

			if (key) {
				if (key === true) key = 'ga';
				if (window[key])
					window[key]('send', 'event', 'U_Autocomplete', eventAction, eventLabel, value, { 'nonInteraction': 1 });
			}
		}
		, showResults: function () {
			if (this.options.width) {
				this.options.mainWidth = this.options.width;
			}

			var posSelector = this.options.inputContainerSelector ? $(this.options.inputContainerSelector) : this.$input;
			var pos = posSelector.offset();
			var totalWidth = '';
			var mwidth = '';

			if (this.options.platform == 'io') {
				// Calculate total width of autosuggest relative to screen width
				totalWidth = this.options.preferInputWidthTotalContent ? posSelector.outerWidth() : (this.options.sideContentOn && this.options.sideContentOn === 'left') ? (pos.left + posSelector.outerWidth()) : document.body.clientWidth - pos.left;
				if (totalWidth > document.body.clientWidth) {
					totalWidth = document.body.clientWidth;
				}
				if (totalWidth > 788 && totalWidth < 2000) {
					totalWidth = this.options.totalWidthPercent ? (this.options.totalWidthPercent * totalWidth / 100) : (70 * totalWidth / 100);
				}
				else if (totalWidth > 2000) {
					totalWidth = (45 * totalWidth / 100);
				}


				// Important to support screen resize for mobile and desktop.
				if ((this.options.isMobile && this.options.isMobile()) || isMobile.any()) {
					this.options.template = this.options.mobile.template;
					this.options.mainTpl = this.options.mobile.mainTpl;
					this.options.popularProducts.count = this.options.mobile.popularProducts.count;
				} else {
					this.options.template = this.options.desktop.template.column;
					this.options.mainTpl = this.options.desktop.mainTpl;
					this.options.popularProducts.count = this.options.desktop.popularProducts.count;
				}

				// Calculate mainwidth based on 1 or 2 columns
				if (this.options.template == '1column') {
					var preferInputWidthMainContent = this.options.preferInputWidthMainContent;
					if (isDesktop.call(this)) {
						preferInputWidthMainContent = this.options.desktop.template[this.options.desktop.template.column].preferInputWidthMainContent;
						$('.unbxd-as-popular-product-info').addClass('unbxd-1column-popular-product-desktop');
					}
					mwidth = preferInputWidthMainContent ? posSelector.outerWidth() : (60 * totalWidth / 100);
				} else {
					/* Removing this as this breaks when template is 2 column but preferinputwidthmaincotnent is true for mobile, popular products won't appear ever.
					To solve this, there is another config, preferInputWidthTotalContent, which includes mainwidth and sidewidth = width of input selector */
					mwidth = this.options.mainWidthPercent ? (this.options.mainWidthPercent * totalWidth / 100) : (30 * totalWidth / 100);
				}
			}

			// either use the specified width or calculate based on form element
			var iWidth = (this.options.mainWidth > 0) ? this.options.mainWidth : totalWidth ? mwidth : posSelector.innerWidth()
				, bt = parseInt(posSelector.css("border-top-width"), 10)
				, bb = parseInt(posSelector.css("border-bottom-width"), 10)
				, bl = parseInt(posSelector.css("border-left-width"), 10)
				, br = parseInt(posSelector.css("border-right-width"), 10)
				, pb = parseInt(posSelector.css("padding-bottom"), 10)
				, fwidth = (parseInt(iWidth) - 2 + bl + br)
				//isNaN check for border-top-width:medium bug IE8 http://bugs.jquery.com/ticket/7058
				//for more info http://bugs.jquery.com/ticket/10855
				, fpos = { top: pos.top + (isNaN(bt) ? 0 : (bt + bb)) + posSelector.innerHeight() + 'px', left: pos.left + "px" };

			var trendingWidth = this.options.trendingSearches.preferInputWidthTrending ? posSelector.outerWidth() : fwidth;
			this.$results.find("ul.unbxd-as-maincontent").css("width", fwidth + "px");
			this.$results.find("ul.unbxd-as-maincontent").css("box-sizing", "border-box");
			this.$results.find("ul.unbxd-as-maincontent.unbxd-as-trending").css("width", trendingWidth + "px");

			if (this.scrollbarWidth == null) {
				this.setScrollWidth();
			}

			//set column direction
			if (this.options.template == "2column") {

				// If sidewidth default overwritten, use that, else sidewidth = totalwidth - mainwidth
				var swidth = this.options.sideWidth !== this.default_options.sideWidth ? this.options.sideWidth : totalWidth ? totalWidth - fwidth : this.options.sideWidth;
				this.$results.find("ul.unbxd-as-sidecontent").css("width", swidth + "px");
				this.$results.find("ul.unbxd-as-sidecontent").css("box-sizing", "border-box");
				this.$results.removeClass("unbxd-as-extra-left unbxd-as-extra-right");
				this.$results.addClass("unbxd-as-extra-" + this.options.sideContentOn);
				if (this.$results.find("ul.unbxd-as-sidecontent").length > 0 && this.options.sideContentOn == "left") {
					var lwidth = (pos.left + posSelector.outerWidth()) > document.body.clientWidth ? document.body.clientWidth : pos.left + posSelector.outerWidth();
					fpos.left = lwidth - fwidth - swidth;
					if (fpos.left < 0) {
						fpos.left = 0;
					}
					if (this.$results.find("ul.unbxd-as-maincontent").length == 0) {
						fpos.left = fpos.left + fwidth;
					}
					fpos.left = fpos.left + "px";
				}
				if (this.options.popularProducts.view === 'grid' && this.options.popularProducts.rowCount) {
					this.$results.find("ul li.unbxd-as-popular-product-grid").css("width", (100 / this.options.popularProducts.rowCount) + "%");
				}
			}

			if (this.options.showCarts)
				this.$results.find(".unbxd-as-popular-product-cart-button").css("background-color", this.options.theme);

			if (typeof this.options.processResultsStyles == "function") {
				fpos = this.options.processResultsStyles.call(this, fpos);
			}

			this.$results.css(fpos).show();
		}
		, setScrollWidth: function () {
			var scrollDiv = document.createElement("div");
			scrollDiv.setAttribute("style", "width: 100px;height: 100px;overflow: scroll;position: absolute;top: -9999px;");

			document.body.appendChild(scrollDiv);

			this.scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
			document.body.removeChild(scrollDiv);
		}
		, hideResults: function () {
			if (this.timeout)
				clearTimeout(this.timeout);

			var self = this;

			this.timeout = setTimeout(function () { self.hideResultsNow(); }, 200);
		}
		, hideResultsNow: function () {
			this.log("hideResultsNow");
			if (this.timeout) clearTimeout(this.timeout);

			this.$input.removeClass(this.options.loadingClass);

			if (this.$results.is(':visible')) {
				this.$results.hide();
			}

			if (this.ajaxCall) this.ajaxCall.abort();
		}
		, addFilter: function (field, value) {
			if (!(field in this.params.filters))
				this.params.filters[field] = {};

			this.params.filters[field][value] = field;

			return this;
		}
		, removeFilter: function (field, value) {
			if (value in this.params.filters[field])
				delete this.params.filters[field][value];

			if (Object.keys(this.params.filters[field]).length == 0)
				delete this.params.filters[field];

			return this;
		}
		, clearFilters: function () {
			this.params.filters = {}
			return this;
		}
		, onChange: function () {
			// ignore if the following keys are pressed: [del] [shift] [capslock]
			if (this.lastKeyPressCode == 46 || (this.lastKeyPressCode > 8 && this.lastKeyPressCode < 32)) {
				if (this.lastKeyPressCode == 27 && typeof this.input.lastSelected == 'object') {
					this.$input.val(this.input.lastSelected.value);
				}

				return this.$results.hide();
			}
			var v = '';
			if (params && params.selfServe) {
				v = '*';
			} else {
				v = this.$input.val();
			}

			if (v == this.previous) return;

			this.params.q = v
			this.previous = v;

			/** Correct way to empty current results */
			this.currentResults = {
				KEYWORD_SUGGESTION: []
				, TOP_SEARCH_QUERIES: []
				, POPULAR_PRODUCTS: []
				, IN_FIELD: []
				, SORTED_SUGGESTIONS: []
				, PROMOTED_SUGGESTION: []
			}
			/**
			 * Due to caching check of query alone, on screen resize, 
			 * the url fired remains the same, even though params are different for mobile and desktop.
			 * Need to improve this check to include params too
			 */
			if (this.inCache(v)) {
				this.log("picked from cache : " + v);
				// updating product header while hovering on suggestions
				if (this.options.filtered) {
                    var ppHeader = this.getPopularProductsHeader(this);                    
					var cmpldHeader =
						Handlebars.compile(ppHeader);
					this.compiledPopularProductHeader = cmpldHeader(({ hoverSuggestion: v }));
				}
				this.currentResults = this.getFromCache(v);
				this.$results.html(this.prepareHTML());
				this.showResults();
			} else {
				if (this.ajaxCall) this.ajaxCall.abort();

				if (v.length >= this.options.minChars) {
					this.$input.addClass(this.options.loadingClass);
					this.requestData(v);
				}
				else {
					this.$input.removeClass(this.options.loadingClass);
					if (!(this.options.trendingSearches.enabled && this.clickResults.TRENDING_QUERIES.length > 0 && v === "")) {
						this.$results.hide();
					}
				}
			}
		}
		, getClass: function (object) { return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1]; }
		, requestData: function (q) {
			var self = this, url = self.autosuggestUrl();
			this.log("requestData", url);
			var params = this.getAjaxParams();
			params.url = url;
			params.cache = true;
			this.ajaxCall = $.ajax(params)
				.done(function (d) {
					self.receiveData(d);
				})
				.fail(function (f) {
					self.$input.removeClass(self.options.loadingClass);
					self.$results.hide();
				});
		}
		, getHostDomainName: function () {
			if (this.options.platform === 'com') {
				return "//search.unbxdapi.com/";
			}
			else {
				return this.options.searchEndPoint + "/";
			}
		}
		, getAjaxParams: function () {
			var params = {};
			if (this.options.platform === 'io') {
				params = {
					dataType: "json",
					method: "get"
				}
			}
			else {
				params = {
					dataType: "jsonp",
					jsonp: "json.wrf"
				}
			}
			return params;
		}
		, autosuggestUrl: function () {
			var host_path = this.getHostNPath();
			var query = this.params.q;
			if (this.options.customQueryParse && typeof this.options.customQueryParse === "function") {
				query = this.options.customQueryParse(this.params.q);
			}
			var url = "q=" + encodeURIComponent(query);

			if (this.options.maxSuggestions) {
				url += '&inFields.count=' + this.options.maxSuggestions
					+ '&topQueries.count=' + this.options.maxSuggestions
					+ '&keywordSuggestions.count=' + this.options.maxSuggestions
					+ '&popularProducts.count=' + this.options.popularProducts.count
					+ '&promotedSuggestion.count=' + this.options.maxSuggestions
					+ '&indent=off';
			}
			else {
				url += '&inFields.count=' + this.options.inFields.count
					+ '&topQueries.count=' + this.options.topQueries.count
					+ '&keywordSuggestions.count=' + this.options.keywordSuggestions.count
					+ '&popularProducts.count=' + this.options.popularProducts.count
					+ '&promotedSuggestion.count=' + this.options.promotedSuggestions.count
					+ '&indent=off';
			}

			if (this.options.popularProducts.fields.length > 0) {
				var popularProductFields = this.options.popularProducts.fields.join(",");
				url = url + '&popularProducts.fields=' + popularProductFields
			}

			if (this.options.removeDuplicates) {
				url = url + '&variants=true';
			}


			for (var x in this.params.filters) {
				if (this.params.filters.hasOwnProperty(x)) {
					var a = [];
					for (var y in this.params.filters[x]) {
						if (this.params.filters[x].hasOwnProperty(y)) {
							a.push((x + ':\"' + encodeURIComponent(y.replace(/(^")|("$)/g, '')) + '\"').replace(/\"{2,}/g, '"'));
						}
					}

					url += '&filter=' + a.join(' OR ');
				}
			}

			var extraParams = this.options.extraParams || {};
			var extraParamsKeys = Object.keys(extraParams);
			if (extraParamsKeys.length) {
				extraParamsKeys.forEach((key) => {
					url = url + "&" + key + "=" + extraParams[key];
				});
			}

			return host_path + "?" + url;
		}
		, getHostNPath: function () {
			return this.getHostDomainName() + this.options.APIKey + "/" + this.options.siteName + "/autosuggest"
		}
		, receiveData: function (data) {
			if (data) {
				this.$input.removeClass(this.options.loadingClass);
				this.$results.html('');
				// if the field no longer has focus or if there are no matches, do not display the drop down
				if ((!this.hasFocus && (params ? !params.selfServe : true)) || data.response.numberOfProducts == 0 || "error" in data) {
					if (!this.options.noResultTpl) {
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
		, max_suggest: function (data) {
			var infield_result = 0, topquery_result = 0, keyword_result = 0, promoted_result = 0;
			var infield_sugg = Math.floor(this.options.maxSuggestions * 0.2);
			var keyword_sugg = Math.floor(this.options.maxSuggestions * 0.3);
			var topquery_sugg = Math.ceil(this.options.maxSuggestions * 0.3);
			var promoted_sugg = Math.floor(this.options.maxSuggestions * 0.2);

			var keyword_rem = 0,
				topquery_rem = 0,
				promoted_rem = 0;
			for (var x = 0; x < data.response.products.length; x++) {
				if (data.response.products[x].doctype == "IN_FIELD") {
					infield_result++;
				}
				else if (data.response.products[x].doctype == "KEYWORD_SUGGESTION") {
					keyword_result++;
				}
				else if (data.response.products[x].doctype == "TOP_SEARCH_QUERIES") {
					topquery_result++;
				}
				else if (data.response.products[x].doctype == "PROMOTED_SUGGESTION") {
					promoted_result++;
				}
			}


			if (infield_result < infield_sugg) {
				var infield_rem = infield_sugg - infield_result;
				while (infield_rem > 0) {
					if (keyword_result > keyword_sugg) {
						if ((keyword_result - keyword_sugg) >= infield_rem) {
							keyword_sugg = keyword_sugg + infield_rem;
							infield_rem = 0;
						}
						else {
							infield_rem = infield_rem - keyword_result + keyword_sugg;
							keyword_sugg = keyword_result;

						}
					}
					else if (topquery_result > topquery_sugg) {
						if ((topquery_result - topquery_sugg) >= infield_rem) {
							topquery_sugg = topquery_sugg + infield_rem;
							infield_rem = 0;
						}
						else {
							infield_rem = infield_rem - topquery_result + topquery_sugg;
							topquery_sugg = topquery_result;
						}
					}
					else if (promoted_result > promoted_sugg) {
						if ((promoted_result - promoted_sugg) >= infield_rem) {
							promoted_sugg = promoted_sugg + infield_rem;
							infield_rem = 0;
						} else {
							infield_rem = infield_rem - promoted_result + promoted_sugg;
							promoted_sugg = promoted_result;
						}
					}
					else
						infield_rem = 0;

				}
				infield_sugg = infield_result;
			}

			if (topquery_result < topquery_sugg) {
				var topquery_rem = topquery_sugg - topquery_result;
				while (topquery_rem > 0 && keyword_result > keyword_sugg) {
					if (keyword_result > keyword_sugg) {
						if ((keyword_result - keyword_sugg) >= topquery_rem) {
							keyword_sugg = keyword_sugg + topquery_rem;
							topquery_rem = 0;
						}
						else {
							topquery_rem = topquery_rem - keyword_result + keyword_sugg;
							keyword_sugg = keyword_result;
						}
					} else if (promoted_result > promoted_sugg) {
						if ((promoted_result - promoted_sugg) >= topquery_rem) {
							promoted_sugg = promoted_sugg + topquery_rem;
							topquery_rem = 0;
						} else {
							topquery_rem = topquery_rem - promoted_result + promoted_sugg;
							promoted_sugg = promoted_result;
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

			if (keyword_result < keyword_sugg) {
				keyword_rem = keyword_sugg - keyword_result;
				while (keyword_rem > 0 && topquery_result > topquery_sugg) {
					if (topquery_result > topquery_sugg) {
						if ((topquery_result - topquery_sugg) >= keyword_rem) {
							topquery_sugg = topquery_sugg + keyword_rem;
							keyword_rem = 0;
						}
						else {
							keyword_rem = keyword_rem - topquery_result + topquery_sugg;
							topquery_sugg = topquery_result;
						}
					} else if (promoted_result > promoted_sugg) {
						if ((promoted_result - promoted_sugg) >= keyword_rem) {
							promoted_sugg = promoted_sugg + keyword_rem;
							keyword_rem = 0;
						} else {
							keyword_rem = keyword_rem - promoted_result + promoted_sugg;
							promoted_sugg = promoted_result;
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

			if (promoted_result < promoted_sugg) {
				promoted_rem = promoted_sugg - promoted_result;
				while (promoted_rem > 0) {
					if (topquery_result > topquery_sugg) {
						if ((topquery_result - topquery_sugg) >= promoted_rem) {
							topquery_sugg = topquery_sugg + promoted_rem;
							promoted_rem = 0;
						} else {
							promoted_rem = promoted_rem - topquery_result + topquery_sugg;
							topquery_sugg = topquery_result;
						}
					} else if (keyword_result > keyword_sugg) {
						if ((keyword_result - keyword_sugg) >= promoted_rem) {
							keyword_sugg = keyword_sugg + promoted_rem;
							promoted_rem = 0;
						} else {
							promoted_rem = promoted_rem - keyword_result + keyword_sugg;
							keyword_sugg = keyword_result;
						}
					} else promoted_rem = 0;
				}
				promoted_sugg = promoted_result;
			}

			var count = {};
			count['infields'] = infield_sugg;
			count['topquery'] = topquery_sugg;
			count['promoted'] = promoted_sugg;
			count['keyword'] = keyword_sugg;
			count['key_rem'] = keyword_rem;
			count['top_rem'] = topquery_rem;
			count['promo_rem'] = promoted_rem;
			return count;

		}
		, isUnique: function (autosuggest, arr) {
			try {
				autosuggest = autosuggest.toLowerCase();
				var unique = true;
				for (var k = 0; k < arr.length; k++) {
					var suggestion = arr[k];
					if (Math.abs(suggestion.length - autosuggest.length) < 3
						&& (suggestion.indexOf(autosuggest) != -1 || autosuggest.indexOf(suggestion) != -1)) {
						unique = false;
						break;
					}

				}
				if (unique)
					arr.push(autosuggest);
				return unique;
			} catch (e) {
				return true;
			}
		}
		//FIXME: Temporarily adding it for testing inFields behaviour
		, isTempUnique: function (autosuggest, arr) {
			autosuggest = autosuggest.toLowerCase();
			return arr.indexOf(autosuggest) === -1 ? arr.push(autosuggest) : false;
		}
		, getfilteredPopularProducts: function () {
			var query = this.params.q;
			if (this.options.customQueryParse && typeof this.options.customQueryParse === "function") {
				query = this.options.customQueryParse(this.params.q);
			}
			var self = this,
				urlPath = this.getHostDomainName() + this.options.APIKey + "/"
					+ this.options.siteName + "/search",
				defaultSearchParams = "indent=off&facet=off&analytics=false&redirect=false",
				url = urlPath + "?q=" + encodeURIComponent(query)
					+ "&rows=" + this.options.popularProducts.count + "&"
					+ defaultSearchParams;

			if (self.options.popularProducts.fields.length > 0) {
				var popularProductFields = "&fields=" + self.options.popularProducts.fields.join(",");
				url = url + popularProductFields;
			}

			if (self.options.removeDuplicates) {
				url = url + "&variants=true";
			}

			var extraParams = self.options.extraParams || {};
			var extraParamsKeys = Object.keys(extraParams);
			if (extraParamsKeys.length) {
				extraParamsKeys.forEach((key) => {
					url = url + "&" + key + "=" + extraParams[key];
				});
			}

			var params = this.getAjaxParams();
			params.url = url;
			params.cache = true;
			$.ajax(params).done(function (d) {
				var query = self.params.q;
				self.processfilteredPopularProducts(query, d);
			});

			for (var i in this.currentResults) {
				if (i != 'POPULAR_PRODUCTS' && this.currentResults.hasOwnProperty(i)) {
					for (var j in this.currentResults[i]) {
						if (this.currentResults[i].hasOwnProperty(j)) {
							if (this.currentResults[i][j]['filtername']) {
								url = urlPath + "?q="
									+ encodeURIComponent(this.currentResults[i][j]['autosuggest']) + "&filter="
									+ this.currentResults[i][j]['filtername'] + ":\""
									+ encodeURIComponent(this.currentResults[i][j]['filtervalue'])
									+ "\"&rows=" + this.options.popularProducts.count + popularProductFields + "&"
									+ defaultSearchParams;
							}
							else {
								url = urlPath + "?q="
									+ encodeURIComponent(this.currentResults[i][j]['autosuggest'])
									+ "&rows=" + this.options.popularProducts.count + popularProductFields + "&"
									+ defaultSearchParams;
							}
							var params = this.getAjaxParams();
							params.url = url;
							params.cache = true;
							$.ajax(params).done(function (d) {
								var query = d.searchMetaData.queryParams.q
									+ (d.searchMetaData.queryParams.filter ? ':'
										+ d.searchMetaData.queryParams.filter.replace(/"/g, '') : '');
								self.processfilteredPopularProducts(query, d);
							});
						}
					}
				}
			}
		}
		, processfilteredPopularProducts: function (query, d) {
			this.currentTopResults[query] = [];
			if (d.hasOwnProperty("response") && d.response.hasOwnProperty("products")
				&& d.response.products.length) {
				for (var k = 0; k < d.response.products.length; k++) {
					var doc = d.response.products[k];

					var o = {
						_original: doc
						, type: 'POPULAR_PRODUCTS_FILTERED'
						, src: query
						, pid: doc.uniqueId || ""
					};

					if (this.options.popularProducts.name && this.options.popularProducts.nameFunctionOrKey) {
						o.autosuggest = doc[this.options.popularProducts.nameFunctionOrKey];
					} else if (this.options.popularProducts.autosuggestName && doc[this.options.popularProducts.autosuggestName]) {
						o.autosuggest = doc[this.options.popularProducts.autosuggestName];
					}
					else if (this.options.popularProducts.title && doc[this.options.popularProducts.title]) {
						o.autosuggest = doc[this.options.popularProducts.title];
					}
					else if (doc.title) {
						o.autosuggest = doc.title;
					}
					else {
						o.autosuggest = '';
					}

					o.highlighted = this.highlightStr(o.autosuggest);

					if (this.options.popularProducts.price) {
						if (typeof this.options.popularProducts.priceFunctionOrKey === "function") {
							o.price = this.options.popularProducts.priceFunctionOrKey(doc);
						} else if (typeof this.options.popularProducts.priceFunctionOrKey === "string"
							&& this.options.popularProducts.priceFunctionOrKey) {
							o.price = this.options.popularProducts.priceFunctionOrKey in doc ?
								doc[this.options.popularProducts.priceFunctionOrKey] : null;
						} else {
							o.price = "price" in doc ? doc["price"] : null;
						}

						if (this.options.popularProducts.currency)
							o.currency = this.options.popularProducts.currency;
					}

					if (this.options.popularProducts.salePrice && this.options.popularProducts.salePriceKey) {
						o.salePrice = this.options.popularProducts.salePriceKey in doc ? doc[this.options.popularProducts.salePriceKey] : null;
					}

					if (this.options.popularProducts.image) {
						if (typeof this.options.popularProducts.imageUrlOrFunction === "function") {
							o.image = this.options.popularProducts.imageUrlOrFunction(doc);
						} else if (typeof this.options.popularProducts.imageUrlOrFunction === "string"
							&& this.options.popularProducts.imageUrlOrFunction) {
							o.image = this.options.popularProducts.imageUrlOrFunction in doc ?
								doc[this.options.popularProducts.imageUrlOrFunction] : null;
						}
					}
					this.currentTopResults[query].push(o);
				}
			}
		}
		, processTopSearchQuery: function (doc) {
			var o = {
				autosuggest: doc.autosuggest
				, highlighted: this.highlightStr(doc.autosuggest)
				, type: "TOP_SEARCH_QUERIES"
				, _original: doc.doctype
			};
			this.currentResults.TOP_SEARCH_QUERIES.push(o);
		}
		, processTrendingQueries: function (doc) {
			var o = {
				autosuggest: doc.autosuggest
				, highlighted: this.highlightStr(doc.autosuggest)
				, type: "TRENDING_QUERIES"
				, _original: doc
				, source: doc.unbxdAutosuggestSrc || ""
			};
			this.trendingQueries.push(o);
		}
		, processKeywordSuggestion: function (doc) {
			var o = {
				autosuggest: doc.autosuggest
				, highlighted: this.highlightStr(doc.autosuggest)
				, type: "KEYWORD_SUGGESTION"
				, _original: doc
				, source: doc.unbxdAutosuggestSrc || ""
			};
			this.currentResults.KEYWORD_SUGGESTION.push(o);
		}
		, processPromotedSuggestion: function (doc) {
			var o = {
				autosuggest: doc.autosuggest,
				highlighted: this.highlightStr(doc.autosuggest),
				type: "PROMOTED_SUGGESTION",
				_original: doc,
				source: doc.unbxdAutosuggestSrc || ""
			};
			this.currentResults.PROMOTED_SUGGESTION.push(o);
		}
		, setDefaultPopularProductsOptions: function () {
			if (!this.options.popularProducts.autosuggestName) {
				this.options.popularProducts.autosuggestName = 'title';
			}
			if (!this.options.popularProducts.title) {
				this.options.popularProducts.title = 'autosuggest';
			}
			if (!this.options.popularProducts.fields) {
				this.options.popularProducts.fields = [];
			}
			if (!this.options.popularProducts.rowCount && this.options.platform === 'io') {
				this.options.popularProducts.rowCount = (this.options.popularProducts.count / 2);
			}
		}
		, setDefaultOptions: function () {
			if (!this.options.inFields.type) {
				this.options.inFields.type = 'separate';
			}
			if (!this.options.inFields.noOfInfields) {
				this.options.inFields.noOfInfields = 3;
			}
			if (!this.options.inFields.showDefault) {
				this.options.inFields.showDefault = false;
			}

			// Save current template and config to desktop object in case of switching between mobile and desktop
			if (!this.options.desktop) {
				this.options.desktop = {
					template: {
						column: this.options.template,
						"1column": {
							preferInputWidthMainContent: this.options.preferOneColumnFullWidth
						},
						"2column": {
							preferInputWidthMainContent: this.options.preferInputWidthMainContent
						}
					},
					mainTpl: this.options.mainTpl,
					popularProducts: {
						count: this.options.popularProducts.count
					}
				}
			}
		}
		, getPopularProductFields: function () {
			var popularProductsFields = ['doctype'];
			this.options.popularProducts.fields.push(this.options.popularProducts.title);
			if (this.options.popularProducts.price && typeof this.options.popularProducts.priceFunctionOrKey == "string"
				&& this.options.popularProducts.priceFunctionOrKey) {
				popularProductsFields.push(this.options.popularProducts.priceFunctionOrKey);
			}
			if (this.options.popularProducts.image) {
				if (typeof this.options.popularProducts.imageUrlOrFunction == "string"
					&& this.options.popularProducts.imageUrlOrFunction) {
					popularProductsFields.push(this.options.popularProducts.imageUrlOrFunction);
				}
			}
			if (this.options.popularProducts.fields.length > 0) {
				this.options.popularProducts.fields = popularProductsFields.concat(this.options.popularProducts.fields);
			}
			else {
				this.options.popularProducts.fields = popularProductsFields;
			}

			// to maintain the backward compatibility with old customers
            var ppHeader = this.getPopularProductsHeader(this);
			this.compiledPopularProductHeader = ppHeader;
		}
		, processPopularProducts: function (doc) {
			var o = {
				type: doc.doctype
				, pid: doc.uniqueId.replace("popularProduct_", "")
				, _original: doc
			};

			if (this.options.popularProducts.name) {
				o.autosuggest = doc[this.options.nameFunctionOrKey] ? doc[this.options.nameFunctionOrKey] : doc[this.options.popularProducts.title] ? doc[this.options.popularProducts.title] : '';
			} else {
				o.autosuggest = '';
			}

			o.highlighted = this.highlightStr(o.autosuggest);

			if (this.options.popularProducts.price) {
				if (typeof this.options.popularProducts.priceFunctionOrKey == "function") {
					o.price = this.options.popularProducts.priceFunctionOrKey(doc);
				} else if (typeof this.options.popularProducts.priceFunctionOrKey == "string"
					&& this.options.popularProducts.priceFunctionOrKey) {
					o.price = this.options.popularProducts.priceFunctionOrKey in doc ? doc[this.options.popularProducts.priceFunctionOrKey] : null;
				} else {
					o.price = "price" in doc ? doc["price"] : null;
				}
			}

			if (this.options.popularProducts.salePrice && this.options.popularProducts.salePriceKey) {
				o.salePrice = this.options.popularProducts.salePriceKey in doc ? doc[this.options.popularProducts.salePriceKey] : null;
			}

			if (this.options.popularProducts.currency) {
				o.currency = this.options.popularProducts.currency;
			}

			if (this.options.popularProducts.image) {
				if (typeof this.options.popularProducts.imageUrlOrFunction == "function") {
					o.image = this.options.popularProducts.imageUrlOrFunction(doc);
				} else if (typeof this.options.popularProducts.imageUrlOrFunction == "string"
					&& this.options.popularProducts.imageUrlOrFunction) {
					o.image = this.options.popularProducts.imageUrlOrFunction in doc ? doc[this.options.popularProducts.imageUrlOrFunction] : null;
				}
			}

			this.currentResults.POPULAR_PRODUCTS.push(o);
            this.productInfo.popularProductsCount = this.currentResults.POPULAR_PRODUCTS.length;

            // updating product header while hovering on suggestions
			if (this.options.filtered) {
                var ppHeader = this.getPopularProductsHeader(this);
                var cmpldHeader = Handlebars.compile(ppHeader);
				this.compiledPopularProductHeader = cmpldHeader({ hoverSuggestion: this.params.q });
			}
		}
		, processInFields: function (doc) {
			var ins = {}
				, asrc = " " + doc.unbxdAutosuggestSrc + " "
				, highlightedtext = this.highlightStr(doc.autosuggest);

			if (this.options.inFields.showDefault) {
				var that = this;
				Object.keys(doc).forEach(function (item) {
					if (item.length >= 3 && item.substring(item.length - 3) === "_in") {
						var a = item.split("_in")[0];
						ins[a] = doc[a + "_in"].slice(0, parseInt(that.options.inFields.noOfInfields));
					}
				})
			} else {
				for (var a in this.options.inFields.fields) {
					if ((a + "_in") in doc && doc[a + "_in"].length && asrc.indexOf(" " + a + " ") == -1) {
						ins[a] = doc[a + "_in"].slice(0, parseInt(this.options.inFields.fields[a]));
						if (this.options.inFields.removeDuplicateKeyword) {
							var ind = ins[a].indexOf(doc.autosuggest.trim());
							if (ind >= 0) {
								ins[a].splice(ind, 1);
							}
						}
					}
				}
			}

			var sortedInfields = [];
			if (this.options.sortByLength) {
				var k = 0;
				for (var i in ins) {
					for (var j = 0; j < ins[i].length; j++) {
						sortedInfields[k] = {
							filterName: i,
							filterValue: ins[i][j]
						}
						k++;
					}
				}

				sortedInfields.sort(function (a, b) {
					return customSort(a.filterValue, b.filterValue);
				})
			}
			if (!$.isEmptyObject(ins)) {
				this.currentResults.IN_FIELD.push({
					autosuggest: doc.autosuggest
					, highlighted: highlightedtext
					, type: "keyword" //this is kept as keyword but in template it will be used as "IN_FIELD"
					, source: doc.unbxdAutosuggestSrc
				});

				var that = this;
				if (this.options.sortByLength) {
					for (var i = 0; i < sortedInfields.length; i++) {
						if (sortedInfields[i].filterValue !== '') {
							this.currentResults.IN_FIELD.push({
								autosuggest: doc.autosuggest
								, highlighted: this.options.inFields.type === 'separate' ? that.prepareinFieldsKeyword(sortedInfields[i].filterValue) : that.highlightStr(doc.autosuggest) + ' in ' + that.prepareinFieldsKeyword(sortedInfields[i].filterValue)
								, type: doc.doctype
								, filtername: sortedInfields[i].filterName
								, filtervalue: sortedInfields[i].filterValue
								, _original: doc
								, source: doc.unbxdAutosuggestSrc
							})
						}
					}
				}
				else {
					for (var a in ins) {
						for (var b = 0; b < ins[a].length; b++) {
							if (ins[a][b] !== '') {
								this.currentResults.IN_FIELD.push({
									autosuggest: doc.autosuggest
									, highlighted: this.options.inFields.type === 'separate' ? that.prepareinFieldsKeyword(ins[a][b]) : that.highlightStr(doc.autosuggest) + ' in ' + that.prepareinFieldsKeyword(ins[a][b])
									, type: doc.doctype
									, filtername: a
									, filtervalue: ins[a][b]
									, _original: doc
									, source: doc.unbxdAutosuggestSrc
								})
							}
						}
					}
				}
			}
			else {
				this.currentResults.KEYWORD_SUGGESTION.push({
					autosuggest: doc.autosuggest
					, highlighted: highlightedtext
					, type: "KEYWORD_SUGGESTION" //this is kept as keyword but in template it will be used as "IN_FIELD"
					, source: doc.unbxdAutosuggestSrc
				});
			}

		}
		, sortSuggestionsBylength: function () {
			this.currentResults.SORTED_SUGGESTIONS = this.currentResults.KEYWORD_SUGGESTION.concat(this.currentResults.TOP_SEARCH_QUERIES, this.currentResults.PROMOTED_SUGGESTION);
			this.currentResults.SORTED_SUGGESTIONS.sort(function (a, b) {
				return customSort(a.autosuggest, b.autosuggest);
			});
			this.currentResults.IN_FIELD.sort(function (a, b) {
				return customSort(a.autosuggest, b.autosuggest);
			})
		}
		, processData: function (data) {
			var count;
			if (this.options.maxSuggestions) {
				count = this.max_suggest(data);
			}

			this.currentResults = {
				KEYWORD_SUGGESTION: []
				, TOP_SEARCH_QUERIES: []
				, POPULAR_PRODUCTS: []
				, IN_FIELD: []
				, SORTED_SUGGESTIONS: []
				, PROMOTED_SUGGESTION: []
			}

			// recent searches will also be added on click in future.
			this.clickResults = {
				TRENDING_QUERIES: []
			}

			var infieldsCount = 0;
			var key_count = 0,
				uniqueInfields = [],
				uniqueSuggestions = [];


			for (var x = 0; x < data.response.products.length; x++) {

				var doc = data.response.products[x]
					, o = {};

				if (this.options.maxSuggestions) {
					if ("TOP_SEARCH_QUERIES" == doc.doctype && count['topquery'] > this.currentResults.TOP_SEARCH_QUERIES.length
						&& this.isUnique(doc.autosuggest, uniqueSuggestions)) {
						this.processTopSearchQuery(doc);
					} else if ("IN_FIELD" == doc.doctype && (count['infields'] + count['key_rem'] + count['top_rem']) > infieldsCount
						&& this.isUnique(doc.autosuggest, uniqueInfields)
						&& this.isUnique(doc.autosuggest, uniqueSuggestions)) {
						if (count['infields'] > infieldsCount) {
							infieldsCount++;
							this.processInFields(doc);
						}
						else if (count['key_rem'] + count['top_rem'] > this.currentResults.KEYWORD_SUGGESTION.length
							&& this.isUnique(doc.autosuggest, uniqueSuggestions)) {
							this.processKeywordSuggestion(doc);
						}

					} else if ("KEYWORD_SUGGESTION" == doc.doctype && (count['keyword'] > this.currentResults.KEYWORD_SUGGESTION.length)
						&& this.isUnique(doc.autosuggest, uniqueInfields)) {
						this.processKeywordSuggestion(doc);
					} else if ("POPULAR_PRODUCTS" == doc.doctype
						&& this.options.popularProducts.count > this.currentResults.POPULAR_PRODUCTS.length) {
						this.processPopularProducts(doc);
					} else if ("PROMOTED_SUGGESTION" == doc.doctype && count['promoted'] > this.currentResults.PROMOTED_SUGGESTION.length &&
						this.isUnique(doc.autosuggest, uniqueSuggestions)) {
						this.processPromotedSuggestion(doc);
					}
				} else {
					if ("TOP_SEARCH_QUERIES" == doc.doctype && this.options.topQueries.count > this.currentResults.TOP_SEARCH_QUERIES.length
						&& this.isUnique(doc.autosuggest, uniqueSuggestions)) {
						this.processTopSearchQuery(doc);
					} else if ("IN_FIELD" == doc.doctype && this.options.inFields.count > infieldsCount
						&& this.isTempUnique(doc.autosuggest, uniqueInfields)
						&& this.isUnique(doc.autosuggest, uniqueSuggestions)) {
						this.processInFields(doc);
					} else if ("KEYWORD_SUGGESTION" == doc.doctype
						&& (this.options.keywordSuggestions.count > this.currentResults.KEYWORD_SUGGESTION.length)
						&& this.isUnique(doc.autosuggest, uniqueSuggestions)) {
						this.processKeywordSuggestion(doc);
					} else if ("POPULAR_PRODUCTS" == doc.doctype
						&& this.options.popularProducts.count > this.currentResults.POPULAR_PRODUCTS.length) {
						this.processPopularProducts(doc);
					} else if ("PROMOTED_SUGGESTION" == doc.doctype &&
						(this.options.promotedSuggestions.count > this.currentResults.PROMOTED_SUGGESTION.length) &&
						this.isUnique(doc.autosuggest, uniqueSuggestions)) {
						this.processPromotedSuggestion(doc);
					}
				}

			}
			if (this.options.filtered) {
				this.getfilteredPopularProducts();
			}
			if (this.options.sortByLength) {
				this.sortSuggestionsBylength();
			}

			//lenth of result list
			var outLength = this.currentResults.POPULAR_PRODUCTS.length + this.currentResults.IN_FIELD.length;
			if (this.options.sortSuggestionsOnLength) {
				for (var doc_type in this.currentResults) {

					// Sort for all except infield suggestions
					if (doc_type.toLowerCase() != "in_field") {
						this.currentResults[doc_type].sort(function (x, y) {

							// if you want to sort by length
							return x.autosuggest.length > y.autosuggest.length ? 1 : -1;
						})
					}
				};
			}

		}
		, escapeStr: function (str) { return str.replace(/([\\{}()|.?*+\-\^$\[\]])/g, '\\$1'); }
		, highlightStr: function (str) {
			var output = str
				, q = $.trim(this.params.q + '');

			if (q.indexOf(' ')) {
				var arr = q.split(' ');
				for (var k in arr) {
					if (!arr.hasOwnProperty(k)) continue;

					var l = output.toLowerCase().lastIndexOf("</strong>");
					if (l != -1) l += 9;
					output = output.substring(0, l) + output.substring(l).replace(new RegExp(this.escapeStr(arr[k]), 'gi'), function ($1) {
						return '<strong>' + $1 + '<\/strong>';
					});
				}
			} else {
				var st = output.toLowerCase().indexOf(q);
				output = st >= 0 ? output.substring(0, st) + '<strong>' + output.substring(st, st + q.length) + '</strong>' + output.substring(st + q.length) : output;
			}

			return output;
		}
		, prepareinFieldsKeyword: function (str) {
			if (this.options.customInfieldsFilter && typeof this.options.customInfieldsFilter === "function") {
				str = this.options.customInfieldsFilter(str);
			}
			return '<span class="unbxd-as-suggestions-infields">' + str + '</span>';
		}

		, prepareinFieldsHTML: function () {
			if (this.options.inFields.type === "inline") {
				return '{{#if data.IN_FIELD}}'
					+ (this.options.inFields.header ? '<li class="unbxd-as-header">' + this.options.inFields.header + '</li>' : '')
					+ '{{#each data.IN_FIELD}}'
					+ '{{#unbxdIf type "keyword"}}'
					+ '{{else}}'
					+ '<li data-index="{{@index}}" data-type="{{type}}" data-value="{{autosuggest}}" data-filtername="{{filtername}}" data-filtervalue="{{filtervalue}}"  data-source="{{source}}">'
					+ (this.options.inFields.tpl ? this.options.inFields.tpl : this.default_options.inFields.tpl)
					+ '</li>'
					+ '{{/unbxdIf}}'
					+ '{{/each}}'
					+ '{{/if}}';
			} else {
				return '{{#if data.IN_FIELD}}'
					+ (this.options.inFields.header ? '<li class="unbxd-as-header">' + this.options.inFields.header + '</li>' : '')
					+ '{{#each data.IN_FIELD}}'
					+ '{{#unbxdIf type "keyword"}}'
					+ '<li class="unbxd-as-keysuggestion" data-index="{{@index}}" data-value="{{autosuggest}}" data-type="IN_FIELD" data-source="{{source}}">'
					+ (this.options.inFields.tpl ? this.options.inFields.tpl : this.default_options.inFields.tpl)
					+ '</li>'
					+ '{{else}}'
					+ '<li class="unbxd-as-insuggestion" style="color:' + this.options.theme + ';" data-index="{{@index}}" data-type="{{type}}" data-value="{{autosuggest}}" data-filtername="{{filtername}}" data-filtervalue="{{filtervalue}}"  data-source="{{source}}">'
					+ 'in ' + (this.options.inFields.tpl ? this.options.inFields.tpl : this.default_options.inFields.tpl)
					+ '</li>'
					+ '{{/unbxdIf}}'
					+ '{{/each}}'
					+ '{{/if}}';
			}
		}
		, preparekeywordSuggestionsHTML: function () {
			return '{{#if data.KEYWORD_SUGGESTION}}'
				+ (this.options.keywordSuggestions.header ? '<li class="unbxd-as-header">' + this.options.keywordSuggestions.header + '</li>' : '')
				+ '{{#each data.KEYWORD_SUGGESTION}}'
				+ '<li class="unbxd-as-keysuggestion" data-value="{{autosuggest}}" data-index="{{@index}}" data-type="{{type}}"  data-source="{{source}}">'
				+ (this.options.keywordSuggestions.tpl ? this.options.keywordSuggestions.tpl : this.default_options.keywordSuggestions.tpl)
				+ '</li>'
				+ '{{/each}}'
				+ '{{/if}}';
		}
		, prepareTrendingQueriesHTML: function () {
			return '<ul class="unbxd-as-maincontent unbxd-as-suggestions-overall unbxd-as-trending">'
				+ (this.options.trendingSearches.header ? '<li class="unbxd-as-header">' + this.options.trendingSearches.header + '</li>' : '')
				+ '{{#each data1}}'
				+ '<li class="unbxd-as-keysuggestion" data-value="{{autosuggest}}" data-index="{{@index}}" data-type="{{type}}"  data-source="{{source}}">'
				+ (this.options.trendingSearches.tpl ? this.options.trendingSearches.tpl : this.default_options.trendingSearches.tpl)
				+ '</li>'
				+ '{{/each}}'
				+ '</ul>';

		}
		, preparepromotedSuggestionsHTML: function () {
			return '{{#if data.PROMOTED_SUGGESTION}}' +
				(this.options.promotedSuggestions.header ? '<li class="unbxd-as-header">' + this.options.promotedSuggestions.header + '</li>' : '') +
				'{{#each data.PROMOTED_SUGGESTION}}' +
				'<li class="unbxd-as-keysuggestion" data-value="{{autosuggest}}" data-index="{{@index}}" data-type="{{type}}"  data-source="{{source}}">' +
				(this.options.promotedSuggestions.tpl ? this.options.promotedSuggestions.tpl : this.default_options.promotedSuggestions.tpl) +
				'</li>' +
				'{{/each}}' +
				'{{/if}}';
		}
		, preparetopQueriesHTML: function () {
			return '{{#if data.TOP_SEARCH_QUERIES}}'
				+ (this.options.topQueries.header ? '<li class="unbxd-as-header">' + this.options.topQueries.header + '</li>' : '')
				+ '{{#each data.TOP_SEARCH_QUERIES}}'
				+ '<li class="unbxd-as-keysuggestion" data-type="{{type}}" data-index="{{@index}}" data-value="{{autosuggest}}">'
				+ (this.options.topQueries.tpl ? this.options.topQueries.tpl : this.default_options.topQueries.tpl)
				+ '</li>'
				+ '{{/each}}'
				+ '{{/if}}';
		}
		, preparefilteredPopularProducts: function () {
			return (this.compiledPopularProductHeader ? '<li class="unbxd-as-header unbxd-as-popular-product-header">' + this.compiledPopularProductHeader + '</li>' : '') + '{{#data}}'
				+ '<li class="unbxd-as-popular-product ' + (this.options.popularProducts.view === 'grid' ? 'unbxd-as-popular-product-grid' : '')
				+ '" data-value="{{autosuggest}}" data-index="{{@index}}" data-type="{{type}}" data-pid="{{pid}}" data-src="{{src}}">'
				+ (this.options.popularProducts.tpl ? this.options.popularProducts.tpl : this.default_options.popularProducts.tpl)
				+ '</li>'
				+ '{{/data}}'
		}
		, preparepopularProductsHTML: function () {
			return '{{#if data.POPULAR_PRODUCTS}}'
				+ (this.compiledPopularProductHeader ? '<li class="unbxd-as-header unbxd-as-popular-product-header">' + this.compiledPopularProductHeader + '</li>' : '')
				+ '{{#data.POPULAR_PRODUCTS}}'
				+ '<li class="unbxd-as-popular-product ' + (this.options.popularProducts.view === 'grid' ? 'unbxd-as-popular-product-grid' : '')
				+ '" data-value="{{autosuggest}}" data-index="{{@index}}" data-type="{{type}}" data-pid="{{pid}}" >'
				+ (this.options.popularProducts.tpl ? this.options.popularProducts.tpl : this.default_options.popularProducts.tpl)
				+ '</li>'
				+ '{{/data.POPULAR_PRODUCTS}}'
				+ '{{/if}}';
		}
		, standardizeKeys: function (key) {
			if (key === "inFields") {
				key = "IN_FIELD";
			}
			else if (key === "popularProducts") {
				key = "POPULAR_PRODUCTS";
			}
			else if (key === "topQueries") {
				key = "TOP_SEARCH_QUERIES";
			} else if (key === "promotedSuggestions") {
				key = "PROMOTED_SUGGESTION";
			}
			else
				key = "KEYWORD_SUGGESTION";

			return key
		}
		, prepareSortedSuggestionsHTML: function () {
			return '{{#if data.SORTED_SUGGESTIONS}}'
				+ '{{#each data.SORTED_SUGGESTIONS}}'
				+ '<li class="unbxd-as-sorted-suggestion" data-type="{{type}}" data-index="{{@index}}" data-value="{{autosuggest}}" data-sorted="true">'
				+ (this.options.sortedSuggestions.tpl ? this.options.sortedSuggestions.tpl : this.default_options.sortedSuggestions.tpl)
				+ '</li>'
				+ '{{/each}}'
				+ '{{/if}}';
		}
		, preprocessHTML: function () {
			if ((this.options.isMobile && this.options.isMobile()) || isMobile.any()) {
				this.options.template = this.options.mobile.template;
				this.options.mainTpl = this.options.mobile.mainTpl;
				this.options.popularProducts.count = this.options.mobile.popularProducts.count;
			}
		}
		, prepareHTML: function () {
			this.preprocessHTML();
            var html = '';
            if (this.options.template === "1column" && this.options.popularProducts.viewMore && this.options.popularProducts.viewMore.enabled) {
                html += '<ul class="unbxd-as-maincontent unbxd-as-suggestions-overall unbxd-as-view-more">';
            } else { 
                html += '<ul class="unbxd-as-maincontent unbxd-as-suggestions-overall">';
            }
			var mobileHtml = '<ul class="unbxd-as-maincontent unbxd-as-suggestions-overall unbxd-as-mobile-view">';
			var sideHtml = '';
			var mainHtml = '';
			var noResults = false;

			var self = this,
				mainlen = 0,
				sidelen = 0;
			
			if (this.options.template === "1column") {
				if (this.options.suggestionsHeader && (self.currentResults['IN_FIELD'].length || self.currentResults['KEYWORD_SUGGESTION'].length
					|| self.currentResults['TOP_SEARCH_QUERIES'].length)) {
					mainHtml = mainHtml + '<li class="unbxd-as-header unbxd-as-suggestions-header">' + this.options.suggestionsHeader + '</li>';
				}
			}

			if (!self.currentResults['IN_FIELD'].length && !self.currentResults['KEYWORD_SUGGESTION'].length
				&& !self.currentResults['POPULAR_PRODUCTS'].length && !self.currentResults['TOP_SEARCH_QUERIES'].length && !self.currentResults['PROMOTED_SUGGESTION'].length && this.options.noResultTpl) {
				noResults = true;
				if (typeof this.options.noResultTpl === "function") {
					html = html + '<li>' + this.options.noResultTpl.call(self, encodeURIComponent(self.params.q)) + '</li></ul>';
				}
				else if (typeof this.options.noResultTpl == "string") {
					html = html + '<li>' + this.options.noResultTpl + '</li></ul>';
				}
			}


			this.options.mainTpl.forEach(function (key) {
				key = self.standardizeKeys(key)
				mainlen = mainlen + self.currentResults[key].length;
			});


			this.options.sideTpl.forEach(function (key) {
				if (key === "inFields") {
					key = "IN_FIELD";
				}
				else if (key === "popularProducts") {
					key = "POPULAR_PRODUCTS";
				}
				else if (key === "topQueries") {
					key = "TOP_SEARCH_QUERIES";
				}
				else if (key === "promotedSuggestions") {
					key = "PROMOTED_SUGGESTION"
				}
				else
					key = "KEYWORD_SUGGESTION";
				sidelen = sidelen + self.currentResults[key].length;
			});

			if (this.options.template === '2column' && !this.options.sideTpl.length && !this.options.mainTpl) {
				this.options.sideTpl = ['keywordSuggestions', 'topQueries'];
				this.options.mainTpl = ['inFields', 'popularProducts'];
			}

			if (this.options.template === '2column') {
				//main zero side not zero
				if ((mainlen == 0) && (sidelen != 0)) {
					html = '<ul class="unbxd-as-sidecontent">';
					this.options.sideTpl.forEach(function (key) {
						if (self.options.sortByLength && (key == 'topQueries' || key == 'keywordSuggestions' || key == 'promotedSuggestions')) {
							return;
						}
						key = 'prepare' + key + 'HTML';
						html = html + self[key]();
					});

                    if (this.options.popularProducts.viewMore && this.options.popularProducts.viewMore.enabled) {
                        html = html + this.options.popularProducts.viewMore.tpl
                    }

					html = html + '</ul>';
				}
				else {
					if (mainlen > 0 && sidelen != 0) {

						if (this.options.popularProducts.viewMore && this.options.popularProducts.viewMore.enabled) {
							sideHtml = '<ul class="unbxd-as-sidecontent unbxd-as-view-more">';
						} else {
							sideHtml = '<ul class="unbxd-as-sidecontent">';
						}
						this.options.sideTpl.forEach(function (key) {
							if (self.options.sortByLength && (key == 'topQueries' || key == 'keywordSuggestions' || key == 'promotedSuggestions')) {
								return;
							}
							key = 'prepare' + key + 'HTML';
							sideHtml = sideHtml + self[key]();
						});
						if (this.options.popularProducts.viewMore && this.options.popularProducts.viewMore.enabled) {
							sideHtml = sideHtml + this.options.popularProducts.viewMore.tpl
						}
						sideHtml = sideHtml + '</ul>';

						mainHtml = mainHtml + '<ul class="unbxd-as-maincontent unbxd-as-suggestions-overall">';
						if (this.options.suggestionsHeader) {
							mainHtml = mainHtml + '<li class="unbxd-as-header unbxd-as-suggestions-header">' + this.options.suggestionsHeader + '</li>';
						}
					}
				}

			}

			if (!noResults && mainlen > 0) {

				if (this.options.sortByLength) {
					mainHtml = mainHtml + self['prepareSortedSuggestionsHTML']();
				}

				this.options.mainTpl.forEach(function (key) {

					if (self.currentResults[self.standardizeKeys(key)].length && topQuery === "") {
						topQuery = self.currentResults[self.standardizeKeys(key)][0]["autosuggest"]
					}

					if (self.options.sortByLength && (key == 'topQueries' || key == 'keywordSuggestions' || key == 'promotedSuggestions')) {
						return;
					}
					key = 'prepare' + key + 'HTML';
					mainHtml = mainHtml + self[key]();
				});

                if (this.options.popularProducts.viewMore && this.options.popularProducts.viewMore.enabled) {
                    mainHtml = mainHtml + this.options.popularProducts.viewMore.tpl;
                }

				mainHtml = mainHtml + '</ul>';

				if (this.options.isMobile && this.options.isMobile()) {
					html = mobileHtml + mainHtml;
				} else if (isMobile.any()) {
					html = mobileHtml + mainHtml;
				} else if (this.options.template === "1column") {
					html = html + mainHtml + '</ul>';
				} else if (this.options.sideContentOn === "right") {
					if (mainlen > 0 && sidelen === 0) {
						html = html + mainHtml + '</ul>';
					} else {
						html = mainHtml + sideHtml;
					}
				} else {
					html = sideHtml + mainHtml;
				}
			}

			var cmpld = Handlebars.compile(html);
			this.log("prepraing html :-> template : " + this.options.template + " ,carts : " + this.options.showCarts + " ,cartType : " + this.options.cartType);
			this.log("html data : ", this.currentResults);
			return cmpld({
				data: this.currentResults
				, showCarts: this.options.showCarts
				, cartType: this.options.cartType
			});
		}
		, addToCache: function (q, processedData) {
			if (!(q in this.cache)) this.cache[q] = $.extend({}, processedData);
		}
		, inCache: function (q) {
			return q in this.cache && this.cache.hasOwnProperty(q);
		}
		, getFromCache: function (q) {
			return this.cache[q];
		}
		, destroy: function (self) {
			self.$input.unbind('.auto');
			self.input.lastSelected = null;
			self.$input.removeAttr('autocomplete', 'off');
			self.$results.remove();
			self.$input.removeData('autocomplete');
		}
		, setOption: function (name, value) {
			var a = name.split(".")

			if (a.length > 1) {
				var o = this.options;
				for (var i = 0; i < a.length - 1; i++) {
					if (!(a[i] in o))
						o[a[i]] = {};

					o = o[a[i]]
				}

				o[a[a.length - 1]] = value;
			} else
				this.options[name] = value;

			this.previous = "";
			this.$results.html("");
			this.cache = {};
			this.cache.length = 0;
		}
		, log: function () {
			// console.log("unbxd auto :",arguments);
		}
	});

	$.fn.unbxdautocomplete = function (options) {
		return this.each(function () {
			var self = this;

			try {
				this.auto = new autocomplete(this, options);
			} catch (e) {
				//console.log('autocomplete error',e);
			}
		});
	};
};
