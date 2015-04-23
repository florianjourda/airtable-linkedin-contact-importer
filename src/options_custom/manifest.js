// SAMPLE
this.manifest = {
    "name": "LinkedIn Contact Importer",
    "icon": "../../icons/airtable-icon-32.png",
    "settings": [
        {
            "tab": i18n.get("Airtable Configuration"),
            "group": i18n.get("Contacts Table"),
            "name": "airtableDatabaseId",
            "type": "text",
            "label": i18n.get("Database Id"),
            "text": i18n.get("appGkPIUFb9ZpIYqg")
        },
        {
            "tab": i18n.get("Airtable Configuration"),
            "group": i18n.get("Contacts Table"),
            "name": "airtableContactsTableId",
            "type": "text",
            "label": i18n.get("Contacts Table Id"),
            "text": i18n.get("tbl8TXOla09Q0IKoz")
        },
        {
            "tab": i18n.get("Airtable Configuration"),
            "group": i18n.get("Contacts Table"),
            "name": "airtableAPIKey",
            "type": "text",
            "label": i18n.get("API Key"),
            "text": i18n.get("keyVSUFhgZ5q9YcwK")
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
