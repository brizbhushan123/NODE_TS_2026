import mongoose, { Schema } from "mongoose";

const sessionInstanceSchema = new Schema(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: "SessionDetail", required: true, index: true },
    languageId: { type: Schema.Types.ObjectId, ref: "MasterLanguage", required: true },
    //eventId: { type: Schema.Types.ObjectId, ref: "EventDetail", required: true },
    startDateTime: { type: Date, required: true },
    endDateTime: { type: Date, default: null },
    instanceDuration: { type: Number, default: 0, min: 0 },
    orgPhotoPath: { type: String, default: null },
    cloudPhotoPath: { type: String, default: null, maxlength: 100 },
    livePhotoPath: { type: String, default: null, maxlength: 100 },
    orgIdPath: { type: String, default: null },
    cloudIdPath: { type: String, default: null, maxlength: 100 },
    liveIdPath: { type: String, default: null, maxlength: 100 },
    aiPhotoMatchP: { type: Number, default: null, min: 0 },
    aiIdPhotoMatchP: { type: Number, default: null, min: 0 },
    aiIdMatchP: { type: Number, default: null, min: 0 },
    candidateSeatingLocationId: { type: Number, default: 0 },
    seatingLocationReason: { type: String, default: null },
    timeZoneId: { type: Schema.Types.ObjectId, ref: "MasterTimeZone", required: true },
    candidateIp: { type: String, default: null, maxlength: 20 },
    candidateDevice: { type: String, default: null, maxlength: 500 },
    browserAgent: { type: String, default: null, maxlength: 500 },
    ip: { type: String, default: null, maxlength: 45 },
    os: { type: String, default: null, maxlength: 100 }
  },
  {
    collection: "sessionInstances",
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.model("SessionInstance", sessionInstanceSchema);