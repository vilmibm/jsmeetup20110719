var jsdom = require('jsdom');
var nurl = require('url');

var jquery = 'http://code.jquery.com/jquery-1.5.min.js';
var root = 'http://www.google.com/Top/Arts';
var seen_urls = {};


process.on('uncaughtException', function(err) {
    console.log('oh bother');
});
seen_urls[root] = true;

function walk(url, cb) {
    console.error('visiting ' + url);
    try {
        jsdom.env(url, [jquery], function(errors, window) {
            if (errors) { cb(errors); }
            else { cb(null, url, window, window.$) }
        });
    }
    catch (err) { cb(err); }
}

function process_url(err, url, window, $) {
    if (err) {
        console.error(err);
        return true;
    }
    seen_urls[url] = true;
    $('a').each(function() {
        var href = $(this).attr('href');
        if (!href) { console.error("no href"); return true; }

        var parsed_url = nurl.parse(nurl.resolve(url, href));
        if (!parsed_url.protocol.match(/http(s|):/)) {
            console.error('bad protocol: ' + parsed_url.protocol);
            return true;
        }

        var nice_url = nurl.format(parsed_url);
        console.error('checking ' + nice_url);
        if (seen_urls[nice_url]) { return true; }

        // XXX do stuff
        //console.error($('body').text().substring(0, 140) + '...')

        walk(nice_url, process_url);
    });
}

walk(root, process_url);

