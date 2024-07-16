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
    try {
        const contact = await ContactsCollection.create(payload);
        return contact;
    } catch (error) {
        console.error("Error creating contact:", error);
        throw new Error("Could not create contact");
    }
};

export const deleteContact = async (contactId) => {
    try {
        const contact = await ContactsCollection.findOneAndDelete({
            _id: contactId,
        });
        if (!contact) {
            throw new Error("Contact not found");
        }
        return contact;
    } catch (error) {
        console.error(`Error deleting contact with ID ${contactId}:`, error);
        throw new Error("Could not delete contact");
    }
}

export const updateContact = async (contactId, payload, options = {}) => {
    try {
        const contact = await ContactsCollection.findOneAndUpdate(
            { _id: contactId },
            payload,
            {
                new: true,
                runValidators: true,
                ...options,
            },
        );
        if (!contact) {
            throw new Error("Contact not found");
        }
        return contact;
    } catch (error) {
        console.error(`Error updating contact with ID ${contactId}:`, error);
        throw new Error("Could not update contact");
    }
};
