/* Floodlight (X)HTML Syntax Highlighter - v0.1
 *  Copyright 2010, Aron Carroll
 *  Released under the MIT license
 *  More Information: http://github.com/aron/floodlight.js
 */

(function (window, undefined) {
	var _filters = {},
	    options  = {
	    	prefix: '',
	    	spaces: '  ',
	    	regex: {
	    		encode:  /<|>|"|&/g,
	    		decode:  /&(?:lt|gt|quot|amp);/g
	    	},
	    	map: {
	    		encode: {'<':'&lt;', '>':'&gt;', '"':'&quot;', '&':'&amp;'},
	    		decode: {'&lt;':'<', '&gt;':'>', '&quot;':'"', '&amp;':'&'}
	    	}
	    };

	function isArray(array) {
		return Object.prototype.toString.call(array) === '[object Array]';
	}

	function entities(string, type) {
		return string.replace(options.regex[type], function (match) {
			return options.map[type][match];
		});
	}

	function wrap(string, klass) {
		return '<span class="' + options.prefix + klass + '">' + entities(string, 'encode') + '</span>';
	}

	function filter(filters, string) {
		var index = 0, count, filter;

		filters = isArray(filters) ? filters : [filters];
		for (count = filters.length; index < count; index += 1) {
			filter = _filters[filters[index]];

			if (filter) {
				string = string.replace(filter.regex, filter.callback);
			}
		}
		return string;
	}

	function addFilter(name, regex, callback) {
		_filters[name] = {regex: regex, callback: callback};
	}
	addFilter('trim', (/\t/g), function () { return options.spaces; });

	window.floodlight = function (source) {
		return window.floodlight.html(source);
	};

	window.floodlight.html = (function () {
		addFilter('html.tag', (/(<\/?)(\w+)([^>]*)(\/?>)/gi), function (match, open, tag, attr, close) {
			var attributes = filter('html.attr', attr);
			return wrap(open, 'bracket') + wrap(tag, 'tag') + attributes + wrap(close, 'bracket');
		});
		addFilter('html.attr', (/(\w+)(?:\s*=\s*("[^"]*"|'[^']*'|[^>\s]+))?/g), function (match, attr, value) {
			return wrap(attr, 'attribute') + (value ? '=' + wrap(value, 'value') : '');
		});
		addFilter('html.comment', (/<!--[^\-]*-->/g), function (comment) {
			return wrap(comment, 'comment');
		});
		
		return function (source) {
			return filter(['trim', 'html.tag', 'html.comment'], source);
		};
	}).call(floodlight);

	window.floodlight.encode  = function (string) { return entities(string, 'encode'); };
	window.floodlight.decode  = function (string) { return entities(string, 'decode'); };
	window.floodlight.options = options;
})(this);
