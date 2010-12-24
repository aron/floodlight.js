/* Floodlight (X)HTML Syntax Highlighter - v0.1
 *  Copyright 2010, Aron Carroll
 *  Released under the MIT license
 *  More Information: http://github.com/aron/floodlight.js
 */

(function (window, undefined) {
	var options = {
		prefix: '',
		spaces: '  ',
		regex: {
			tag:     /(<\/?)(\w+)([^>]*)(\/?>)/gi,
			attr:    /(\w+)(?:\s*=\s*("[^"]*"|'[^']*'|[^>\s]+))?/g,
			comment: /<!--[^\-]*-->/g,
			encode:  /<|>|"|&/g,
			decode:  /&(?:lt|gt|quot|amp);/g
		},
		map: {
			encode: {'<':'&lt;', '>':'&gt;', '"':'&quot;', '&':'&amp;'},
			decode: {'&lt;':'<', '&gt;':'>', '&quot;':'"', '&amp;':'&'}
		}
	};

	function parseTags(source) {
		return source.replace(/\t/g, options.spaces).replace(options.regex.tag,
			function (match, open, tag, attr, close) {
				return wrap(open, 'bracket') + wrap(tag, 'tag') + parseAttributes(attr) + wrap(close, 'bracket');
			}
		).replace(options.regex.comment, function (comment) {
			return wrap(comment, 'comment');
		});
	}

	function parseAttributes(attributes) {
		return attributes.replace(options.regex.attr, function (match, attr, value) {
			return wrap(attr, 'attribute') + (value ? '=' + wrap(value, 'value') : '');
		});
	}

	function entities(string, type) {
		return string.replace(options.regex[type], function (match) {
			return options.map[type][match];
		});
	}

	function wrap(string, klass) {
		return '<span class="' + options.prefix + klass + '">' + entities(string, 'encode') + '</span>';
	}

	window.floodlight = parseTags;

	window.floodlight.encode  = function (string) { return entities(string, 'encode'); };
	window.floodlight.decode  = function (string) { return entities(string, 'decode'); };
	window.floodlight.options = options;
})(this);
