var nurl = require('url');

var jsdom = require('jsdom');
var mongodb = require('mongodb');

var jquery = 'http://code.jquery.com/jquery-1.5.min.js';
var root = 'http://www.google.com/Top/Arts';
var seen_urls = {};

var mongo_port = 27017;
var mongo_db = 'jsmeetup';
var mongo_server = '127.0.0.1';
var mongos = new mongodb.Server(mongo_server, mongo_port, {});

process.on('uncaughtException', function(err) { console.error(err); });

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
    // store page in mongo
    new mongodb.Db(mongo_db, mongos, {}).open(function(err, client) {
        if (err) {
            console.error(err);
            return;
        }
        var raw_html = window.document.documentElement.outerHTML;
        var pages = new mongodb.Collection(client, 'pages');
        var doc = {
            'raw_html': raw_html,
            'url': url,
            'fetched_at': (new Date()).toString(),
            'tokens': raw_html.split(' ')
        };
        pages.insert(doc, function(err, docs) {
            if (err) {
                console.log(err);
            }
        });
    });

    // crawl for more links
    $('a').each(function() {
        var href = $(this).attr('href');
        if (!href) {
            console.error("no href");
            return true;
        }

        var parsed_url = nurl.parse(nurl.resolve(url, href));
        if (!parsed_url.protocol.match(/http(s|):/)) {
            console.error('bad protocol: ' + parsed_url.protocol);
            return true;
        }

        var nice_url = nurl.format(parsed_url);
        console.error('checking ' + nice_url);
        if (seen_urls[nice_url]) {
            console.error('have already seen ' + nice_url);
            return true;
        }

        walk(nice_url, process_url);
    });
}

walk(root, process_url);
