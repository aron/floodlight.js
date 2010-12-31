Floodlight - Syntax Highlighter
=====================================

A super simple syntax highlighter for (X)HTML documents.

Usage
-----

Takes a string of (X)HTML and applies class hooks for styling.

    floodlight('<p>My string of HTML</p>');

To apply highlighting to all `<code>` blocks on the page.

    var tags = document.getElementsByTagName('code');
    for (var i = 0, count = tags.length; i < count; i+=1) {
        tags[i].innerHTML = floodlight(floodlight.decode(tags[i].innerHTML));
    }

NOTE: Floodlight will not decode any HTML entities in the string, this must be
done before calling `floodlight()` by using the `floodlight.decode()` function.

### Styling

The (X)HTML tokens are wrapped in `<span>` tags and can be styled as follows.

    .html-bracket   { color: rgba(249, 38,  114, 1.0); }
    .html-tag       { color: rgba(249, 38,  114, 1.0); }
    .html-attribute { color: rgba(168, 225, 36,  1.0); }
    .html-value     { color: rgba(230, 219, 116, 1.0); }
    .html-entity    { color: rgba(174, 129, 255, 1.0); }
    .html-comment   { color: rgba(117, 113, 94,  1.0); }

JavaScript gets the following styles.

    .javascript-number  { color: rgba(174, 129, 255, 1.0); }
    .javascript-string  { color: rgba(230, 219, 116, 1.0); }
    .javascript-keyword { color: rgba(102, 217, 239, 1.0); }
    .javascript-class   { color: rgba(168, 225, 36, 1.0);  }
    .javascript-regexp  { color: rgba(168, 225, 36, 1.0);  }
    .javascript-special { color: rgba(102, 217, 239, 1.0); }
    .javascript-comment { color: rgba(117, 113, 94, 1.0);  }

### Options

There are a couple of additional options that can be set to adjust output.

#### Prefix

Applies a prefix to the token classes.

    floodlight.options.prefix = 'namespace-';
    floodlight('<p>');
    //=> '<span class="namespace-bracket"></span>...'

#### Spaces

Adjusts the number of spaces are used for one tab. Defaults to 2.

    floodlight.options.spaces = 4;

Extras
------

Floodlight also provides the following helper methods.

### floodlight.html()

Same as just calling `floodlight()`, highlights (X)HTML & JavaScript found in
the source code.

### floodlight.javascript()

Highlights JavaScript found in the source code.

    floodlight.javascript('var index = 0;');
    //=> '<span class="javascript-keyword">var</span> index = <span class="javascript-number">0</span>;'

### floodlight.encode()

Encodes special characters (&, <, > and ") into HTML entities.

    floodlight.encode('<p>');
    //=> "&lt;p&gt;"

### floodlight.decode()

Encodes special characters (&, <, > and ") into HTML entities.

    floodlight.decode('&lt;p&gt;');
    //=> "<p>"

To Do
-----

 - CSS highlighting

License
-------

Released under the [MIT licence](http://en.wikipedia.org/wiki/MIT_License)
