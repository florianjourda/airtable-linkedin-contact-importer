chrome.extension.sendMessage({status:'loading'}, function(response) {
    console.log('response', response);
});

artoo.on('ready', function() {
    // Need to add as contact before to be able to expand the profile correctly
    addAsContact(function() {
        expandProfile(scrapDataAndSendItToBackgroundScript);
    });
});

function addAsContact(callback) {
    console.log('addAsContact');
    artoo.autoExpand({
        expand: '.save-to-contacts a',
        isExpanding: function($) {
            return $('#relationship-container').length === 0;
        },
        limit: 1,
        timeout: 3000,
        done: callback
    });
}

function expandProfile(callback) {
    console.log('expandProfile');
    artoo.autoExpand({
        expand: '#contacs-tab, .relationship-contact a, .show-more-info a',
        isExpanding: function($) {
            return $('#relationship-emails').length === 0;
        },
        limit: 1,
        timeout: 3000,
        done: callback
    });
}

function scrapDataAndSendItToBackgroundScript() {
    console.log('scrapDataAndSendItToBackgroundScript');

    var scrapedData = artoo.scrapeOne('#wrapper', {
        name: {sel: '.full-name', method: 'text'},
        title: {sel: '#headline .title', method: 'text'},
        email: {sel: '#relationship-emails', method: 'text'},
        location: {sel: '#location .locality', method: 'text'},
        industry: {sel: '#location .industry', method: 'text'},
        profileUrl: {sel: '#relationship-public-profile-link, .public-profile a', method: 'text'},
        pictureUrl: {sel: '.profile-picture img', attr: 'src'}
    });

    console.log('scrapedData', scrapedData);
    if (scrapedData.name === "" || scrapedData.pictureUrl === null) {
        chrome.extension.sendMessage({status:'scraping_error', scrapedData: scrapedData}, function(response) {
            console.log('response', response);
        });
    } else {
        chrome.extension.sendMessage({status:'scraping_success', scrapedData: scrapedData}, function(response) {
            console.log('response', response);
        });
    }
}


