import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ICandidateSessionInitiateLog extends Document {
  candidateId: Types.ObjectId;
  sessionId: Types.ObjectId;
  instanceId: Types.ObjectId;
  templateId: Types.ObjectId;
  environmentVariableId: Types.ObjectId;
  environmentVariableValue?: string | null;
  startDateTime: Date;
  completeDateTime?: Date | null;
  attemptNumber: number;
  credibilityScore: number;
  sysDateTime: Date;
  updateDateTime?: Date | null;
}

const candidateSessionInitiateLogSchema: Schema<ICandidateSessionInitiateLog> =
  new Schema(
    {
      candidateId: {
        type: Schema.Types.ObjectId,
        ref: "CandidateDetail",
        required: true,
      },
      sessionId: {
        type: Schema.Types.ObjectId,
        ref: "SessionDetail",
        required: true,
      },
      instanceId: {
        type: Schema.Types.ObjectId,
        ref: "SessionInstance",
        required: true,
      },
      templateId: {
        type: Schema.Types.ObjectId,
        ref: "TemplateDetail",
        required: true,
      },
      environmentVariableId: {
        type: Schema.Types.ObjectId,
        ref: "MasterEnvironment",
        required: true,
        index: true,
      },
      environmentVariableValue: {
        type: String,
        default: null,
      },
      startDateTime: {
        type: Date,
        required: true,
      },
      completeDateTime: {
        type: Date,
        default: null,
      },
      attemptNumber: {
        type: Number,
        required: true,
      },
      credibilityScore: {
        type: Number,
        required: true,
      },
    },
    {
      collection: "candidateSessionInitiateLogs",
      timestamps: false,
    }
  );

const CandidateSessionInitiateLog: Model<ICandidateSessionInitiateLog> =
  mongoose.model<ICandidateSessionInitiateLog>(
    "CandidateSessionInitiateLog",
    candidateSessionInitiateLogSchema
  );

export default CandidateSessionInitiateLog;