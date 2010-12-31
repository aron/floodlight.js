/*  Floodlight (X)HTML Syntax Highlighter - v0.1
 *  Copyright 2010, Aron Carroll
 *  Released under the MIT license
 *  More Information: http://github.com/aron/floodlight.js
 *  Based on hijs by Alexis Sellier https://github.com/cloudhead/hijs
 */

(function (window, undefined) {
	var _filters = {},
	    _table = {},
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

	function encode(string) {
		var characters = string.split(''),
		    encoded = [],
		    count = characters.length,
		    index = 0;

		for (; index < count;index += 1) {
			if (characters[index].charCodeAt(0) > 127) {
				encoded.push(characters[index]);
			} else {
				encoded.push(String.fromCharCode(characters[index].charCodeAt(0) + 0x2800));
			}
		}

		encoded = encoded.join('');
		_table[encoded] = string;
		return encoded;
	}

	function decode(string) {
		return _table[string];
	}

	function escapeMatch(string, klass) {
		return '\u00ab' + encode(klass)  + '\u00b7'
		                + encode(string) +
		       '\u00b7' + encode(klass)  + '\u00bb';
	}

	function unescapeMatch(string) {
		return string.replace(/\u00ab(.+?)\u00b7(.+?)\u00b7\1\u00bb/g, function (_, name, value) {
			value = value.replace(/\u00ab[^\u00b7]+\u00b7/g, '').replace(/\u00b7[^\u00bb]+\u00bb/g, '');
			return wrap(decode(value), decode(name));
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

	// ! floodlight();

	window.floodlight = function (source) {
		return window.floodlight.html(source);
	};
	window.floodlight.options = options;
	window.floodlight.encode  = function (string) { return entities(string, 'encode'); };
	window.floodlight.decode  = function (string) { return entities(string, 'decode'); };

	addFilter('whitespace', (/\t/g), function () { return options.spaces; });

	// ! floodlight.html();

	window.floodlight.html = function (source) {
		return filter(window.floodlight.html.filters, source);
	};

	(function () {
		this.regex = {
			tag:     (/(<\/?)(\w+)([^>]*)(\/?>)/g),
			attr:    (/(\w+)(?:\s*=\s*("[^"]*"|'[^']*'|[^>\s]+))?/g),
			comment: (/<!--[^\-]*-->/g)
		};

		this.filters = ['whitespace', 'html.tag', 'html.comment'];

		addFilter('html.tag', this.regex.tag, function (match, open, tag, attr, close) {
			var attributes = filter('html.attr', attr);
			return wrap(open, 'html-bracket') + wrap(tag, 'html-tag') + attributes + wrap(close, 'html-bracket');
		});

		addFilter('html.attr', this.regex.attr, function (match, attr, value) {
			return wrap(attr, 'html-attribute') + (value ? '=' + wrap(value, 'html-value') : '');
		});

		addFilter('html.comment', this.regex.comment, function (comment) {
			return wrap(comment, 'html-comment');
		});
	}).call(window.floodlight.html);

	// ! floodlight.javascript();

	window.floodlight.javascript = function (source) {
			return unescapeMatch(filter(window.floodlight.javascript.filters, source));
	};

	(function () {
		var key;

		this.keywords = ('var function if else for while break switch case do new null in with void '
		                +'continue delete return this true false throw catch typeof with instanceof').split(' ');
		this.special  = ('eval window document undefined NaN Infinity parseInt parseFloat '
		                +'encodeURI decodeURI encodeURIComponent decodeURIComponent').split(' ');
		this.regex = {
			'comment': (/(\/\/[^\n]*|\/\*(?:[^*\n]|\*+[^\/*])*\*+\/)/g),
		  'string':  (/("(?:(?!")[^\\\n]|\\.)*"|'(?:(?!')[^\\\n]|\\.)*')/g),
		  'regexp':  (/(\/.+\/[mgi]*)(?!\s*\w)/g),
		  'class':   (/\b([A-Z][a-zA-Z]+)\b/g),
		  'number':  (/\b([0-9]+(?:\.[0-9]+)?)\b/g),
		  'keyword': new(RegExp)('\\b(' + window.floodlight.javascript.keywords.join('|') + ')\\b', 'g'),
		  'special': new(RegExp)('\\b(' + window.floodlight.javascript.special.join('|')  + ')\\b', 'g')
		};

		this.filters = ['whitepace'];

		for (key in this.regex) {
			(function (regex, name, filters) {
				var namespace = 'javascript.' + name;

				addFilter(namespace, regex, function (match, capture) {
					return escapeMatch(capture, 'javascript-' + name);
				});

				filters.push(namespace);
			})(window.floodlight.javascript.regex[key], key, this.filters);
		}
	}).call(window.floodlight.javascript);
})(this);
