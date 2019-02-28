describe('Autosuggest', function () {

	before(function (done) {
		this.testAutoSuggestResponse = fixture.load('mocks/autoSuggestTestResponse.json');
		this.mockSuggestions = ["shoes", "shirt", "shorts", "blue shirt", "dress shirt", "black shoes", "green shirt", "white shirt"];
		this.mockUniqueSuggestion = "dress shirts";
		unbxdAutoSuggestFunction(jQuery, Handlebars);
		this.trackUniversalSpy = sinon.spy(window.autoSuggestObj,'trackuniversal');
		this.trackClassicalSpy = sinon.spy(window.autoSuggestObj,'trackclassical');	
		done();
	});

	it('Should have total count less than or equal to max suggestions', function () {
		unbxdAutoSuggestFunction(jQuery, Handlebars);
		window.autoSuggestObj.options = this.mockOptions;
		var count = window.autoSuggestObj.max_suggest(this.testAutoSuggestResponse);
		var total = count.infields + count.topquery + count.keyword + count.key_rem + count.top_rem;
		expect(total).to.be.at.most(this.mockOptions.maxSuggestions);
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
		var isUnique = window.autoSuggestObj.isUnique(this.mockUniqueSuggestion,this.mockSuggestions);
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
				count: 5
			}
		}

		var mockOptionsWithMaxSuggestions = {
			maxSuggestions: 5,
			popularProducts: {
				count: 5
			}
		}

		// With Max Suggestions
		window.autoSuggestObj.options = mockOptionsWithoutMaxSuggestions;
		var autoSuggestUrl = window.autoSuggestObj.autosuggestUrl();
		var searchParams = new URLSearchParams(autoSuggestUrl);
		expect(searchParams.get('inFields.count')).to.equal(mockOptionsWithoutMaxSuggestions.inFields.count.toString());
		expect(searchParams.get('topQueries.count')).to.equal(mockOptionsWithoutMaxSuggestions.topQueries.count.toString());
		expect(searchParams.get('keywordSuggestions.count')).to.equal(mockOptionsWithoutMaxSuggestions.keywordSuggestions.count.toString());
		expect(searchParams.get('popularProducts.count')).to.equal(mockOptionsWithoutMaxSuggestions.popularProducts.count.toString());
		
		// Without Max Suggestions
		window.autoSuggestObj.options = mockOptionsWithMaxSuggestions;
		var autoSuggestUrl = window.autoSuggestObj.autosuggestUrl();
		var searchParams = new URLSearchParams(autoSuggestUrl);
		expect(searchParams.get('inFields.count')).to.equal(mockOptionsWithMaxSuggestions.maxSuggestions.toString());
		expect(searchParams.get('topQueries.count')).to.equal(mockOptionsWithMaxSuggestions.maxSuggestions.toString());
		expect(searchParams.get('keywordSuggestions.count')).to.equal(mockOptionsWithMaxSuggestions.maxSuggestions.toString());
		expect(searchParams.get('popularProducts.count')).to.equal(mockOptionsWithMaxSuggestions.maxSuggestions.toString());		
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
		window.autoSuggestObj.addToAnalytics(type,obj);
		expect(this.trackUniversalSpy).to.have.been.calledWith(type,obj);

		window.autoSuggestObj.options = mockOptionsClassical;
		window.autoSuggestObj.addToAnalytics(type,obj);
		expect(this.trackClassicalSpy).to.have.been.calledWith(type,obj);
	});
});

