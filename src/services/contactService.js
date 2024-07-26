import { ContactsCollection } from "../db/models/contacts.js";
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export const getAllContacts = async ({
  page,
  perPage,
  sortOrder,
  sortBy,
  filter,
}) => {
  try {
    const limit = perPage;
    const skip = (page - 1) * perPage;

    const contactsQuery = ContactsCollection.find();

    if (filter.type) {
      contactsQuery.where('type').equals(filter.type);
    }

    if (filter.isFavourite !== undefined) {
      contactsQuery.where('isFavourite').equals(filter.isFavourite);
    }

    const [contactsCount, contacts] = await Promise.all([

        contactsQuery.sort({ [sortBy]: sortOrder }).skip(skip).limit(limit).exec(),
      ContactsCollection.countDocuments(contactsQuery),

    ]);


    const paginationData = calculatePaginationData(contactsCount, perPage, page);

    return {
      data: contacts,
      pagination: {
        ...paginationData,
        hasNextPage: page < paginationData.totalPages,
        hasPreviousPage: page > 1,
      },
    };
  } catch (error) {
    console.error('Error fetching contacts', error);
    throw new Error('Error fetching contacts');
  }
};

export const getContactById = async (contactId) => {
  try {
    const contact = await ContactsCollection.findById(contactId);
    if (!contact) {
      throw new Error('Contact not found');
    }
    return contact;
  } catch (error) {
    console.error('Error fetching contacts');
    throw new Error('Failed to fetch contact by ID');
  }
};

export const createContact = async (contact) => {
  try {
    return await ContactsCollection.create(contact);
  } catch (error) {
    console.error('Error creating contact:', error);
    throw new Error('Failed to create contact');
  }
};

export const deleteContact = async (contactId) => {
  try {
    const contact = await ContactsCollection.findByIdAndDelete(contactId);
    if (!contact) {
      throw new Error('Contact not found');
    }
    return contact;
  } catch (error) {
    console.error('Error deleting contact:', error);
    throw new Error('Failed to delete contact');
  }
};

export const updateContact = async (contactId, payload, options = {}) => {
  try {
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
      throw new Error('Contact not found');
    }

    return {
      contact: updatedContact,
      isNew: options.upsert ?? false,
    };
  } catch (error) {
    console.error('Error updating contact:', error);
    throw new Error('Failed to update contact');
  }
};
