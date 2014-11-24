## unbxdAutosuggest.js
#####This library depends on jQuery and Handlebars libraries.

###Usage
Please include Jquery, Handlebars and unbxdautosuggest.js in order. Then add the required configuration.

###Configuration
```javascript
$(function(){
		$("#input").autocomplete({
			siteName : 'demosite-u1407617955968'
			,APIKey : '64a4a2592a648ac8415e13c561e44991'
			,minChars : 2
			,delay : 100
			,loadingClass : 'unbxd-as-loading'
			,width : 0
			,zIndex : 0
			,position : 'absolute'
			,template : "1column" 
			,sideContentOn : "right"
			,showCarts : false
			,cartType : "separate"
			,onSimpleEnter : function(){
			    console.log("Simple enter :: do a form submit")
			    //this.input.form.submit();
			}
			,onItemSelect : function(data,original){
				console.log("onItemSelect",arguments);
			}
			,onCartClick : function(data,original){
				console.log("addtocart", arguments);
				return true;
			}
			,inFields:{
				count: 2,
				fields:{
					'brand':3
					,'category':3
					,'color':3
				}
			},
			topQueries:{
				count: 2
			},
			keywordSuggestions:{
				count: 2
			}
			,popularProducts:{
				count: 2
				,price: true
				,priceFunctionOrKey : "price"
				,image: true
				,imageUrlOrFunction: "imageUrl"
				,currency : "$"
			}
		});
	});
```
- **siteName** : This value can be found in UNBXD dashboard. It is unique for every search site created in the dashboard.
- **APIKey** : This is a unique for every user account. It can also be found in dashboard.
- **minChars** : Minimum number of characters required to start showing suggestions. The value should be 0 or greater than 0
- **delay** : Number of milliseconds to wait before fetching results from server. This is helpful in waiting till user stops typing. 
- **loadingClass** : This class name will be added to input during data fetching process, so that user can see some loader animation or state change.
- **width** : if set any value (only integer), then it will be used to set the width of suggestions else defaults to input width.
- **position** : either **absoulte** or **fixed**
- **template** : either **1column** or **2column**
- **sideContentOn** : either **left** or **right**. Used only when **template** is set to **2column**
- **showCarts** : either **true** or **false**. To show Add-to-cart button and quantity input.
- **cartType** : either **inline** or **separate**. Used only when **showCarts** is set to **true**
- **onSimpleEnter** : This function will be called if user presses *enter* key without selecting any result.
- **onItemSelect** : This function will be called when a user selects one of the suggestions. It will be passed 2 arguments. The first argument is shown below and second value will be the original value from Unbxd.
    ```javascript
    {//the first argument
        value : ""//user selected value
        ,type : ""//IN_FIELD || KEYWORD_SUGGESTION || TOP_SEARCH_QUERIES || POPULAR_PRODUCTS
        ,filtername : ""//available only incase of IN_FIELD
        ,filtervalue : ""//available only incase of IN_FIELD
    }
    ```
- **onCartClick** : this function will be called when a user clicks on Add-to-cart button. The arguments will be same as **onItemSelect** but it includes quantity and uniqueId of the product.
- **inFields** : This is an object with 2 properties. The first is **count** which is useful to adjust the number of IN-FEIDLS shown to user and the second is **fields** which is useful in adjusting what kind of values are shown in secondary level *in-suggestions*.
    ```javascript
    ,inFields:{
        //number of in-fields to display
		count: 2,
		//you can add or remove from fields list and also change the respective counts
		fields:{
			'brand':3 //show 3 values from brand
			,'category':3 //show 3 from category
			,'color':3 //show 3 from color
		}
	},
    ```
- **topQueries** : It takes an object with single property count. This will help in setting the number of top-queries shown to user.
- **keywordSuggestions** : It takes an object with single property count. This will help in setting the number of keyword-suggests shown to user.
- **popularProducts** : This value takes an object with different properties as explained below.
    ```javascript
    ,popularProducts:{
		count: 2 //number of products to be shown
		,price: true //to show price in case of carts
		,priceFunctionOrKey : "price" //it can also be a function which takes an object as argument and returns a string or number
		,image: true //to show image
		,imageUrlOrFunction: "imageUrl" //it can also be a function which takes an object as argument and returns a image url
		,currency : "$"
	}
    ```

###### PS - if you want more css changes than given in config file, please override classes in unbxdAutosuggest.css 