chrome.extension.sendMessage({}, function(response) {
    console.log(response);
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		console.log("Hello. This message was sent from scripts/inject.js");
		// ----------------------------------------------------------
        // background/event page
//        chrome.pageAction.onClicked.addListener(function(tab) {
//            console.log('CLICKED 2');
            // Do something
//        });
        console.log('artoo', artoo);
        console.log('jQuery', jQuery);
        console.log('chrome', chrome);

        var scrapedData = artoo.scrape('.full-name', 'html');
        console.log(scrapedData);
        chrome.extension.sendMessage({scrapedData: scrapedData}, function(response) {
           console.log('response', response);
        });
	}
	}, 10);
});
