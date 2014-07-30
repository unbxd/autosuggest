
  var input = document.querySelector("#input"), //YOUR INPUT ELEMENT

   config = {

		//searchUrl:"//plazawatches-u1403767348149.search.unbxdapi.com/e754b9ef9da2d315d4a97aa57457b81e/autosuggest",
		// searchUrl:"//tix4cause-u1403176244496.search.unbxdapi.com/7b0e6e36282b6db1bfd69a2af86b4674/autosuggest",
		//searchUrl:"//144.76.115.176:8086/unbxd-search/shivam1-u1394705575346/autosuggest",
		searchUrl:"//getit_auto32-u1406102721153.search.unbxdapi.com/7e4f5215216ccde1b101a09909f34ee1/autosuggest",

		formSubmit : false,

		inFields:{
			count: 2,
			inBrandCount: 3,
			inCategoriesCount: 3
		},

		topQueries:{
			count: 2
		},

		keywordSuggestions:{
			count: 2
		},

		productDetails:true,

		popularProducts:{
			count: 2,
			title:true,
			price:false,
			image:true,
			imageUrl:null
		},

		callbackfunction:function( selectedValue, filterName, filterValue){
			console.log("value "+selectedValue +" "+ filterName + " "+ filterValue);
		},
		

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
			}
		},
   }

  
   unbxdAutocomplete.enable(input,  config);



	
		
		
		
		