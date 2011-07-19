var jsdom = require('jsdom');

var index = 'http://www.hplovecraft.com/writings/texts/';
var jquery = 'http://code.jquery.com/jquery-1.5.min.js';


// scrape('google.com', function(err, window, $)

function scrape(url, cb) {
    console.error("trying to read " + url);
    try {
        jsdom.env(url, [jquery], function(errors, window) {
            if (errors) { cb(errors); }
            else { cb(null, window, window.$); }
        });
    } catch (err) { cb(err); }
}

var content = {};
var check_for_done;
var ret_str = '';

scrape(index, function(err, window, $) {
    var writings = $('a[href*="fiction"]');
    writings.each(function(i,n) {
        var keyurl = $(n).attr('href');
        content[keyurl] = null;
        var cb = (function(url) {
            return function(err, window, $) {
                var text = $('div[align="justify"]').text();
                content[url] = text;
                console.error('got content from '+url);
            };
        })(keyurl);
        scrape(index + keyurl, cb);
        if (i === writings.length-1) {
            check_for_done = setInterval(function() {
                var done = true;
                for (key in content) {
                    if (content[key] === null) {
                        console.error('Still not done, waiting on '+key);
                        done = false;
                    }
                }
                if (!done) { return; }
                for (key in content) {
                    console.error('appending content from '+key);
                    ret_str += (' ' + content[key]);
                }
                console.log(ret_str);
                clearInterval(check_for_done);
            }, 200);
        }
    });
});
