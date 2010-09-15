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
			}).equals('<span class="comment">&lt;!----&gt;</span>');

			should('wrap elements in spans', function () {
				return floodlight('<a href="#" title="Ooh a link">link</a>');
			}).equals([
				'<span class="bracket">&lt;</span>',
				'<span class="tag">a</span> ',
				'<span class="attribute">href</span>=',
				'<span class="value">&quot;#&quot;</span> ',
				'<span class="attribute">title</span>=',
				'<span class="value">&quot;Ooh a link&quot;</span>',
				'<span class="bracket">&gt;</span>link',
				'<span class="bracket">&lt;/</span>',
				'<span class="tag">a</span>',
				'<span class="bracket">&gt;</span>'
			].join(''));
		});
	});
});
