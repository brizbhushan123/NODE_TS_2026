import mongoose from "mongoose";
import { connectDB } from "../config/db";
import { utility } from "../utils/utility";

import seedFakeClient from "./client.seed";
import seedMasterEnvironment from "./masterEnvironment.seed";
import seedMasterLanguages from "./masterLanguage.seed";
import seedMasterTimeZones from "./masterTimeZone.seed";
import seedTemplateDetails from "./template.seed";
import seedUfmMaster from "./masterUfm.seed";

import dotenv from 'dotenv';

dotenv.config();

const runSeed = async (): Promise<void> => {
  try {
    await connectDB();

    utility.log("🌱 Running seeders...");

    // 👉 Run all seeders in parallel
    await Promise.all([
      seedFakeClient(),
      seedMasterEnvironment(),
      seedMasterLanguages(),
      seedMasterTimeZones(),
      seedUfmMaster(),
    ]);

    await seedTemplateDetails();

    utility.log("✅ All seeders executed successfully");

    // Close DB connection gracefully
    await mongoose.connection.close();
    utility.log("🔌 DB connection closed");

    process.exit(0);
  } catch (error) {
    utility.error("❌ Seeder failed:", error);

    try {
      await mongoose.connection.close();
    } catch (_) {}

    process.exit(1);
  }
};

runSeed();
