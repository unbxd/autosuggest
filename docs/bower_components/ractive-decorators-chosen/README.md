Ractive.js chosen decorator plugin
======================================================

Integrate Chosen with Ractive, including two-way binding.

*Find more Ractive.js plugins at [ractivejs.org/plugins](http://ractivejs.org/plugins)*

[See the demo here.](http://kalcifer.github.io/ractive-decorators-chosen/)

Usage
-----

Include this file on your page below Ractive, e.g:

```html
<script src='lib/ractive.js'></script>
<script src='lib/ractive-decorators-chosen.js'></script>
```

Or, if you're using a module loader, require this module:

```js
// requiring the plugin will 'activate' it - no need to use the return value
require( 'ractive-decorators-chosen' );
```

Add the decorator to your select elements:

```html
<select decorator='chosen' value='{{selected}}'>
    {{#options}}
        <option value='{{.}}'>{{.}}</option>
    {{/options}}
</select>
```

Add option objects to the `type` property to set chosen options:

```js
Ractive.decorators.chosen.type.demo = {
    width: '25%',
    // ... other chosen options
};
```

```html
<select decorator='chosen:demo' value='{{selected}}'>
    {{#options}}
        <option value='{{.}}'>{{.}}</option>
    {{/options}}
</select>
```

You can also use a function that returns an options object. The function is passed the DOM node the chosen applies to:

```js
Ractive.decorators.chosen.type.demo = function (node) {
    return {
        width: '25%',
        // ... other chosen options
    }
};
```

License
-------
Copyright (c) 2014 Kalcifer. Forked from [Prezent Internet B.V.](http://www.prezent.nl). Licensed MIT

Created with the [Ractive.js plugin template](https://github.com/ractivejs/plugin-template) for Grunt.
