
describe('Autosuggest', function () {

	before(function (done) {

		this.testAutoSuggestResponse = fixture.load('mocks/autoSuggestTestResponse.json');
		this.mockOptions = {
			maxSuggestions: 5
		}
		done();
	});



	it('Should have total count less than or equal to max suggestions', function () {
		unbxdAutoSuggestFunction(jQuery, Handlebars);
		window.autoSuggestObj.options = this.mockOptions;
		var count = window.autoSuggestObj.max_suggest(this.testAutoSuggestResponse);
		var total = count.infields + count.topquery + count.keyword + count.key_rem + count.top_rem;
		expect(total).to.be.at.most(this.mockOptions.maxSuggestions);
	});
});
