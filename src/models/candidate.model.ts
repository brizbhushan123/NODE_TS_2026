import mongoose from "mongoose";
import { timeStamp } from "node:console";

const candidateDetailSchema = new mongoose.Schema(
  {
    candidateName: { type: String, required: true, trim: true, maxlength: 250 },
    candidateUniqueId: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, default: null, trim: true, maxlength: 250, lowercase: true },
    isActive: { type: Boolean, default: true },
    regDate: { type: Date, required: true },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
    sysDateTime: { type: Date, default: Date.now },
    updateDateTime: { type: Date, default: null, timeStamp: true }
  },
  {
    collection: "candidateDetails",
    timestamps: false,
    versionKey: false
  }
);

candidateDetailSchema.index({ candidateUniqueId: 1 });

export default mongoose.model("CandidateDetail", candidateDetailSchema);