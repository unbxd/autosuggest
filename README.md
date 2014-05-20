## unbxdAutocomplete.js
#####no jquery auto complete library for unbxd search

Need to include **unbxdAutocomplete.js** and **style.css**.


### Example usage - default

```javascript
   var input = document.querySelector("#input"), //YOUR INPUT ELEMENT

   config = {
		
		maxHintNum :4, //MAX NO OF AUTO COMPLETE SUGGESTIONS, DEFAULT IS 5

		rows:20,  //NO OF ROWS TO BE FETCHED FROM SERVER 

		catagery:false,  //CATAGORY WISE BREAKDOWN IN THE AUTOCOMPLETE, GIVE TRUE IF YOU WANT THIS

		productDetails:true,  //PRODUCT DETAILS LIKE IMAGE AND  PRICE , GIVE TRUE IF YOU WANT THIS

		searchUrl:"//cl-sandbox-1375791452266.search.unbxdapi.com/ad93787f2f479e3e63b0161b3877ec7a/autosuggest" , // search URL for ur site ex "//cl-sandbox-1375791452266.search.unbxdapi.com/ad93787f2f479e3e63b0161b3877ec7a/autosuggest"

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
				height : "25px",
				padding: "2px 2px 2px 5px",
				margin: "0",
				overflow: "auto",
				listStyleType: "none",
				color : "#ffff",
				backgroundColor : "inherit",
				cursor : "default",
				fontSize : "16px"
			},
			//STYLES FOR SELECTED ROW ( MOUSE OVER )
			autoCompltHintSelected : {
				color : "none",
				backgroundColor : "#f2f2f2"
			}
		},
   }

   unbxdAutocomplete.enable(input,  config);
```

With default config you should get autosuggest like below

![default autosuggest](https://raw.githubusercontent.com/unbxd/autosuggest/master/screenshots/default.png "dafault autosuggest")


### Example usage - with category


```javascript
   var input = document.querySelector("#input"), //YOUR INPUT ELEMENT

   config = {
		
		maxHintNum :4, //MAX NO OF AUTO COMPLETE SUGGESTIONS, DEFAULT IS 5

		rows:20,  //NO OF ROWS TO BE FETCHED FROM SERVER 

		catagery:true,  //CATAGORY WISE BREAKDOWN IN THE AUTOCOMPLETE, GIVE TRUE IF YOU WANT THIS

		productDetails:true,  //PRODUCT DETAILS LIKE IMAGE AND  PRICE , GIVE TRUE IF YOU WANT THIS

		searchUrl:"//cl-sandbox-1375791452266.search.unbxdapi.com/ad93787f2f479e3e63b0161b3877ec7a/autosuggest" , // search URL for ur site ex "//cl-sandbox-1375791452266.search.unbxdapi.com/ad93787f2f479e3e63b0161b3877ec7a/autosuggest"

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
				height : "25px",
				padding: "2px 2px 2px 5px",
				margin: "0",
				overflow: "auto",
				listStyleType: "none",
				color : "#ffff",
				backgroundColor : "inherit",
				cursor : "default",
				fontSize : "16px"
			},
			//STYLES FOR SELECTED ROW ( MOUSE OVER )
			autoCompltHintSelected : {
				color : "none",
				backgroundColor : "#f2f2f2"
			}
		},
   }

   unbxdAutocomplete.enable(input,  config);
```

With ategory true in config you should get autosuggest like below

![autosuggest with category](https://raw.githubusercontent.com/unbxd/autosuggest/master/screenshots/category.png "autosuggest with category")

### Example usage - changing styles

for changing basic styles cgange default styles in config object.
If you want more styles you can change styles inside style.css

```javascript
   var input = document.querySelector("#input"), //YOUR INPUT ELEMENT

   config = {
		
		maxHintNum :4, //MAX NO OF AUTO COMPLETE SUGGESTIONS, DEFAULT IS 5

		rows:20,  //NO OF ROWS TO BE FETCHED FROM SERVER 

		catagery:true,  //CATAGORY WISE BREAKDOWN IN THE AUTOCOMPLETE, GIVE TRUE IF YOU WANT THIS

		productDetails:true,  //PRODUCT DETAILS LIKE IMAGE AND  PRICE , GIVE TRUE IF YOU WANT THIS

		searchUrl:"//cl-sandbox-1375791452266.search.unbxdapi.com/ad93787f2f479e3e63b0161b3877ec7a/autosuggest" , // search URL for ur site ex "//cl-sandbox-1375791452266.search.unbxdapi.com/ad93787f2f479e3e63b0161b3877ec7a/autosuggest"

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
				backgroundColor : "#FBF2EF",
				width:'',
				top:'',
				left:''
			},
			//STYLES FOR EACH ROW INSIDE WIDGET
			autoCompltHint : {
				height : "25px",
				padding: "2px 2px 2px 5px",
				margin: "0",
				overflow: "auto",
				listStyleType: "none",
				color : "#ffff",
				backgroundColor : "inherit",
				cursor : "default",
				fontSize : "16px"
			},
			//STYLES FOR SELECTED ROW ( MOUSE OVER )
			autoCompltHintSelected : {
				color : "none",
				backgroundColor : "#f2f2f2"
			}
		},
   }

   unbxdAutocomplete.enable(input,  config);
```

By giving widgetBackground in config you should get autosuggest like below

![autosuggest with styles changed](https://raw.githubusercontent.com/unbxd/autosuggest/master/screenshots/css-tweaks.png "autosuggest with new styles")


###### PS - if you want more css changes than given in config file, please override classes in styles.css

###### Thanks to -  [https://github.com/Fischer-L/autoComplt](https://github.com/Fischer-L/autoComplt)



