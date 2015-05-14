// SAMPLE
this.manifest = {
    "name": "LinkedIn Contact Importer",
    "icon": "../../icons/airtable-icon-32.png",
    "settings": [
        {
            "tab": i18n.get("Airtable Configuration"),
            "group": i18n.get("API Parameters"),
            "name": "airtableDatabaseId",
            "type": "text",
            "label": i18n.get("Database Id"),
            "text": i18n.get("appGkPIUFb9ZpIYqg") // fake example
        },
        {
            "tab": i18n.get("Airtable Configuration"),
            "group": i18n.get("API Parameters"),
            "name": "airtableContactsTableId",
            "type": "text",
            "label": i18n.get("Contacts Table Id"),
            "text": i18n.get("tbl8TXOla09Q0IKoz") // fake example
        },
        {
            "tab": i18n.get("Airtable Configuration"),
            "group": i18n.get("API Parameters"),
            "name": "airtableLocationsTableId",
            "type": "text",
            "label": i18n.get("Locations Table Id"),
            "text": i18n.get("tbl3aNOlba453IRo1") // fake example
        },
        {
            "tab": i18n.get("Airtable Configuration"),
            "group": i18n.get("API Parameters"),
            "name": "airtableAPIKey",
            "type": "text",
            "label": i18n.get("API Key"),
            "text": i18n.get("keyVSUFhgZ5q9YcwK") // fake example
        }
    ],
    "alignment": [
        [
            "airtableDatabaseId",
            "airtableContactsTableId",
            "airtableAPIKey"
        ]
    ]
};
