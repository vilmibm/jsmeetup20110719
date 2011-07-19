var jsdom = require('jsdom');

var martaRoot = 'http://itsmarta.com/';
var martaStations = 'rail-schedules-or-route.aspx';
var jquery = 'http://code.jquery.com/jquery-1.5.min.js';

var data = {};
var numStations = 0;
var stationsScraped = 0

function scrape(url, cb) {
    console.log("trying to read " + url);
    try {
        jsdom.env(url, [jquery], function(errors, window) {
            if (errors) { console.log(errors); }
            else { var $ = window.$; cb($); }
        });
    }
    catch(err) { console.log("caught "+err); }
}

scrape(martaRoot+martaStations, function($) {
    numStations = $(".littlelisttext a").length;
    console.log(numStations + " to scrape");
    $(".littlelisttext a").each(function(i, e) {
        var station_url = $(e).attr("href");
        scrape(martaRoot+station_url, function($) {
            var sched_url = $('img[alt="Station Schedule"]').parents('a').attr('href');
            scrape(martaRoot+sched_url, function($) {
                // because the name of the station is only in images, grap an internal label from the 
                var station = $('img[alt="marta rail map"]').attr("src").split('/')[3].split('.')[0].substr(4)
                // XXX do stuff
                console.log("scraping: " + station);
                stationsScraped+=1;
                console.log("Scraped "+stationsScraped+" out of "+numStations);
            });
        });
    });
});
