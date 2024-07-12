import {createHttpError} from 'http-errors';

import { getAllContacts, getContactById } from '../services/contactService.js';


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
      if (!contact) {
        throw new createHttpError(404, 'Student not found');
      }
      res.status(200).json({ status: res.statusCode, data: contact, message: `Successfully found contact with id ${contactId}!` });
    } catch (error) {
      res.status(500).json({ status: res.statusCode, message: 'Failed to fetch contact', error: error.message });
    }
  };

