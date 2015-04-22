chrome.extension.sendMessage({}, function(response) {
    console.log(response);
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		console.log("Hello. This message was sent from scripts/inject.js");
		// ----------------------------------------------------------

        var scrapedData = artoo.scrape('.profile-card', {
            name: {sel: '.full-name', method: 'text'},
            title: {sel: '.title', method: 'text'},
            location: {sel: '.locality', method: 'text'},
            industry: {sel: '.industry', method: 'text'}
        });
        console.log(scrapedData);
        chrome.extension.sendMessage({scrapedData: scrapedData}, function(response) {
           console.log('response', response);
        });
	}
	}, 10);
});
