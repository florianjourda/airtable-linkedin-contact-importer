// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

// Saves data that artoo has scraped on the page
var scrapedData;

// Listen to the content script
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('request', request);
    if (request.status === 'scraped') {
        // Show page action icon in address bar
        chrome.pageAction.show(sender.tab.id);
        // Save to send later if the user clicks on the page action
        scrapedData = request.scrapedData;
        sendResponse('ok');
    } else {
        sendResponse('error');
    }
  });

// Listen to the user clicking on the page action icon in the address bar
chrome.pageAction.onClicked.addListener(function(tab) {
    console.log('CLICKED');
    // Do something
});