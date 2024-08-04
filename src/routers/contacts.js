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
import { authenticate } from "../middlewares/authenticate.js";

const contactRouter = Router();

contactRouter.use(authenticate);

contactRouter.get('/contacts', ctrlWrapper(getContactsController));
contactRouter.get('/contacts/:contactId', isValidId, ctrlWrapper(getContactByIdController));

contactRouter.post('/contacts', validateBody(createContactSchema), ctrlWrapper(createContactController));

contactRouter.delete('/contacts/:contactId', isValidId, ctrlWrapper(deleteContactController));

contactRouter.put('/contacts/:contactId', isValidId, validateBody(createContactSchema), ctrlWrapper(updateContactController));

contactRouter.patch('/contacts/:contactId', isValidId, ctrlWrapper(patchContactController));

export default contactRouter;
