import { ContactsCollection } from "../db/models/contacts.js";

export const getAllContacts = async () => {
        return ContactsCollection.find();
};

export const getContactById = async (contactId) => {
        return ContactsCollection.findById(contactId);
};

export const createContact = async (contact) => {
    return ContactsCollection.create(contact);

};

export const deleteContact = async (contactId) => {
        return ContactsCollection.findByIdAndDelete(contactId);
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
