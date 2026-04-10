import mongoose from "mongoose";

const groupDetailSchema = new mongoose.Schema(
  {
    groupName: { type: String, required: true, trim: true, maxlength: 100 },
    groupCode: { type: String, required: true, trim: true, maxlength: 20 },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
    sysDateTime: { type: Date, default: Date.now }
  },
  {
    collection: "groupDetails",
    timestamps: false,
    versionKey: false
  }
);

const GroupDetail = mongoose.model("GroupDetail", groupDetailSchema);
export default GroupDetail;