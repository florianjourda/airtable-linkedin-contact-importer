// if you checked 'fancy-settings' in extensionizr.com, uncomment this lines

// var settings = new Store('settings', {
//     'sample_setting': 'This is how you use Store.js to remember values'
// });

// Saves data that artoo has scraped on the page
var linkedInContact;

// Listen to the content script
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('request', request);
    if (request.status === 'scraped') {
        // Show page action icon in address bar
        chrome.pageAction.show(sender.tab.id);
        // Save to send later if the user clicks on the page action
        linkedInContact = request.scrapedData;
        console.log('linkedInContact', linkedInContact);
        sendResponse('ok');
    } else {
        sendResponse('error');
    }
  });

// Listen to the user clicking on the page action icon in the address bar
chrome.pageAction.onClicked.addListener(function(tab) {
    console.log('clicked page action');
    // Do something

    var airtableAPIBaseURL = 'https://api.airtable.com/v0/',
        airtableDatabaseId = 'appFkPIUEb8ApIYqf',
        airtableContactsTableId = 'tbl7TXOli08Q0UKov',
        airtableContactsTableAPIUrl = airtableAPIBaseURL +  airtableDatabaseId + '/' + airtableContactsTableId,
        airtableAPIKey = 'keyUSUFogZHq7YcwU',
        airtableBaseURL = 'https://airtable.com/',
        airtableContactsTableBaseURL = airtableBaseURL + airtableContactsTableId + '/';

    $.ajax({
        method: 'POST',
        url: airtableContactsTableAPIUrl,
        headers: {'Authorization': 'Bearer ' + airtableAPIKey},
        data: {
            fields: {
                'Contact Name': linkedInContact.name,
                'Current Job': linkedInContact.title,
                'Email': linkedInContact.email,
                'Functions': [],
//            'Locations': [linkedInContact.location],
//            'Industries': [linkedInContact.industry],
                'LinkedIn Profile': linkedInContact.profileUrl,
                'Networking Meetings': [],
                'Picture': []
            }
        },
        dataType: 'json',
        success: function(response) {
            console.log('success', response);
            var airtableContactId = response.id,
                airtableContactURL = airtableContactsTableBaseURL + airtableContactId;
            console.log('airtableContactURL', airtableContactURL);
        },
        error: function(response) {
            console.error('error', response);
        }
    });
});