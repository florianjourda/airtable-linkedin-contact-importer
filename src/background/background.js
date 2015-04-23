// if you checked 'fancy-settings' in extensionizr.com, uncomment this lines

// var settings = new Store('settings', {
//     'sample_setting': 'This is how you use Store.js to remember values'
// });


var iconBackgroundImageSrc = 'icons/airtable-icon-32.png';

// Saves data that artoo has scraped on the page
var tabId;
var linkedInContact = null;
var creatingAirtableContact = false;
var linkedInContactInSync = false;
var airtableContactURL = null;

// Listen to the content script
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('request', request);
    tabId = sender.tab.id;
    if (request.status === 'loading') {
        // Show page action icon in address bar
        chrome.pageAction.show(tabId);
        iconManager.setLoadingIcon(tabId, iconBackgroundImageSrc);
        chrome.pageAction.setTitle({tabId: tabId, title: "Retrieving LinkedIn and Airtable contact record…"});
    } else if (request.status === 'scraped') {
        iconManager.setUploadIcon(tabId, iconBackgroundImageSrc);
        chrome.pageAction.setTitle({tabId: tabId, title:"Create Airtable contact record from LinkedIn record"});
        // Save to send later if the user clicks on the page action
        linkedInContact = request.scrapedData;
        console.log('linkedInContact', linkedInContact);
        sendResponse('ok');
    } else {
        sendResponse('error');
    }
  });

console.log('setup clicked page action', linkedInContact);

// Listen to the user clicking on the page action icon in the address bar
chrome.pageAction.onClicked.addListener(function(tab) {
    var canCreateAirtableContact = linkedInContact && !linkedInContactInSync && !creatingAirtableContact;
    if (canCreateAirtableContact) {
        console.log('Creating', linkedInContact);
        creatingAirtableContact = true;
        iconManager.setLoadingIcon(tabId, iconBackgroundImageSrc);
        chrome.pageAction.setTitle({tabId: tabId, title: "Creating Airtable contact record from LinkedIn record…"});

        airtableAPIClient.createContact(linkedInContact, function(error, _airtableContactURL) {
            creatingAirtableContact = false;
            if (error) {
                console.error(error);
                return;
            }
            linkedInContactInSync = true;
            airtableContactURL = _airtableContactURL;
            iconManager.setOkIcon(tabId, iconBackgroundImageSrc);
            chrome.pageAction.setTitle({tabId: tabId, title: "LinkedIn and Airtable contact record are in sync"});
        });
    } else if (airtableContactURL) {
        console.log('open airtableContactURL', airtableContactURL);
        chrome.tabs.create({url: airtableContactURL});
    } else {
        console.log('Cannot create contact now');
    }
});