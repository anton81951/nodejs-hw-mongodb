import { ContactsCollection } from "../db/models/contacts";

export const getAllContacts = async () => {
    try {
        const contacts = await ContactsCollection.find();
        return contacts;
    } catch (error) {
        console.error("Error fetching all contacts:", error);
        throw new Error("Could not fetch contacts");
    }
};

export const getContactById = async (contactId) => {

    try {
        const contact = await ContactsCollection.findById(contactId);
        if (!contact) {
            throw new Error("Contact not found");
        }
        return contact;
    } catch (error) {
        console.error(`Error fetching contact with ID ${contactId}:`, error);
        throw new Error("Could not fetch contact");
    }
};
