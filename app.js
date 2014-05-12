
  var input = document.querySelector("#input"), //YOUR INPUT ELEMENT

   config = {
		
		maxHintNum :5, //MAX NO OF AUTO COMPLETE SUGGESTIONS, DEFAULT IS 5

		rows:10,  //NO OF ROWS TO BE FETCHED FROM SERVER 

		catagery:true,  //CATAGORY WISE BREAKDOWN IN THE AUTOCOMPLETE, GIVE TRUE IF YOU WANT THIS

		productDetails:true,  //PRODUCT DETAILS LIKE IMAGE AND  PRICE , GIVE TRUE IF YOU WANT THIS

		searchUrl:"//cl-sandbox-1375791452266.search.unbxdapi.com/ad93787f2f479e3e63b0161b3877ec7a/autosuggest" // search URL for ur site ex "//cl-sandbox-1375791452266.search.unbxdapi.com/ad93787f2f479e3e63b0161b3877ec7a/autosuggest" 
	
		
   }

   unbxdAutocomplete.enable(input,  config);



	
		
		
		
		