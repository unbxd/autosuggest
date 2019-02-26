
describe('Autosuggest', function () {

	before(function (done) {

		this.testAutoSuggestResponse = fixture.load('mocks/autoSuggestTestResponse.json');
		this.mockOptions = {
			maxSuggestions: 5
		}
		this.mockSuggestions = ["shoes", "shirt", "shorts", "blue shirt", "dress shirt", "black shoes", "green shirt", "white shirt"];
		this.mockUniqueSuggestion = "dress shirts";
		done();
	});



	it('Should have total count less than or equal to max suggestions', function () {
		unbxdAutoSuggestFunction(jQuery, Handlebars);
		window.autoSuggestObj.options = this.mockOptions;
		var count = window.autoSuggestObj.max_suggest(this.testAutoSuggestResponse);
		var total = count.infields + count.topquery + count.keyword + count.key_rem + count.top_rem;
		expect(total).to.be.at.most(this.mockOptions.maxSuggestions);
	});

	it('Should have unique suggestions', function () {
		unbxdAutoSuggestFunction(jQuery, Handlebars);
		var isUnique = window.autoSuggestObj.isUnique(this.mockUniqueSuggestion,this.mockSuggestions);
		expect(isUnique).to.equal(false);
	});
});
