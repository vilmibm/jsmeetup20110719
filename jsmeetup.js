var pres = require('./slideshow.js').pres;
var Slide = require('./slideshow.js').Slide;


pres.add(new Slide(
    'Web Scraping and Crawling with Node.js and jsdom', [
        'nathaniel smith',
        'july 2011'
    ]
));

pres.add(new Slide(
    'Agenda', [
        '* Background',
        '* Basic example',
        '* Code examples',
        '* Q&A'
    ]
));

pres.add(new Slide(
    'Background', [
        '* Have written a lot of scrapers',
        '* Started with Perl--mechanize',
        '* Went to Python with some pain',
        '* Pretty much just wanted jquery.'
    ]
));

pres.add(new Slide(
    'Enter jsdom', [
        '* DOM, for node.js',
        '* Bootstraps code on any DOM you load',
        '* ...including jquery'
    ]
));

pres.add(new Slide(
    'So, my wish was granted', [
        '* can test scraping in Chromium dev console',
        '* familiar and easy API',
        '* same language you were already writing.',
        '* highly performant'
    ]
));

pres.add(new Slide(
    'Scraping renaissance', [
        '* bandcamp',
        '* books',
        '* twitter RSS',
        '* the web et. al.'
    ]
));

pres.start();
