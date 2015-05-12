var settings = new Store('settings');

var airtableAPIBaseURL,
    airtableBaseURL,
    airtableDatabaseId,
    airtableContactsTableId,
    airtableContactsTableAPIUrl,
    airtableContactsTableBaseURL,
    airtableLocationsTableId,
    airtableLocationsTableAPIUrl,
    airtableLocationsTableBaseURL,
    airtableAPIKey;


airtableAPIClient = {
    loadSettings: function() {
        airtableAPIBaseURL = 'https://api.airtable.com/v0/';
        airtableBaseURL = 'https://airtable.com/';
        airtableDatabaseId = settings.get('airtableDatabaseId');
        airtableContactsTableId = settings.get('airtableContactsTableId');
        airtableContactsTableAPIUrl = airtableAPIBaseURL +  airtableDatabaseId + '/' + airtableContactsTableId;
        airtableContactsTableBaseURL = airtableBaseURL + airtableContactsTableId + '/';
        airtableLocationsTableId = settings.get('airtableLocationsTableId');
        airtableLocationsTableAPIUrl = airtableAPIBaseURL +  airtableDatabaseId + '/' + airtableLocationsTableId;
        airtableLocationsTableBaseURL = airtableBaseURL + airtableLocationsTableId + '/';
        airtableAPIKey = settings.get('airtableAPIKey');
        return this._areSettingsCorrectlyLoaded();
    },

    _areSettingsCorrectlyLoaded: function() {
        var paramIsDefined = function(param) {
            return (typeof param === 'string') && param !== '';
        };
        console.log(airtableDatabaseId, airtableContactsTableId, airtableLocationsTableId, airtableAPIKey);
        return paramIsDefined(airtableDatabaseId)
            && paramIsDefined(airtableContactsTableId)
            && paramIsDefined(airtableLocationsTableId)
            && paramIsDefined(airtableAPIKey);
    },

    getLocations: function(callback) {
        $.ajax({
            method: 'GET',
            url: airtableLocationsTableAPIUrl,
            headers: {'Authorization': 'Bearer ' + airtableAPIKey},
            data: {
                view: 'Main View'
            },
            dataType: 'json',
            success: function(response) {
                console.log('success', response);
                callback(null, response.records);
            },
            error: function(response) {
                console.error('error', response);
                callback(response);
            }
        });
    },

    _getLocationRecordIdByName: function(locationRecordName, locationRecords) {
        for (var i = 0; i < locationRecords.length; i++) {
            var locationRecord = locationRecords[i];
            if (locationRecord.fields.Name === locationRecordName) {
                return locationRecord.id;
            }
        }
        return null;
    },

    createContact: function(linkedInContact, callback) {
        var me = this;
        this.getLocations(function(error, locations) {
            if (error) {
                callback(error);
                return;
            }
            console.log('locations', locations);
            var locationId = me._getLocationRecordIdByName(linkedInContact.location, locations);
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
                        'Locations': [locationId],
//                      'Industries': [linkedInContact.industry],
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
        });
    }
};
