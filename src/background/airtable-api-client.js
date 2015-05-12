var settings = new Store('settings');

var airtableAPIBaseURL,
    airtableBaseURL,
    airtableDatabaseId,
    airtableContactsTableId,
    airtableContactsTableAPIUrl,
    airtableAPIKey,
    airtableContactsTableBaseURL;


airtableAPIClient = {
    loadSettings: function() {
        airtableAPIBaseURL = 'https://api.airtable.com/v0/';
        airtableBaseURL = 'https://airtable.com/';
        airtableDatabaseId = settings.get('airtableDatabaseId');
        airtableContactsTableId = settings.get('airtableContactsTableId');
        airtableAPIKey = settings.get('airtableAPIKey');
        airtableContactsTableAPIUrl = airtableAPIBaseURL +  airtableDatabaseId + '/' + airtableContactsTableId;
        airtableContactsTableBaseURL = airtableBaseURL + airtableContactsTableId + '/';
        return this._areSettingsCorrectlyLoaded();
    },

    _areSettingsCorrectlyLoaded: function() {
        console.log(airtableDatabaseId, airtableContactsTableId, airtableAPIKey);
        return airtableDatabaseId !== '' && airtableContactsTableId !== '' && airtableAPIKey !== '';
    },

    createContact: function(linkedInContact, callback) {
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
                    'Networking Meetings': [],
                    'LinkedIn Profile': linkedInContact.profileUrl,
                    'Picture': [{
                        url: linkedInContact.pictureUrl,
                        filename: linkedInContact.name
                    }]
                }
            },
            dataType: 'json',
            success: function(response) {
                console.log('success', response);
                var airtableContactId = response.id,
                    airtableContactURL = airtableContactsTableBaseURL + airtableContactId;
                console.log('airtableContactURL', airtableContactURL);
                callback(null, airtableContactURL);
            },
            error: function(response) {
                console.error('error', response);
                callback(response);
            }
        });
    }
};
