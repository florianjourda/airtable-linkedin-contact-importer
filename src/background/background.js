areSettingsLoaded = airtableAPIClient.loadSettings();

var iconBackgroundImageSrc = 'icons/airtable-icon-32.png',
// This background process runs for all tabs, so we need to keep track of the state of each tab independently
    stateByTabId = {};

// Listen to the content script
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('request', request);
    var tabId = sender.tab.id;

    if (!areSettingsLoaded) {
        // Show page action icon in address bar
        chrome.pageAction.show(tabId);
        iconManager.setSettingsIcon(tabId, iconBackgroundImageSrc);
        chrome.pageAction.setTitle({tabId: tabId, title: 'Setup Airtable connection to import LinkedIn contact'});
        return;
    }

    if (!(tabId in stateByTabId)) {
        // Saves data that artoo has scraped on the page
        stateByTabId[tabId] = {
            linkedInContact: null,
            creatingAirtableContact: false,
            linkedInContactInSync: false,
            airtableContactURL: null
        };
    }
    var stateOfTab = stateByTabId[tabId];

    if (request.status === 'loading') {
        // Show page action icon in address bar
        chrome.pageAction.show(tabId);
        iconManager.setLoadingIcon(tabId, iconBackgroundImageSrc);
        chrome.pageAction.setTitle({tabId: tabId, title: 'Retrieving LinkedIn and Airtable contact records…'});
    } else if (request.status === 'scraping_success') {
        iconManager.setUploadIcon(tabId, iconBackgroundImageSrc);
        chrome.pageAction.setTitle({tabId: tabId, title:'Import LinkedIn contact to Airtable'});
        // Save to send later if the user clicks on the page action
        stateOfTab.linkedInContact = request.scrapedData;
        console.log('linkedInContact', stateOfTab.linkedInContact);
        sendResponse('success');
    } else if (request.status === 'scraping_error') {
        iconManager.setErrorIcon(tabId, iconBackgroundImageSrc);
        chrome.pageAction.setTitle({tabId: tabId, title:'Error during scraping'});
        sendResponse('success');
    } else {
        sendResponse('error');
    }
  });

console.log('setup clicked page action');

// Listen to the user clicking on the page action icon in the address bar
chrome.pageAction.onClicked.addListener(function(tab) {
    if (!areSettingsLoaded) {
        // Open settings
        chrome.tabs.create({url: 'src/options/index.html'});
        return;
    }
    var tabId = tab.id,
        stateOfTab = stateByTabId[tabId],
        canCreateAirtableContact = stateOfTab.linkedInContact && !stateOfTab.linkedInContactInSync && !stateOfTab.creatingAirtableContact;

    if (canCreateAirtableContact) {
        console.log('Creating', stateOfTab.linkedInContact);
        stateOfTab.creatingAirtableContact = true;
        iconManager.setLoadingIcon(tabId, iconBackgroundImageSrc);
        chrome.pageAction.setTitle({tabId: tabId, title: 'Importing LinkedIn contact to Airtable…'});

        airtableAPIClient.createContact(stateOfTab.linkedInContact, function(error, _airtableContactURL) {
            stateOfTab.creatingAirtableContact = false;
            if (error) {
                console.error(error);
                return;
            }
            stateOfTab.linkedInContactInSync = true;
            stateOfTab.airtableContactURL = _airtableContactURL;
            iconManager.setSuccessIcon(tabId, iconBackgroundImageSrc);
            chrome.pageAction.setTitle({tabId: tabId, title: 'LinkedIn contact was successfully imported to Airtable'});
        });
    } else if (stateOfTab.airtableContactURL) {
        console.log('open airtableContactURL', stateOfTab.airtableContactURL);
        chrome.tabs.create({url: stateOfTab.airtableContactURL});
    } else {
        console.log('Cannot create contact now');
    }
});
