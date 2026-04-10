import MasterUfmType from "../models/masterUfmType.model";
import { utility } from "../utils/utility";

const insertData = [
  {
    ufmAlias: "FM",
    ufmName: "Face Mismatch",
    ufmDescription: "Face Mismatch",
    isActive: true,
    accuracyPercent: 97,
  },
  {
    ufmAlias: "MFD",
    ufmName: "Multi Face Detected",
    ufmDescription: "Multiple Face Detected",
    isActive: true,
    accuracyPercent: 94,
  },
  {
    ufmAlias: "FNP",
    ufmName: "Face Not Present",
    ufmDescription: "Face Not Present",
    isActive: true,
    accuracyPercent: 98,
  },
  {
    ufmAlias: "PR",
    ufmName: "Permission Revoked",
    ufmDescription: "Permission revoke",
    isActive: true,
    accuracyPercent: 100,
  },
  {
    ufmAlias: "OD",
    ufmName: "Object Detected",
    ufmDescription: "Object Detect",
    isActive: true,
    accuracyPercent: 98,
  },
  {
    ufmAlias: "SFL",
    ufmName: "Screen Focus Lost",
    ufmDescription: "Screen focus lost",
    isActive: true,
    accuracyPercent: 99,
  },
  {
    ufmAlias: "VD",
    ufmName: "Voice Detected",
    ufmDescription: "Voice Detection",
    isActive: true,
    accuracyPercent: 99,
  },
  {
    ufmAlias: "VM",
    ufmName: "Voice Muted",
    ufmDescription: "Voice Muted",
    isActive: true,
    accuracyPercent: 90,
  },
  {
    ufmAlias: "LA",
    ufmName: "Looking Away",
    ufmDescription: "Looking Away",
    isActive: true,
    accuracyPercent: 96,
  },
  {
    ufmAlias: "CC",
    ufmName: "Continuity Camera",
    ufmDescription: "Continuity Camera",
    isActive: false, // 👈 from 0
    accuracyPercent: 90,
  },
];

const seedUfmMaster = async (): Promise<void> => {
  try {
    for (const item of insertData) {
      await MasterUfmType.updateOne(
        { ufmAlias: item.ufmAlias },
        { $setOnInsert: item },
        { upsert: true }
      );

      utility.log(`✅ Seeded ufm: ${item.ufmAlias}`);
    }

    utility.log("✅ UFM Master seeded successfully");
  } catch (error) {
    utility.error("❌ Seeder error:", error);
    throw error;
  }
};

export default seedUfmMaster;