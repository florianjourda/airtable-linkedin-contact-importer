chrome.extension.sendMessage({status:'loading'}, function(response) {
    console.log('response', response);
});

artoo.on('ready', function() {
    expandProfile(scrapDataAndSendItToBackgroundScript);
});

function expandProfile(callback) {
    console.log('expandProfile');
    artoo.autoExpand({
        expand: '#contacs-tab, .relationship-contact a, .show-more-info a',
        isExpanding: function($) {
//            return $('.relationship-progress').is(":visible");
            return $('#relationship-emails').length === 0;
        },
        limit: 1,
        timeout: 3000,
        done: callback
    });
}

function scrapDataAndSendItToBackgroundScript() {
    console.log('scrapDataAndSendItToBackgroundScript');

    var scrapedData = artoo.scrapeOne('#profile', {
        name: {sel: '.full-name', method: 'text'},
        title: {sel: '.title', method: 'text'},
        email: {sel: '#relationship-emails', method: 'text'},
        location: {sel: '.locality', method: 'text'},
        industry: {sel: '.industry', method: 'text'},
        profileUrl: {sel: '#relationship-public-profile-link, .public-profile a', method: 'text'},
        pictureUrl: {sel: '.profile-picture img', attr: 'src'}
    });

    console.log('scrapedData', scrapedData);
    chrome.extension.sendMessage({status:'scraped', scrapedData: scrapedData}, function(response) {
        console.log('response', response);
    });
}


