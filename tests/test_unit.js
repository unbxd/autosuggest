describe('Autosuggest', function () {

	before(function (done) {
		this.testAutoSuggestResponse = fixture.load('mocks/autoSuggestTestResponse.json');
		this.cacheTestResponse = fixture.load('mocks/cacheTestResponse.json');
		this.mockSuggestions = ["shoes", "shirt", "shorts", "blue shirt", "dress shirt", "black shoes", "green shirt", "white shirt"];
		this.mockUniqueSuggestion = "dress shirts";
		this.mockCurrentResults = fixture.load('mocks/currentResults.json');
		unbxdAutoSuggestFunction(jQuery, Handlebars);
		this.trackUniversalSpy = sinon.spy(window.autoSuggestObj, 'trackuniversal');
		this.trackClassicalSpy = sinon.spy(window.autoSuggestObj, 'trackclassical');

		done();
	});

	it('Should have total count less than or equal to max suggestions', function () {
		var mockOptions = {
			maxSuggestions: 5
		}
		window.autoSuggestObj.options = mockOptions;
		var count = window.autoSuggestObj.max_suggest(this.testAutoSuggestResponse);
		var total = count.infields + count.topquery + count.keyword + count.key_rem + count.top_rem;
		expect(total).to.be.at.most(mockOptions.maxSuggestions);
	});

	it('Should have unique suggestions', function () {
		var isUnique = window.autoSuggestObj.isUnique(this.mockUniqueSuggestion, this.mockSuggestions);
		expect(isUnique).to.equal(false);
	});

	it('Should have correct count of suggestions in url query params', function () {
		var mockOptionsWithoutMaxSuggestions = {
			inFields: {
				count: 4
			},
			topQueries: {
				count: 2
			},
			keywordSuggestions: {
				count: 2
			},
			popularProducts: {
				count: 5,
				fields: []
			},
			promotedSuggestions: {
				count: 2
			}
		}

		var mockOptionsWithMaxSuggestions = {
			maxSuggestions: 5,
			popularProducts: {
				count: 5,
				fields: []
			},
		}

		// With Max Suggestions
		window.autoSuggestObj.options = mockOptionsWithoutMaxSuggestions;
		var autoSuggestUrl = window.autoSuggestObj.autosuggestUrl();
		console.log(autoSuggestUrl);
		var searchParams = new URLSearchParams(autoSuggestUrl);
		expect(searchParams.get('inFields.count')).to.equal(mockOptionsWithoutMaxSuggestions.inFields.count.toString());
		expect(searchParams.get('topQueries.count')).to.equal(mockOptionsWithoutMaxSuggestions.topQueries.count.toString());
		expect(searchParams.get('keywordSuggestions.count')).to.equal(mockOptionsWithoutMaxSuggestions.keywordSuggestions.count.toString());
		expect(searchParams.get('popularProducts.count')).to.equal(mockOptionsWithoutMaxSuggestions.popularProducts.count.toString());
		expect(searchParams.get('promotedSuggestion.count')).to.equal(mockOptionsWithoutMaxSuggestions.promotedSuggestions.count.toString());


		// Without Max Suggestions
		window.autoSuggestObj.options = mockOptionsWithMaxSuggestions;
		var autoSuggestUrl = window.autoSuggestObj.autosuggestUrl();
		var searchParams = new URLSearchParams(autoSuggestUrl);
		expect(searchParams.get('inFields.count')).to.equal(mockOptionsWithMaxSuggestions.maxSuggestions.toString());
		expect(searchParams.get('topQueries.count')).to.equal(mockOptionsWithMaxSuggestions.maxSuggestions.toString());
		expect(searchParams.get('keywordSuggestions.count')).to.equal(mockOptionsWithMaxSuggestions.maxSuggestions.toString());
		expect(searchParams.get('popularProducts.count')).to.equal(mockOptionsWithMaxSuggestions.maxSuggestions.toString());
		expect(searchParams.get('promotedSuggestion.count')).to.equal(mockOptionsWithMaxSuggestions.maxSuggestions.toString());

	});

	it('Should have called Universal/Classical analytics', function () {
		var type = "search";
		var obj = {
			"query": "Shirt",
			"autosuggestParams": {
				"autosuggest_type": "IN_FIELD",
				"autosuggest_suggestion": "Shirt",
				"field_value": "White",
				"field_name": "color",
				"src_field": "type",
				"pid": null,
				"unbxdprank": 6,
				"internal_query": "sh"
			}
		};

		var mockOptionsUniversal = {
			integrations: {
				universal: true
			}
		}

		var mockOptionsClassical = {
			integrations: {
				classical: true
			}
		}
		window.autoSuggestObj.options = mockOptionsUniversal;
		window.autoSuggestObj.addToAnalytics(type, obj);
		expect(this.trackUniversalSpy).to.have.been.calledWith(type, obj);

		window.autoSuggestObj.options = mockOptionsClassical;
		window.autoSuggestObj.addToAnalytics(type, obj);
		expect(this.trackClassicalSpy).to.have.been.calledWith(type, obj);
	});

	it('Should have correct endpoint based on com or io platform', function () {
		var mockOptionsCom = {
			platform: 'com'
		}

		var mockOptionsIo = {
			platform: 'io',
			searchEndPoint:'//search.unbxd.io'
		}

		var devMockOptionsIo = {
			platform: 'io',
			searchEndPoint:'//dev-search.unbxd.io'
		}

		window.autoSuggestObj.options = mockOptionsCom;
		var url = window.autoSuggestObj.getHostDomainName();
		expect(url).to.equal("//search.unbxdapi.com/");

		window.autoSuggestObj.options = mockOptionsIo;
		var url = window.autoSuggestObj.getHostDomainName();
		expect(url).to.equal("//search.unbxd.io/");

		window.autoSuggestObj.options = devMockOptionsIo;
		var url = window.autoSuggestObj.getHostDomainName();
		expect(url).to.equal("//dev-search.unbxd.io/");
	});

	it('Should have suggestions sorted by length if enabled', function () {
		var mockOptions = {
			sortByLength: true
		}

		window.autoSuggestObj.options = mockOptions;
		window.autoSuggestObj.currentResults.KEYWORD_SUGGESTION = this.mockCurrentResults.keywordSuggestions;
		window.autoSuggestObj.currentResults.TOP_SEARCH_QUERIES = this.mockCurrentResults.topQueries;
		window.autoSuggestObj.currentResults.IN_FIELD = this.mockCurrentResults.inFields;
		window.autoSuggestObj.currentResults.PROMOTED_SUGGESTION = this.mockCurrentResults.promotedSuggestions;
		window.autoSuggestObj.sortSuggestionsBylength();
		var sortedSuggestions = window.autoSuggestObj.currentResults.SORTED_SUGGESTIONS;
		
		var inFields = window.autoSuggestObj.currentResults.IN_FIELD;
		var sorted = false;
		var sortedInfields = false;
		for (var i = 0; i < sortedSuggestions.length - 1; i++) {
			if (i < (sortedSuggestions.length - 1) && (sortedSuggestions[i]['autosuggest'].length <= sortedSuggestions[i + 1]['autosuggest'].length)) {
				sorted = true;
			}
			else {
				sorted = false;
			}
		}
		for (var i = 0; i < inFields.length - 1; i++) {
			if (i < (inFields.length - 1) && (inFields[i]['autosuggest'].length <= inFields[i + 1]['autosuggest'].length)) {
				sortedInfields = true;
			}
			else {
				sortedInfields = false;
			}
		}
		expect(sorted).to.equal(true);
		expect(sortedInfields).to.equal(true);
	});
});
