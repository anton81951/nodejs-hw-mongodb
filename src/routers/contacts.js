import { Router } from "express";

import { validateBody } from "../middlewares/validateBody.js";
import { isValidId } from "../middlewares/isValidId.js";

import { createContactSchema } from "../validation/contacts.js";

import {
  getContactsController,
  getContactByIdController,
  createContactController,
  deleteContactController,
  updateContactController,
  patchContactController
} from "../controllers/contacts.js";

import { ctrlWrapper } from "../utils/ctrlWrapper.js";

const contactRouter = Router();

contactRouter.get('/contacts', ctrlWrapper(getContactsController));
contactRouter.get('/contacts/:contactId', isValidId, ctrlWrapper(getContactByIdController));
contactRouter.post('/contacts', validateBody(createContactController), ctrlWrapper(createContactController));
contactRouter.delete('/contacts/:contactId', isValidId, ctrlWrapper(deleteContactController));
contactRouter.put('/contacts/:contactId', isValidId, validateBody(createContactController), ctrlWrapper(updateContactController));
contactRouter.patch('/contacts/:contactId', isValidId, validateBody(updateContactController), ctrlWrapper(patchContactController));

export default contactRouter;
