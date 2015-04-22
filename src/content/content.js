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
        profileUrl: {sel: '#relationship-public-profile-link', method: 'text'},
        location: {sel: '.locality', method: 'text'},
        industry: {sel: '.industry', method: 'text'}
    });

    console.log('scrapedData', scrapedData);
    chrome.extension.sendMessage({status:'scraped', scrapedData: scrapedData}, function(response) {
        console.log('response', response);
    });
}


