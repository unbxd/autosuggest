## unbxdAutocomplete.js
#####no jquery auto complete library for unbxd search

Include **unbxdAutocomplete.js** and **unbxdAutocomplete.css**.


### Example usage - default

```javascript
    var input = document.querySelector("#input"), //YOUR INPUT ELEMENT

   config = {

		UnbxdSiteName:'',
		
		UnbxdApiKey:'',

		formSubmit : false, //if input box is a form and you want to submit it on selection from autosuggest make this true

		inFields:{
			count: 1, //count of infield items you need
			fields:[ //specify the array of categories you get with infields along with count
				{
					name:'category',
					count:3
				},
				{
					name:'brand',
					count:3
				}
			]
		},

		//count of top queries in the auto suggest
		topQueries:{
			count: 3
		},
		
		//count of keyword suggestions in auto suggest
		keywordSuggestions:{
			count: 2
		},
		//popular products with image and other details
		popularProducts:{
			count: 4, 		//count of products
			title:true,		//display title, true or false
			price:true,		//display price true or false
			priceFunction:false, // you can give a calback function returning the price, product object wil be passed to this function while calling
			image:true,  //if false product image will not be displayed
			currency:'$', //currency to be displayed with price
			imageUrl:'image' ,//the property for image url to be picked
			productUrl:'url_path' // url to navigate on click of product
		},
		
		//this will be called on selecting a item from autosuggest, can be used to call search query
		callbackfunction:function( selectedValue, filterName, filterValue){
			console.log("value "+selectedValue +" "+ filterName + " "+ filterValue);
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
```

With default config you should get autosuggest like below


![autosuggest with category](https://raw.githubusercontent.com/unbxd/autosuggest/master/screenshots/default.png "autosuggest with category")

On selection on autosuggest function assigned to callbackfunction will be called with selected value and the filter if any


###### PS - if you want more css changes than given in config file, please override classes in styles.css

###### Thanks to -  [https://github.com/Fischer-L/autoComplt](https://github.com/Fischer-L/autoComplt)



