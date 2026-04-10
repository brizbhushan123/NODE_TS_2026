import mongoose, { Schema, Document } from "mongoose";

export interface IMasterLanguage extends Document {
  languageName: string;
  languageCode: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const masterLanguageSchema = new Schema<IMasterLanguage>(
  {
    languageName: { type: String, required: true, unique: true, trim: true },
    languageCode: { type: String, required: true, unique: true, trim: true, maxlength: 20 },
  },
  {
    collection: "masterLanguage",
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model<IMasterLanguage>("MasterLanguage", masterLanguageSchema);