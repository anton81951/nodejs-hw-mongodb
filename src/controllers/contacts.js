import createHttpError from 'http-errors';
import {
  getAllContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact
} from '../services/contactService.js';

export const getContactsController = async (req, res, next) => {
    try {
        const contacts = await getAllContacts();
        res.status(200).json({
            status: res.statusCode,
            data: contacts,
            message: 'Successfully found contacts!'
        });
    } catch (error) {
        next(createHttpError(500, 'Failed to fetch contacts', { cause: error }));
    }
};

export const getContactByIdController = async (req, res, next) => {
    const { contactId } = req.params;
    try {
        const contact = await getContactById(contactId);
        if (!contact) {
            return next(createHttpError(404, 'Contact not found'));
        }
        res.status(200).json({
            status: res.statusCode,
            data: contact,
            message: `Successfully found contact with id ${contactId}!`
        });
    } catch (error) {
        next(createHttpError(500, 'Failed to fetch contact', { cause: error }));
    }
};

export const createContactController = async (req, res) => {

    const { name, phoneNumber, contactType } = req.body;

    if (!name || !phoneNumber || !contactType) {
        return next(createHttpError(400, 'Missing required fields: name, phoneNumber, and contactType are mandatory'));
    }

    const contact = await createContact(req.body);
    res.status(201).json({
        status: 201,
        message: 'Successfully created a contact!',
        data: contact,
    });
};

export const deleteContactController = async (req, res, next) => {
    const { contactId } = req.params;

        const contact = await deleteContact(contactId);
        if (!contact) {
            return next(createHttpError(404, 'Contact not found'));
        }
        res.status(204).send();
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
