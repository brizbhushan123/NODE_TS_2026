import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMasterTimeZone extends Document {
  timeZoneName: string;
  timeZoneCode: string;
  utcOffset: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const masterTimeZoneSchema = new Schema<IMasterTimeZone>(
  {
    timeZoneName: { type: String, required: true, trim: true },
    timeZoneCode: { type: String, required: true, trim: true, unique: true }, // e.g. Asia/Kolkata
    utcOffset: { type: String, required: true, trim: true }, // e.g. UTC+05:30
  },
  {
    collection: "masterTimeZone",
    timestamps: true,
    versionKey: false,
  }
);

//masterTimeZoneSchema.index({ timeZoneCode: -1 });

export default mongoose.model<IMasterTimeZone>("MasterTimeZone", masterTimeZoneSchema);