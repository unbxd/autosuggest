
  var input = document.querySelector("#input"), //YOUR INPUT ELEMENT

   config = {
		
		maxHintNum :5, //MAX NO OF AUTO COMPLETE SUGGESTIONS, DEFAULT IS 5

		rows:20,  //NO OF ROWS TO BE FETCHED FROM SERVER 

		catagery:true,  //CATAGORY WISE BREAKDOWN IN THE AUTOCOMPLETE, GIVE TRUE IF YOU WANT THIS

		productDetails:true,  //PRODUCT DETAILS LIKE IMAGE AND  PRICE , GIVE TRUE IF YOU WANT THIS

		//searchUrl:"//cl-sandbox-1375791452266.search.unbxdapi.com/ad93787f2f479e3e63b0161b3877ec7a/autosuggest" , // search URL for ur site ex "//cl-sandbox-1375791452266.search.unbxdapi.com/ad93787f2f479e3e63b0161b3877ec7a/autosuggest"
         
        searchUrl:"//demo-u1393483043451.search.unbxdapi.com/ae30782589df23780a9d98502388555f/autosuggest",
		
		jsonpCallback:'?json.wrf=unbxdAutocomplete.parseResponse&filter=-doctype:"title"',
		
		callSearch:false, //IF YOU ARE USING WITH UNBXD SEARCH FOR DEMO MAKE THIS TRUE

		//STYLES FOR AUTOSUGGEST BOX, CHANGE THE VALUES HERE IF WANT STYLES APRT FROM DEFAULT ONE

		defaultStyles : {
		    //STYLES FOR WIDGET
			autoCompltList : {
				maxHeight : "400px",
				border : "1px solid rgb(170, 170, 170)",
				padding : "0",
				margin: "0",
				zIndex : 999,
				overflowX : "hidden",
				overflowY : "auto",
				display : "none",
				position: "absolute",
				backgroundColor : "#FFF",
				width:'',
				top:'',
				left:''
			},
			//STYLES FOR EACH ROW INSIDE WIDGET
			autoCompltHint : {
				height : "22px",
				padding: "2px 2px 2px 5px",
				margin: "0",
				overflow: "auto",
				listStyleType: "none",
				color : "#ffff",
				backgroundColor : "inherit",
				cursor : "default",
				fontSize : "14px"
			},
			//STYLES FOR SELECTED ROW ( MOUSE OVER )
			autoCompltHintSelected : {
				color : "none",
				backgroundColor : "#f2f2f2"
			}
		},
   }

   unbxdAutocomplete.enable(input,  config);



	
		
		
		
		