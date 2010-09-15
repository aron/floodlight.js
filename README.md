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

    .bracket   { color: rgba(249, 38,  114, 1.0); }
    .tag       { color: rgba(249, 38,  114, 1.0); }
    .attribute { color: rgba(168, 225, 36,  1.0); }
    .value     { color: rgba(230, 219, 116, 1.0); }
    .comment   { color: rgba(117, 113, 94,  1.0); }

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

 - JavaScript & CSS highlighting

License
-------

Released under the [MIT licence](http://en.wikipedia.org/wiki/MIT_License)
