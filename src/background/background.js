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

    if (request.status === 'loading') {
        // Show page action icon in address bar
        chrome.pageAction.show(tabId);
        iconManager.setLoadingIcon(tabId, iconBackgroundImageSrc);
        chrome.pageAction.setTitle({tabId: tabId, title: 'Retrieving LinkedIn and Airtable contact records…'});

        // Init state of tab
        stateByTabId[tabId] = {
            // Saves data that artoo has scraped on the page
            linkedInContact: null,
            creatingAirtableContact: false,
            linkedInContactInSync: false,
            airtableContactURL: null
        };
    } else if (request.status === 'scraping_success') {
        var stateOfTab = stateByTabId[tabId];
        // Save to send later if the user clicks on the page action
        stateOfTab.linkedInContact = request.scrapedData;
        console.log('linkedInContact', stateOfTab.linkedInContact);
        airtableAPIClient.getContacts(function(error, contacts) {
            if (error) {
                console.error(error);
                iconManager.setErrorIcon(tabId, iconBackgroundImageSrc);
                chrome.pageAction.setTitle({tabId: tabId, title:'Error during contacts loading'});
                sendResponse('error');
                return;
            }
            var contactId = airtableAPIClient.getContactRecordIdByName(stateOfTab.linkedInContact.name, contacts);
            if (contactId) {
                iconManager.setSuccessIcon(tabId, iconBackgroundImageSrc);
                chrome.pageAction.setTitle({tabId: tabId, title: 'LinkedIn contact is already on Airtable'});
                stateOfTab.linkedInContactInSync = true;
                stateOfTab.airtableContactURL = airtableAPIClient.getContactURL(contactId);
            } else {
                iconManager.setUploadIcon(tabId, iconBackgroundImageSrc);
                chrome.pageAction.setTitle({tabId: tabId, title:'Import LinkedIn contact to Airtable'});
            }
            sendResponse('success');
        });
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
