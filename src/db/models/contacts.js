import { model, Schema } from "mongoose";
import validator from "validator";

const contactsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      validate: {
        validator: validator.isEmail,
        message: props => `${props.value} is not a valid email!`,
      },
      required: false,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      required: true,
      default: 'personal',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const ContactsCollection = model('contacts', contactsSchema);
