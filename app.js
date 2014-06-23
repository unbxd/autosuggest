
  var input = document.querySelector("#input"), //YOUR INPUT ELEMENT

   config = {

		rows:20,  //NO OF ROWS TO BE FETCHED FROM SERVER 

		catagery:true,  //CATAGORY WISE BREAKDOWN IN THE AUTOCOMPLETE, GIVE TRUE IF YOU WANT THIS

		catageryLength:3,  

		productDetails:true,  //PRODUCT DETAILS LIKE IMAGE AND  PRICE , GIVE TRUE IF YOU WANT THIS

		unbxdShowProductImg:true,

		unbxdShowProductName:true,

		unbxdShowProductPrice:false,

		searchUrl:"//demo-u1393483043451.search.unbxdapi.com/ae30782589df23780a9d98502388555f/autosuggest",
        
       // searchUrl:"//tix4cause-u1403176244496.search.unbxdapi.com/7b0e6e36282b6db1bfd69a2af86b4674/autosuggest",
		
		jsonpCallback:'?json.wrf=unbxdAutocomplete.parseResponse',
		
		callSearch: true, //IF YOU ARE USING WITH UNBXD SEARCH FOR DEMO MAKE THIS TRUE

		formSubmit : false,


		//STYLES FOR AUTOSUGGEST BOX, CHANGE THE VALUES HERE IF WANT STYLES APRT FROM DEFAULT ONE

		defaultStyles : {
		    //STYLES FOR WIDGET
			autoCompltList : {
				maxHeight : "400px",
				border : "1px solid rgb(170, 170, 170)",
				padding : "0",
				margin: "0",
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
				// color : "none",
				// backgroundColor : "#f2f2f2"
			}
		},
   }

  
   unbxdAutocomplete.enable(input,  config);



	
		
		
		
		