import mongoose, { Schema} from "mongoose";

const clientSchema = new Schema(
  {
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },

    expiryDate: {
      type: Date,
      required: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    apiKey: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    secretKey: {
      type: String,
      required: true,
      trim: true,
    },

    timeZone: {
      type: String,
      default: "Asia/Kolkata",
      required: true,
      trim: true,
    },

    retentionDays: {
      type: Number,
      default: 1,
      required: true,
      min: 1,
    },

    dateFormat: {
      type: String,
      default: "DD/MM/YYYY",
      required: true,
      trim: true,
    },

    defaultLanguage: {
      type: String,
      default: "en",
      required: true,
      trim: true,
    },
  },
  {
    collection: "clients",
    timestamps: false,
    versionKey: false,
  },
);

const Client = mongoose.model("Client", clientSchema);
export default Client;


