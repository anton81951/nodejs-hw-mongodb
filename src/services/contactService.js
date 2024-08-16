import { ContactsCollection } from "../db/models/contacts.js";
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({ page, perPage, sortOrder, sortBy, filter, userId }) => {
  try {
    const limit = perPage;
    const skip = (page - 1) * perPage;

    const contactsQuery = ContactsCollection.find({ userId });

    if (filter.contactType) {
      contactsQuery.where('contactType').equals(filter.contactType);
    }

    if (filter.isFavourite !== undefined) {
      contactsQuery.where('isFavourite').equals(filter.isFavourite);
    }

    const [contacts, contactsCount] = await Promise.all([
      contactsQuery.sort({ [sortBy]: sortOrder }).skip(skip).limit(limit).exec(),
      ContactsCollection.countDocuments({ userId, ...filter })
    ]);

    const paginationData = calculatePaginationData(contactsCount, perPage, page);

    return {
      data: contacts,
      totalItems: contactsCount,
      pagination: paginationData
    };
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw new Error('Failed to fetch contacts');
  }
};

export const getContactById = async (contactId, userId) => {
  try {
    const contact = await ContactsCollection.findOne({ _id: contactId, userId });
    if (!contact) {
      const error = new Error('Contact not found');
      error.status = 404;
      throw error;
    }
    return contact;
  } catch (error) {
    console.error('Error fetching contact by ID:', error);
    throw error.status === 404 ? error : new Error('Failed to fetch contact by ID');
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

export const deleteContact = async (contactId, userId) => {
  try {
    const contact = await ContactsCollection.findOneAndDelete({ _id: contactId, userId });
    if (!contact) {
      const error = new Error('Contact not found');
      error.status = 404;
      throw error;
    }
    return contact;
  } catch (error) {
    console.error('Error deleting contact:', error.message);
    throw error.status === 404 ? error : new Error('Failed to delete contact');
  }
};

export const updateContact = async (contactId, payload, userId, options = {}) => {
  try {
    const updatedContact = await ContactsCollection.findOneAndUpdate(
      { _id: contactId, userId },
      payload,
      {
        new: true,
        runValidators: true,
        ...options,
      }
    );

    if (!updatedContact) {
      const error = new Error('Contact not found');
      error.status = 404;
      throw error;
    }

    return {
      contact: updatedContact,
      isNew: options.upsert ?? false,
    };
  } catch (error) {
    console.error('Error updating contact:', error);
    throw error.status === 404 ? error : new Error('Failed to update contact');
  }
};
