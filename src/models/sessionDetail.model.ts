import mongoose, { Schema } from "mongoose";

const sessionDetailSchema = new Schema(
  {
    currentInstanceId: { type: Schema.Types.ObjectId, ref: "SessionInstance" },
    groupId: { type: Schema.Types.ObjectId, ref: "GroupDetail", required: true },
    candidateId: { type: Schema.Types.ObjectId, ref: "CandidateDetail", required: true },
    clientId: { type: Schema.Types.ObjectId, ref: "Client", required: true },
    templateId: { type: Schema.Types.ObjectId, ref: "TemplateDetail", required: true },
    sysDateTime: { type: Date, default: Date.now },
    credibilityScore: { type: Number, default: 100, min: 0 },
    sessionTypeId: { type: Number, default: 0 },
    isCompleted: { type: Boolean, default: false },
    isSuspended: { type: Boolean, default: false },
    isTerminated: { type: Boolean, default: false },
    sessionDuration: { type: Number, default: 0, min: 0 },
    internalCredibilityScore: { type: Number, default: 100, min: 0 },
    currentEventId: { type: Number, default: 0 },
    isOffline: { type: Boolean, default: false },
    isPaused: { type: Boolean, default: false },
    timeZoneId: { type: Number, default: 0 },
    adjustedCredibilityScore: { type: Number, default: 0, min: 0 },
    isContentDeleted: { type: Boolean, default: false },
    isPreview: { type: Boolean, default: false },
  },
  {
    collection: "sessionDetails",
    timestamps: true,
    versionKey: false,
  },
);


const SessionDetail = mongoose.model("SessionDetail", sessionDetailSchema);

export default SessionDetail;
