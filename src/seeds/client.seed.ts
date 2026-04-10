import mongoose from "mongoose";
import Client from "../models/client.model";
import { utility } from "../utils/utility";

const insertData = [
  {
    isActive: true,
    expiryDate: new Date("2027-12-31T23:59:59.000Z"),
    createdBy: new mongoose.Types.ObjectId("67f00d5c3c6b2d9b6c8a2222"),
    apiKey: "9c78ec6b-1689-4f5a-8942-a4427393fb07",
    secretKey: process.env.CLIENT_SECRET_KEY || "secret_1",
    timeZone: "Asia/Kolkata",
    retentionDays: 1,
    dateFormat: "DD/MM/YYYY",
    defaultLanguage: "en",
  },
  {
    isActive: true,
    expiryDate: new Date("2028-06-30T23:59:59.000Z"),
    createdBy: new mongoose.Types.ObjectId("67f00d5c3c6b2d9b6c8a2222"),
    apiKey: "2b91c7f1-1a2b-4d9a-91f1-abc123456001",
    secretKey: process.env.CLIENT_SECRET_KEY || "secret_2",
    timeZone: "Asia/Dubai",
    retentionDays: 7,
    dateFormat: "MM/DD/YYYY",
    defaultLanguage: "en",
  },
  {
    isActive: false,
    expiryDate: new Date("2026-12-31T23:59:59.000Z"),
    createdBy: new mongoose.Types.ObjectId("67f00d5c3c6b2d9b6c8a2222"),
    apiKey: "7f3d9c88-55aa-4b2c-9d77-xyz987654321",
    secretKey: process.env.CLIENT_SECRET_KEY || "secret_3",
    timeZone: "Asia/Singapore",
    retentionDays: 30,
    dateFormat: "YYYY-MM-DD",
    defaultLanguage: "en",
  }
];

const seedFakeClient = async () => {
  try {
    for (const clientRow of insertData) {
      await Client.updateOne(
        { apiKey: clientRow.apiKey },
        { $setOnInsert: clientRow },
        { upsert: true }
      );

      utility.log(`✅ Seeded client: ${clientRow.apiKey}`);
    }

    utility.log("✅ All clients seeded successfully");
  } catch (error) {
    utility.error("❌ Seeder error:", error);
    throw error;
  }
};

export default seedFakeClient;