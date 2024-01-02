/*

    ractive-decorators-chosen
    =============================================

    Integrate Ractive with chosen

    ==========================

    Troubleshooting: If you're using a module system in your app (AMD or
    something more nodey) then you may need to change the paths below,
    where it says `require( 'ractive' )` or `define([ 'ractive' ]...)`.

    ==========================

    Usage: Include this file on your page below Ractive, e.g:

        <script src='lib/ractive.js'></script>
        <script src='lib/ractive-decorators-chosen.js'></script>

    Or, if you're using a module loader, require this module:

        // requiring the plugin will 'activate' it - no need to use
        // the return value
        require( 'ractive-decorators-chosen' );

*/

(function ( global, factory ) {

    'use strict';

    // Common JS (i.e. browserify) environment
    if ( typeof module !== 'undefined' && module.exports && typeof require === 'function' ) {
        factory( require( 'ractive' ), require( 'jquery' ) );
    }

    // AMD?
    else if ( typeof define === 'function' && define.amd ) {
        define([ 'ractive', 'jquery' ], factory );
    }

    // browser global
    else if ( global.Ractive && global.jQuery) {
        factory( global.Ractive, global.jQuery );
    }

    else {
        throw new Error( 'Could not find Ractive or jQuery! They must be loaded before the ractive-decorators-chosen plugin' );
    }

}( typeof window !== 'undefined' ? window : this, function ( Ractive, $ ) {

    'use strict';

    var chosenDecorator;

    chosenDecorator = function (node, type) {

        var ractive = node._ractive.root;
        var setting = false;
        var observer;

        var options = {};
        if (type) {
            if (!chosenDecorator.type.hasOwnProperty(type)) {
                throw new Error( 'Ractive Chosen type "' + type + '" is not defined!' );
            }

            options = chosenDecorator.type[type];
            if (typeof options === 'function') {
                options = options.call(this, node);
            }
        }

        // Push changes from ractive to chosen
        if (node._ractive.binding) {
            observer = ractive.observe(node._ractive.binding.keypath, function (newvalue, oldvalue) {
                if (!setting) {
                    setting = true;
                    window.setTimeout(function () {
                        if(newvalue === '' || newvalue !== oldvalue)
                            $(node).trigger('chosen:updated');

                        $(node).change();
                        setting = false;
                    }, 0);
                }
            });
        }

        // Pull changes from chosen to ractive
        $(node).chosen(options).on('change', function () {
            if (!setting) {
                setting = false;
                ractive.updateModel();
            }
        });

        return {
            teardown: function () {
                $(node).chosen('destroy');

                if (observer) {
                    observer.cancel();
                }
            }
        };
    };

    chosenDecorator.type = {};

    Ractive.decorators.chosen = chosenDecorator;

}));