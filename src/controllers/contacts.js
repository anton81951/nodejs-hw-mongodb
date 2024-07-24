import createHttpError from 'http-errors';
import {
  getAllContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact
} from '../services/contactService.js';

import  {parsePaginationParams} from '../utils/parsePaginationParams.js';
import {parseSortParams} from '../utils/parseSortParams.js';
import {parseFilterParams} from '../utils/parseFilterParams.js'

export const getContactsController = async (req, res, next) => {

        const { page, perPage } = parsePaginationParams(req.query);

        const { sortBy, sortOrder } = parseSortParams(req.query);

        const filter = parseFilterParams(req.query);

        const contacts = await getAllContacts(
            {
                page,
                perPage,
                sortBy,
                sortOrder,
                filter,
            }
        );
        res.status(200).json({
            status: res.statusCode,
            data: contacts,
            message: 'Successfully found contacts!'
        });
};

export const getContactByIdController = async (req, res, next) => {
    const { contactId } = req.params;

        const contact = await getContactById(contactId);
        if (!contact) {
            return next(createHttpError(404, 'Contact not found'));
        }
        res.status(200).json({
            status: res.statusCode,
            data: contact,
            message: `Successfully found contact with id ${contactId}!`
        });
};

export const createContactController = async (req, res, next) => {
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;

    const contact = { name, phoneNumber, email, isFavourite, contactType };

      const createdContact = await createContact(contact);
      res.status(201).json({
        status: 201,
        message: 'Successfully created a contact!',
        data: createdContact,
      });
  };

export const deleteContactController = async (req, res, next) => {
    const { contactId } = req.params;

        const result = await deleteContact(contactId);
        if (!result ) {
            return next(createHttpError(404, 'Contact not found'));
        }
        res.send({ status: 200, message: 'Contact deleted', data: result });
};

export const updateContactController = async (req, res, next) => {
    const { contactId } = req.params;

        const result = await updateContact(contactId, req.body, {
            upsert: true,
          });

        if (!result) {
            next(createHttpError(404, 'Contact not found'));
            return;
        }

        const status = result.inNew ? 201 : 200;

        res.status(status).json({
            status,
            message: 'Successfully updated contact!',
            data: result.contact,
        });
};

export const patchContactController = async (req, res, next) => {
    const { contactId } = req.params;

        const result = await updateContact(contactId, req.body);

        if (!result) {
            return next(createHttpError(404, 'Contact not found'));
        }
        res.status(200).json({
            status: 200,
            message: `Successfully patched contact!`,
            data: result.contact,
        });
};
