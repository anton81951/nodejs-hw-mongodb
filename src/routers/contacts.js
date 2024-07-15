import { Router } from "express";
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  deleteContactController,
  updateContactController,
  patchContactController
} from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper";

const contactRouter = Router();

contactRouter.get('/contacts', ctrlWrapper(getContactsController));

contactRouter.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));

contactRouter.post('/contacts', ctrlWrapper(createContactController));

contactRouter.delete('/contacts/:contactId', ctrlWrapper(deleteContactController));

contactRouter.put('/contacts/:contactId', ctrlWrapper(updateContactController));

contactRouter.patch('/contacts/:contactId', ctrlWrapper(patchContactController));

export default contactRouter;
