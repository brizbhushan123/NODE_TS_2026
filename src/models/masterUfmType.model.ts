import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUfmMaster extends Document {
  ufmAlias: string;
  ufmName: string;
  ufmDescription?: string;
  isActive: boolean;
  accuracyPercent: number;
  createdAt: Date;
  updatedAt: Date;
}

const ufmMasterSchema: Schema<IUfmMaster> = new Schema(
  {
    ufmAlias: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    ufmName: {
      type: String,
      required: true,
      trim: true,
    },
    ufmDescription: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    accuracyPercent: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
    collection: "masterUfmType", // ✅ your custom collection name
    versionKey: false, // ❌ removes __v
  }
);


const MasterUfmType: Model<IUfmMaster> = mongoose.model<IUfmMaster>(
  "MasterUfmType",
  ufmMasterSchema
);

export default MasterUfmType;