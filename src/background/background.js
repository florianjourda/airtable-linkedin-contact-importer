areSettingsLoaded = airtableAPIClient.loadSettings();

var iconBackgroundImageSrc = 'icons/airtable-icon-32.png',
    tabId,
    // Saves data that artoo has scraped on the page
    linkedInContact = null,
    creatingAirtableContact = false,
    linkedInContactInSync = false,
    airtableContactURL = null;

// Listen to the content script
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('request', request);
    tabId = sender.tab.id;

    if (!areSettingsLoaded) {
        // Show page action icon in address bar
        chrome.pageAction.show(tabId);
        iconManager.setSettingsIcon(tabId, iconBackgroundImageSrc);
        chrome.pageAction.setTitle({tabId: tabId, title: 'Setup Airtable connection to import LinkedIn contact'});
        return;
    }

    if (request.status === 'loading') {
        // Show page action icon in address bar
        chrome.pageAction.show(tabId);
        iconManager.setLoadingIcon(tabId, iconBackgroundImageSrc);
        chrome.pageAction.setTitle({tabId: tabId, title: 'Retrieving LinkedIn and Airtable contact records…'});
    } else if (request.status === 'scraped') {
        iconManager.setUploadIcon(tabId, iconBackgroundImageSrc);
        chrome.pageAction.setTitle({tabId: tabId, title:'Import LinkedIn contact to Airtable'});
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
    if (!areSettingsLoaded) {
        // Open settings
        chrome.tabs.create({url: 'src/options/index.html'});
        return;
    }
    var canCreateAirtableContact = linkedInContact && !linkedInContactInSync && !creatingAirtableContact;
    if (canCreateAirtableContact) {
        console.log('Creating', linkedInContact);
        creatingAirtableContact = true;
        iconManager.setLoadingIcon(tabId, iconBackgroundImageSrc);
        chrome.pageAction.setTitle({tabId: tabId, title: 'Importing LinkedIn contact to Airtable…'});

        airtableAPIClient.createContact(linkedInContact, function(error, _airtableContactURL) {
            creatingAirtableContact = false;
            if (error) {
                console.error(error);
                return;
            }
            linkedInContactInSync = true;
            airtableContactURL = _airtableContactURL;
            iconManager.setOkIcon(tabId, iconBackgroundImageSrc);
            chrome.pageAction.setTitle({tabId: tabId, title: 'LinkedIn contact was successfully imported to Airtable'});
        });
    } else if (airtableContactURL) {
        console.log('open airtableContactURL', airtableContactURL);
        chrome.tabs.create({url: airtableContactURL});
    } else {
        console.log('Cannot create contact now');
    }
});