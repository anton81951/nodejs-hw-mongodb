import dotenv from "dotenv";
import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';
import { getAllContacts, getContactById } from './services/contactService.js';

dotenv.config();

const PORT = Number(env('PORT', '3000'));

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello!',
    });
  });

  app.get('/contacts', async (req, res) => {
    try {
      const contacts = await getAllContacts();
      res.status(200).json({ status: res.statusCode, data: contacts, message: 'Successfully found contacts!' });
    } catch (error) {
      res.status(500).json({ status: res.statusCode, message: 'Failed to fetch contacts', error: error.message });
    }
  });

  app.get('/contacts/:contactId', async (req, res) => {
    const { contactId } = req.params;
    try {
      const contact = await getContactById(contactId);
      if (!contact) {
        res.status(404).json({ message: 'Contact not found' });
        return;
      }
      res.status(200).json({ status: res.statusCode, data: contact, message: `Successfully found contact with id ${contactId}!` });
    } catch (error) {
      res.status(500).json({ status: res.statusCode, message: 'Failed to fetch contact', error: error.message });
    }
  });

  app.use('*', (req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.use((err, req, res, next) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
