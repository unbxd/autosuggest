
  var input = document.querySelector("#input"), //YOUR INPUT ELEMENT

   config = {
		
		maxHintNum :5, //MAX NO OF AUTO COMPLETE SUGGESTIONS, DEFAULT IS 5

		rows:20,  //NO OF ROWS TO BE FETCHED FROM SERVER 

		catagery:true,  //CATAGORY WISE BREAKDOWN IN THE AUTOCOMPLETE, GIVE TRUE IF YOU WANT THIS

		productDetails:true,  //PRODUCT DETAILS LIKE IMAGE AND  PRICE , GIVE TRUE IF YOU WANT THIS

		searchUrl:"//cl-sandbox-1375791452266.search.unbxdapi.com/ad93787f2f479e3e63b0161b3877ec7a/autosuggest" , // search URL for ur site ex "//cl-sandbox-1375791452266.search.unbxdapi.com/ad93787f2f479e3e63b0161b3877ec7a/autosuggest"

		callSearch:false, //IF YOU ARE USING WITH UNBXD SEARCH FOR DEMO MAKE THIS TRUE

		//STYLES FOR AUTOSUGGEST BOX, GIVE VALUE IN NUMBERS WITHOUT ANY PREFIX
		//LEAVE IT 0 IF YOU WANT DEFAULT STYLES

		widgetWidth:null, // eg - 500

		widgetTop:false,   // eg -100

		widgetLeft:false , // eg - 500 

		widgetMaxheight:400, // maximum height allowed for widget eg 400 

		widgetBackground:'#FBF2EF', // eg - 'green', 'red' leave it null if you want default white
	
		hintHeight:false,  //height of each hint in auto suggest widget
   }

   unbxdAutocomplete.enable(input,  config);



	
		
		
		
		