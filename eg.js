var jsdom = require('jsdom');

var jquery = 'http://code.jquery.com/jquery-1.5.min.js';
var url = 'http://www.gutenberg.org/browse/recent/last1'

jsdom.env(url, [jquery], function(errors, window) {
    var $ = window.$;
    $('div.pgdbrecent h2').each(function() {
        var listing = $(this);
        var author = $(listing.children('a')[1]).text();
        console.log(author);
        listing.next('ul').children('li.pgdbetext').each(function() {
            console.log('\t* ' + $(this).children('a:first').text());
        });
    });
});
