## unbxdAutocomplete.js
#####no jquery auto complete library for unbxd search

Need to include **unbxdAutocomplete.js** and **style.css**.


### Example usage - default

```javascript
  var input = document.querySelector("#input"), //YOUR INPUT ELEMENT

   config = {
		

		rows:20,        //NO OF ROWS TO BE FETCHED FROM SERVER 

		catagery:flase,  //CATAGORY WISE BREAKDOWN IN THE AUTOCOMPLETE, GIVE TRUE IF YOU WANT THIS  

		productDetails:true,  //PRODUCT DETAILS LIKE IMAGE AND  PRICE , GIVE TRUE IF YOU WANT THIS

		searchUrl:"//serach.url.of.your.site" , // search URL for ur site ex "//cl-sandbox-1375791452266.search.unbxdapi.com/ad93787f2f479e3e63b0161b3877ec7a/autosuggest"

		callSearch:false, //IF YOU ARE USING WITH UNBXD SEARCH FOR DEMO MAKE THIS TRUE

		//STYLES FOR AUTOSUGGEST BOX, GIVE VALUE IN NUMBERS WITHOUT ANY PREFIX
		//LEAVE IT TO null IF YOU WANT DEFAULT STYLES

		widgetWidth:null, // eg - 500

		widgetTop:null,   // eg -100

		widgetLeft:null , // eg - 500 

		widgetMaxheight:400, // maximum height allowed for widget eg 400 

		widgetBackground:'', // eg - 'green', 'red' leave it null if you want default white
	
		hintHeight:false,  //height of each hint in auto suggest widget
   }

   unbxdAutocomplete.enable(input,  config);
```

With default config you should get autosuggest like below

![default autosuggest](https://raw.githubusercontent.com/unbxd/autosuggest/master/screenshots/default.png "dafault autosuggest")


### Example usage - with category

```javascript
  var input = document.querySelector("#input"), //YOUR INPUT ELEMENT

   config = {

		catagery:true  

   }

   unbxdAutocomplete.enable(input,  config);
```

With ategory true in config you should get autosuggest like below

![autosuggest with category](https://raw.githubusercontent.com/unbxd/autosuggest/master/screenshots/category.png "autosuggest with category")

### Example usage - changing styles

```javascript
  var input = document.querySelector("#input"), //YOUR INPUT ELEMENT

   config = {

		catagery:true ,

		widgetBackground:'#FBF2EF'

   }

   unbxdAutocomplete.enable(input,  config);
```

By giving widgetBackground in config you should get autosuggest like below

![autosuggest with styles changed](https://raw.githubusercontent.com/unbxd/autosuggest/master/screenshots/css-tweaks.png "autosuggest with new styles")


###### PS - if you want more css changes than given in config file, please override classes in styles.css



