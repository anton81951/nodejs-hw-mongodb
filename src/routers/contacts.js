import { Router } from "express";

import { validateBody } from "../middlewares/validateBody.js";
import { isValidId } from "../middlewares/isValidId.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

import { createContactSchema } from "../validation/contacts.js";

import {
  getContactsController,
  getContactByIdController,
  createContactController,
  deleteContactController,
  updateContactController,
  patchContactController
} from "../controllers/contacts.js";

import { authenticate } from "../middlewares/authenticate.js";

import { upload } from '../middlewares/multer.js';

const contactRouter = Router();

contactRouter.use(authenticate);

contactRouter.get('/contacts', ctrlWrapper(getContactsController));
contactRouter.get('/contacts/:contactId', isValidId, ctrlWrapper(getContactByIdController));

contactRouter.post('/contacts', upload.single('photo'), validateBody(createContactSchema), ctrlWrapper(createContactController));

contactRouter.delete('/contacts/:contactId', isValidId, ctrlWrapper(deleteContactController));

contactRouter.put('/contacts/:contactId', isValidId, validateBody(createContactSchema), ctrlWrapper(updateContactController));

contactRouter.patch('/contacts/:contactId', isValidId, upload.single('photo'), ctrlWrapper(patchContactController));

export default contactRouter;
