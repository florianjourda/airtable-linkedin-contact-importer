// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

// Saves data that artoo has scraped on the page
var scrapedData;

// Example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.scrapedData) {
        scrapedData = scrapedData;
    }
    // Show page action icon in address bar
  	chrome.pageAction.show(sender.tab.id);
      console.log('request', request);
    sendResponse('AAAA');
  });


// background/event page
chrome.pageAction.onClicked.addListener(function(tab) {
    console.log('CLICKED');
    // Do something
});