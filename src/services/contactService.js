import { ContactsCollection } from "../db/models/contacts.js";
import {calculatePaginationData} from '../utils/calculatePaginationData.js';
import {SORT_ORDER} from '../constants/index.js';

export const getAllContacts = async ({
    page = 1,
    perPage = 10,
    sortOrder = SORT_ORDER.ASC,
    sortBy = '_id',
    filter = {},
}) => {
    const limit = perPage;
    const skip = (page - 1) * perPage;

    const contactsQuery = ContactsCollection.find();

    if (filter.type) {
        contactsQuery.where('type').equals(filter.type);
    }

    if (typeof filter.isFavourite !== 'undefined') {
        contactsQuery.where('isFavourite').equals(filter.isFavourite);
      }

      const [contactsCount, contacts] = await Promise.all([
        ContactsCollection.countDocuments(contactsQuery),
        contactsQuery.skip(skip).limit(limit).sort({ [sortBy]: sortOrder }).exec(),
      ]);

    const paginationData = calculatePaginationData(contactsCount, perPage, page);

    paginationData.hasNextPage = page < paginationData.totalPages;
    paginationData.hasPreviousPage = page > 1;


    return {
        data: contacts,
        ...paginationData,
    };
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
