/**
 * A class that can be used for convenience when nested async calls are involved.
 * It behaves as an event bus.
 */

var _ = require('underscore');

var Bus = function(req, res){
    this.req = req;
    this.res = res;

    /**
     * Subscribes a method on a token
     */
    this.on = function(scope, token, listener){
    	if(arguments.length < 3){
    		listener = token;
    		token = scope;
    		scope = undefined;
    	}
        this[token] = listener;
        
        if(scope != undefined)
        	_.bind(listener, scope);
    };

    /**
     * Calls the method subscribed for the token and passes data as a parameter
     */
    this.fire = function(token){
    	if (this[token] != undefined){
    		fn = this[token];
    		
    		shift = [].shift;
    		shift.apply(arguments);
    		fn.apply(this, arguments || []);
        }
    };
};

module.exports = Bus;