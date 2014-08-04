
  var input = document.querySelector("#input"), //YOUR INPUT ELEMENT

   config = {

		searchUrl:"//<unbxd_site_ key>.search.unbxdapi.com/<unbxd_api_key>/autosuggest",

		formSubmit : false,

		inFields:{
			count: 1,
			fields:[
				{
					name:'brand',
					count:3
				},
				{
					name:'category',
					count:3
				},
				{
					name:'color',
					count:3
				}
			]
		},

		topQueries:{
			count: 3
		},

		keywordSuggestions:{
			count: 2
		},

		productDetails:true,

		popularProducts:{
			count: 4,
			title:true,
			price:false,
			image:true,
			imageUrl:'image' ,//the property for image url to be picked
			productUrl:'url_path' // url to navigate to product page
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



	
		
		
		
		