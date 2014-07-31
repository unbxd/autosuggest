## unbxdAutocomplete.js
#####no jquery auto complete library for unbxd search

Include **unbxdAutocomplete.js** and **unbxdAutocomplete.css**.


### Example usage - default

```javascript
    var input = document.querySelector("#input"), //YOUR INPUT ELEMENT

   config = {

		searchUrl:"http://<unbxd_site_ key>.search.unbxdapi.com/<unbxd_api_key>/autosuggest",

		formSubmit : false, //if input box is a form and you want to submit it on selection from autosuggest make this true

		inFields:{
			count: 2,
			inBrandCount: 2,
			inCategoriesCount: 2
		},

		topQueries:{
			count: 2
		},

		keywordSuggestions:{
			count: 2
		},

		productDetails:true,

		popularProducts:{
			count: 3,
			title:true,
			price:false,
			image:true,
			imageUrl:null
		},
		
		//this will be called on selecting a item from autosuggest, can be used to call search query
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
```

With default config you should get autosuggest like below


![autosuggest with category](https://raw.githubusercontent.com/unbxd/autosuggest/master/screenshots/default.png "autosuggest with category")

On selection on autosuggest function assigned to callbackfunction will be called with selected value and the filter if any


###### PS - if you want more css changes than given in config file, please override classes in styles.css

###### Thanks to -  [https://github.com/Fischer-L/autoComplt](https://github.com/Fischer-L/autoComplt)



