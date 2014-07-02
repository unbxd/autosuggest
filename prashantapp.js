	
  var input = document.querySelector("#input"), //YOUR INPUT ELEMENT

   config = {

		rows:10,  //NO OF ROWS TO BE FETCHED FROM SERVER 

		catagery:true,  //CATAGORY WISE BREAKDOWN IN THE AUTOCOMPLETE, GIVE TRUE IF YOU WANT THIS

		suggestions:{//
			numSuggestions: 6,
			inBrandCount: 3,
			inCategoriesCount: 3
		},

		topQuerySuggestions:{//
			numSuggestions: 3
		},

		unbxdSuggestions:{
			numSuggestions: 3
		},

		popularProducts:{//
			numSuggestions: 3,
			title:true,
			price:true,
			image:true,
			imageUrl:null
		},

		productDetails:true,  //PRODUCT DETAILS LIKE IMAGE AND  PRICE , GIVE TRUE IF YOU WANT THIS

		unbxdShowProductImg:true,

		unbxdShowProductName:true,

		unbxdShowProductPrice:true,

		siteKey: demo-u1393483043451,

		apiKey: ae30782589df23780a9d98502388555f,//

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
				padding: "0 2px 0 5px",
				margin: "0",
				overflow: "auto",
				listStyleType: "none",
				color : "#ffff",
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



	
		
		
		
		