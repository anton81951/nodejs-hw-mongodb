import { Router } from "express";
import { getContactsController, getContactByIdController } from "../controllers/contactController";
import { ctrlWrapper } from "../utils/ctrlWrapper";

const contactRouter = Router();

contactRouter.get('/contacts', ctrlWrapper(getContactsController));

contactRouter.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));

export default contactRouter;
