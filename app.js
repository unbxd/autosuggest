
  var input = document.querySelector("#input"), //YOUR INPUT ELEMENT

   config = {

		
		UnbxdSiteName:'',
		
		UnbxdApiKey:'',

		formSubmit : false,

		inFields:{
			count: 4,
			fields:[
				{
					name:'catlevel3Name',
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
			count: 3
		},

		productDetails:true,

		popularProducts:{
			count: 4,
			title:true,
			price:true,
			image:true,
			currency:'$',
			imageUrl:'image' ,//the property for image url to be picked
			productUrl:'url_path' // url to navigate to product page
		},

		callbackfunction:function( selectedValue, filterName, filterValue, data){
			console.log("value "+selectedValue +" "+ filterName + " "+ filterValue);
			console.log(data);
		},
		

		//STYLES FOR AUTOSUGGEST BOX, CHANGE THE VALUES HERE IF WANT STYLES APRT FROM DEFAULT ONE
		defaultStyles : {
		    //STYLES FOR WIDGET
			autoCompltList : {
				maxHeight 	: "400px",
				border 		: "1px solid black",
				backgroundColor : "white",
				width:'default',
				top:'default',
				left:'default',
				padding: "4px 0px 0px 0px",
				margin:"0px 0px 0px 0px"
			},
			//STYLES FOR EACH ROW INSIDE WIDGET
			autoCompltHint : {
				height : "23px",
				padding: "0px 0px 0px 5px",
				margin: "0px 0px 0px 0px",
				color : "black",
				backgroundColor:'white',
				fontSize : "14px"
			}
		}
   }

  
   unbxdAutocomplete.enable(input,  config);



	
		
		
		
		