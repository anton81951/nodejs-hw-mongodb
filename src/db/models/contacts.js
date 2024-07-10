import { Schema } from "mongoose";

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
        type: Email,
        required: optional,
      },
      isFavourite: {
        type: Boolean,
        default: false,
      },
      contactType {
        type: String,
        enum: ['work', 'home', 'personal'],
        required: true,
        default: 'personal',
      },
    },
    {
      timestamps: true,
      versionKey: false,
    },
  );
