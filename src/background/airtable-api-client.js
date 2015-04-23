var airtableAPIBaseURL = 'https://api.airtable.com/v0/',
    airtableDatabaseId = 'appFkPIUEb8ApIYqf',
    airtableContactsTableId = 'tbl7TXOli08Q0UKov',
    airtableContactsTableAPIUrl = airtableAPIBaseURL +  airtableDatabaseId + '/' + airtableContactsTableId,
    airtableAPIKey = 'keyUSUFogZHq7YcwU',
    airtableBaseURL = 'https://airtable.com/',
    airtableContactsTableBaseURL = airtableBaseURL + airtableContactsTableId + '/';

airtableAPIClient = {
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
                        //name: linkedInContact.name,
                        url: linkedInContact.pictureUrl
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