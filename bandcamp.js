var jsdom = require('jsdom');

var tag = process.argv[2] || 'dubstep';
var pages  = process.argv[3];

var index = 'http://bandcamp.com/tag/' + tag;
var jquery = 'http://code.jquery.com/jquery-1.5.min.js';

function scrape(url, cb) {
  console.error("trying to read " + url);
  try {
    jsdom.env(url, [jquery], function(errors, window) {
      if (errors) { cb(errors); }
      else { cb(null, url, window.$); }
    });
  } catch (err) { cb(err); }
}

var content = {};
var check_for_done;
var ret_str = '';

scrape(index, function(err, url, $) {
  var total_pages = Number($('.pagenum:last').text());
  if (!pages) {
    pages = total_pages;
    console.log('spec a page for now');
    process.exit();
  }
  var current_page = 1;
  while (current_page <= pages) {
    scrape(index+'?page='+current_page, page_scrape);
    current_page += 1;
  }
});

function finish() {
  // do something with content
  // dump for now
  console.log(content);
}

function page_scrape(err, page_url, $) {
  var albums = $('.item[class!="featured"] a');
  albums.each(function(i,n) {
    var keyurl = $(this).attr('href');
    content[keyurl] = null;
    var cb = (function(url) {
      return function(err, alb_url, $) {
        var buynow = $('#noJSDownloadLink');
        var free = false;
        if (buynow.text().match(/Free/)) { free = 'free'; }
        else if ($('span.buyItemNyp').length > 0) { free = 'nyp'; }
        if (!free) { content[url] = 'notfree'; }
        else {
          content[url] = {
            type: free,
            img: $('#tralbumArt img').attr('src'),
            //artist: $('#trackInfoInner h3 > a').text(),
            //artist: $('h3.albumTitle').text().split('by')[1],
            artist: $('title').text().split('|')[1],
            album: $('h2.trackTitle').text(),
            url: alb_url
          }
        }
      }
    })(keyurl);
    scrape(keyurl, cb);
  });
  var current_page = page_url.split('=')[1];
  if (current_page == pages) { // type coerce for now
    console.log("everything should have a slot ready; starting finish loop");
    check_for_done = setInterval(function() {
      var done = true;
      for (key in content) {
        if (content[key] === null) {
          'Still not done, waiting on '+key;
          done = false;
        }
      }
      if (!done) { return; }
      for (key in content) {
        finish();
      }
      clearInterval(check_for_done);
    }, 500);
  }
}
