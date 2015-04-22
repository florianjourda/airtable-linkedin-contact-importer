artoo.on('ready', function() {
    scrapDataAndSendItToBackgroundScript();
});

function scrapDataAndSendItToBackgroundScript() {
    console.log('scrapDataAndSendItToBackgroundScript');
    var scrapedData = artoo.scrapeOne('.profile-card', {
        name: {sel: '.full-name', method: 'text'},
        title: {sel: '.title', method: 'text'},
        location: {sel: '.locality', method: 'text'},
        industry: {sel: '.industry', method: 'text'}
    });

    console.log('scrapedData', scrapedData);
    chrome.extension.sendMessage({status:'scraped', scrapedData: scrapedData}, function(response) {
        console.log('response', response);
    });
}

