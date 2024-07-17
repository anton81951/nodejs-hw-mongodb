import { ContactsCollection } from "../db/models/contacts.js";

export const getAllContacts = async () => {
        const contacts = await ContactsCollection.find();
        return contacts;
};

export const getContactById = async (contactId) => {

        const contact = await ContactsCollection.findById(contactId);
        if (!contact) {
            throw new Error("Contact not found");
        }
        return contact;
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
    const updatedContact = await ContactsCollection.findByIdAndUpdate(
        contactId,
        payload,
        {
            new: true,
            runValidators: true,
            ...options,
        }
    );

    if (!updatedContact) {
        return null;
    }

    return {
        contact: updatedContact,
        inNew: options.upsert ? true : false,
    };
};
