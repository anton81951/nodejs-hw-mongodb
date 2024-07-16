import { ContactsCollection } from "../db/models/contacts.js";

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

export const createContact = async (payload) => {
    const contact = await ContactsCollection.create(payload);
    return contact;

};

export const deleteContact = async (contactId) => {

        const contact = await ContactsCollection.findOneAndDelete({
            _id: contactId,
        });
        return contact;
};

export const updateContact = async (contactId, payload, options = {}) => {

        const rawResult = await ContactsCollection.findOneAndUpdate(
            { _id: contactId },
            payload,
            {
                new: true,
                includeResultMetadata: true,
                ...options,
            },
        );

        if (!rawResult || !rawResult.value) return null;
        return {
            contact: rawResult.value,
            inNew: Boolean(rawResult ?.lastErrorObject ?.upserted),
        }
};
