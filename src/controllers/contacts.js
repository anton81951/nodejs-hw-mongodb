import {createHttpError} from 'http-errors';

import { getAllContacts,
        getContactById,
      createContact,
      deleteContact,
      updateContact
    } from '../services/contactService.js';


export const getContactsController = async (req, res) => {
    try {
      const contacts = await getAllContacts();
      res.status(200).json({ status: res.statusCode, data: contacts, message: 'Successfully found contacts!' });
    } catch (error) {
      res.status(500).json({ status: res.statusCode, message: 'Failed to fetch contacts', error: error.message });
    }
  };

export const getContactByIdController = async (req, res, next) => {
    const { contactId } = req.params;
    try {
      const contact = await getContactById(contactId);
      if(!contact) {
        next(createHttpError(404, 'Contact not found'));
        return;
      }
      res.status(200).json({ status: res.statusCode, data: contact, message: `Successfully found contact with id ${contactId}!` });
    } catch (error) {
      res.status(500).json({ status: res.statusCode, message: 'Failed to fetch contact', error: error.message });
    }
  };


  export const createContactController = async (req, res) => {
    const contact = await createContact(req.body);

    res.status(201).json({
      status: 201,
      message: `Successfully created a contact!`,
      data: contact,
    });
  };

  export const deleteContactController = async (req, res, next) => {

    const { contactId } = req.params;

    const contact = await deleteContact(contactId);

    if(!contact) {
      next(createHttpError(404, 'Contact not found'));
      return;
    }

    res.status(204).send();
  }

  export const updateContactController = async (req, res, next) => {

    const { contactId } = req.params;

    const result = await updateContact(contactId, req.body, {
      upsert: true,
    });

    if(!result) {
      next(createHttpError(404, 'Contact not found'));
      return;
    }

    const status = result.isNew ? 201 : 200;

    res.status(status).json({
      status,
      message: 'Successfully upserted a contact!',
      data: result.contact,
    });
  };

  export const patchContactController = async ( req, res, next ) => {

    const { contactId } = req.params;
    const result = await updateContact(contactId, req.body);

    if(!result) {
      next(createHttpError(404, 'Contact not found'));
      return;
    }

    res.json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: result.contact,
    });
  };




