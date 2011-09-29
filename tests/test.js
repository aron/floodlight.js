Riot.run(function() {

	context('floodlight.encode()', function () {
		given('a string containing &, <, > or "', function () {
			should('escape the characters as HTML entities', function () {
				return floodlight.encode('&, <, > and "');
			}).equals('&amp;, &lt;, &gt; and &quot;');
		});
	});

	context('floodlight.decode()', function () {
		given('a string containing &amp;, &lt;, &gt; or &quot;', function () {
			should('unescape the characters back to plain text', function () {
				return floodlight.decode('&amp;, &lt;, &gt; and &quot;');
			}).equals('&, <, > and "');
		});
	});

	context('floodlight()', function () {
		given('a simple HTML string', function () {
			should('replace tabs with spaces', floodlight('\t')).equals('  ');

			should('wrap comments', function () {
				return floodlight('<!---->');
			}).equals('<span class="html-comment">&lt;!----&gt;</span>');

			should('wrap comments containing html', function () {
				return floodlight('<!-- My <div> is ace -->');
			}).equals('<span class="html-comment">&lt;!-- My &lt;div&gt; is ace --&gt;</span>');

			should('wrap entities', function () {
				return floodlight('&amp;');
			}).equals('<span class="html-entity">&amp;amp;</span>');

			should('wrap elements in spans', function () {
				return floodlight('<a href="#" title="Ooh a link">link</a>');
			}).equals([
				'<span class="html-bracket">&lt;</span>',
				'<span class="html-tag">a</span> ',
				'<span class="html-attribute">href</span>=',
				'<span class="html-value">&quot;#&quot;</span> ',
				'<span class="html-attribute">title</span>=',
				'<span class="html-value">&quot;Ooh a link&quot;</span>',
				'<span class="html-bracket">&gt;</span>link',
				'<span class="html-bracket">&lt;/</span>',
				'<span class="html-tag">a</span>',
				'<span class="html-bracket">&gt;</span>'
			].join(''));

			should('wrap JavaScript within <script> tags in spans', function () {
				return floodlight('<script>var hello = "world";</script>');
			}).equals([
				'<span class="html-bracket">&lt;</span>',
				'<span class="html-tag">script</span>',
				'<span class="html-bracket">&gt;</span>',
				'<span class="javascript-keyword">var</span> hello = ',
				'<span class="javascript-string">&quot;world&quot;</span>;',
				'<span class="html-bracket">&lt;/</span>',
				'<span class="html-tag">script</span>',
				'<span class="html-bracket">&gt;</span>'
			].join(''));
		});
	});

	context('floodlight.javascript()', function () {
		given('a simple JavaScript string', function () {
			//should('replace tabs with spaces', floodlight('\t')).equals('  ');

			should('wrap inline comments', function () {
				return floodlight.javascript('// This is a comment');
			}).equals('<span class="javascript-comment">// This is a comment</span>');

			should('wrap multiline comments', function () {
				return floodlight.javascript('/* This is a comment */');
			}).equals('<span class="javascript-comment">/* This is a comment */</span>');

			should('wrap strings and keywords', function () {
				return floodlight.javascript('var test = "Hello World";');
			}).equals([
				'<span class="javascript-keyword">var</span> test = ',
				'<span class="javascript-string">&quot;Hello World&quot;</span>;'
			].join(''));

			should('wrap integers', function () {
				return floodlight.javascript('0; 1.23;');
			}).equals([
				'<span class="javascript-number">0</span>; ',
				'<span class="javascript-number">1.23</span>;'
			].join(''));

			should('wrap functions', function () {
				return floodlight.javascript('function test() {}');
			}).equals('<span class="javascript-keyword">function</span> test() {}');

			should('wrap classes', function () {
				return floodlight.javascript('function Test() {}');
			}).equals([
				'<span class="javascript-keyword">function</span> ',
				'<span class="javascript-class">Test</span>() {}'
			].join(''));

			should('wrap regular expressions', function () {
				return floodlight.javascript('/[a-z]{4,2}/gi');
			}).equals('<span class="javascript-regexp">/[a-z]{4,2}/gi</span>');
		});
	});
});
