import { Router } from "express";
import { getContactsController,
        getContactByIdController,
        createContactController,
        deleteContactController,
        updateContactController
} from "../controllers/contactController";
import { ctrlWrapper } from "../utils/ctrlWrapper";

const contactRouter = Router();

contactRouter.get('/contacts', ctrlWrapper(getContactsController));

contactRouter.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));

contactRouter.post('/students', ctrlWrapper(createContactController));

contactRouter.delete('/contacts/:contactId',
    ctrlWrapper(deleteContactController));

contactRouter.put('/contacts/:contactId',
    ctrlWrapper(updateContactController));

export default contactRouter;
