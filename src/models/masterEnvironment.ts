import mongoose from "mongoose";

const masterEnvironmentSchema = new mongoose.Schema(
  {
    environmentValue: {
      type: String,
      required: true,
      maxlength: 40
    },
    subEnvironmentValue: {
      type: String,
      required: true,
      maxlength: 40
    },
    subEnvironmentAlias: {
      type: String,
      required: true,
      maxlength: 50,
      index: true
    }
  },
  {
    collection: "masterEnvironment",
    timestamps: true
  }
);

export default mongoose.model("MasterEnvironment", masterEnvironmentSchema);