import { Router } from "express";

import { validateBody } from "../middlewares/validateBody.js";
import { isValidId } from "../middlewares/isValidId.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { authenticate } from "../middlewares/authenticate.js";
import { upload } from "../middlewares/multer.js";

import { createContactSchema } from "../validation/contacts.js";
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  deleteContactController,
  updateContactController,
  patchContactController,
} from "../controllers/contacts.js";

const contactRouter = Router();

contactRouter.use(authenticate);

contactRouter.get("/", ctrlWrapper(getContactsController));
contactRouter.get("/:contactId", isValidId, ctrlWrapper(getContactByIdController));

contactRouter.post(
  "/",
  upload.single("photo"),
  validateBody(createContactSchema),
  ctrlWrapper(createContactController)
);

contactRouter.delete("/:contactId", isValidId, ctrlWrapper(deleteContactController));

contactRouter.put(
  "/:contactId",
  isValidId,
  validateBody(createContactSchema),
  ctrlWrapper(updateContactController)
);

contactRouter.patch(
  "/:contactId",
  isValidId,
  upload.single("photo"),
  ctrlWrapper(patchContactController)
);

export default contactRouter;
