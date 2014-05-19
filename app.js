
  var input = document.querySelector("#input"), //YOUR INPUT ELEMENT

   config = {
		
		maxHintNum :5, //MAX NO OF AUTO COMPLETE SUGGESTIONS, DEFAULT IS 5

		rows:10,  //NO OF ROWS TO BE FETCHED FROM SERVER 

		catagery:true,  //CATAGORY WISE BREAKDOWN IN THE AUTOCOMPLETE, GIVE TRUE IF YOU WANT THIS

		productDetails:true,  //PRODUCT DETAILS LIKE IMAGE AND  PRICE , GIVE TRUE IF YOU WANT THIS

		searchUrl:"//cl-sandbox-1375791452266.search.unbxdapi.com/ad93787f2f479e3e63b0161b3877ec7a/autosuggest" , // search URL for ur site ex "//cl-sandbox-1375791452266.search.unbxdapi.com/ad93787f2f479e3e63b0161b3877ec7a/autosuggest"

		//STYLES FOR AUTOSUGGEST BOX, GIVE VALUE IN NUMBERS WITHOUT ANY PREFIX
		//LEAVE IT 0 IF YOU WANT DEFAULT STYLES

		widgetWidth: 0, // eg - 500

		widgetTop:0 ,   // eg -100

		widgetLeft:0 , // eg - 500 

		widgetHeight:0, // eg 400

		widgetBackground:null // eg - 'green', 'red' leave it null if you want default white
	
		
   }

   unbxdAutocomplete.enable(input,  config);



	
		
		
		
		