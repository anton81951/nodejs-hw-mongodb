import createHttpError from 'http-errors';
import {
  getAllContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact
} from '../services/contactService.js';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getContactsController = async (req, res, next) => {
  try {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);

    const contactsResult = await getAllContacts({
      page,
      perPage,
      sortBy,
      sortOrder,
      filter,
      userId: req.user._id,
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: {
        data: contactsResult.data,
        page: contactsResult.pagination.page,
        perPage: contactsResult.pagination.perPage,
        totalItems: contactsResult.totalItems,
        totalPages: contactsResult.pagination.totalPages,
        hasPreviousPage: contactsResult.pagination.hasPreviousPage,
        hasNextPage: contactsResult.pagination.hasNextPage
      }
    });
  } catch (error) {
    next(createHttpError(500, 'Failed to fetch contacts'));
  }
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const contact = await getContactById(contactId, req.user._id);

    if (!contact) {
      return next(createHttpError(404, 'Contact not found'));
    }

    res.status(200).json({
      status: res.statusCode,
      data: contact,
      message: `Successfully found contact with id ${contactId}!`,
    });
  } catch (error) {
    next(createHttpError(500, 'Failed to fetch contact by ID'));
  }
};

export const createContactController = async (req, res, next) => {
  try {
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;
    const contact = {
      name,
      phoneNumber,
      email,
      isFavourite,
      contactType,
      userId: req.user._id,
    };

    const createdContact = await createContact(contact);

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: createdContact,
    });
  } catch (error) {
    next(createHttpError(500, 'Failed to create contact'));
  }
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const result = await deleteContact(contactId, req.user._id);

    if (!result) {
      return next(createHttpError(404, 'Contact not found'));
    }

    res.status(204).send();
  } catch (error) {
    next(createHttpError(500, 'Failed to delete contact'));
  }
};

export const updateContactController = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const result = await updateContact(contactId, req.body, req.user._id, { upsert: true });

    if (!result) {
      return next(createHttpError(404, 'Contact not found'));
    }

    const status = result.inNew ? 201 : 200;

    res.status(status).json({
      status,
      message: 'Successfully updated contact!',
      data: result.contact,
    });
  } catch (error) {
    next(createHttpError(500, 'Failed to update contact'));
  }
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const result = await updateContact(contactId, req.body, req.user._id);

    if (!result) {
      return next(createHttpError(404, 'Contact not found'));
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully patched contact!',
      data: result.contact,
    });
  } catch (error) {
    next(createHttpError(500, 'Failed to patch contact'));
  }
};
