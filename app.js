
  var input = document.querySelector("#input"), //YOUR INPUT ELEMENT

   config = {

		
		UnbxdSiteKey:'',
		
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

		filter:{
			name:'',
			value:''
		},

		callbackfunction:function( selectedValue, filterName, filterValue, data){
			console.log("value "+selectedValue +" "+ filterName + " "+ filterValue);
			console.log(data);
		},
		

		defaultStyles : {
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

  
   unbxdAutosuggest.enable(input,  config);



	
		
		
		
		