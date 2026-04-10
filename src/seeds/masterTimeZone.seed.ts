import mongoose from "mongoose";
import MasterTimeZone from "../models/masterTimeZone.model";
import { utility } from "../utils/utility";

const timeZones = [
  {
    timeZoneName: "India Standard Time",
    timeZoneCode: "Asia/Kolkata",
    utcOffset: "UTC+05:30",
  },
  {
    timeZoneName: "Greenwich Mean Time",
    timeZoneCode: "Europe/London",
    utcOffset: "UTC+00:00",
  },
  {
    timeZoneName: "Eastern Standard Time",
    timeZoneCode: "America/New_York",
    utcOffset: "UTC-05:00",
  },
  {
    timeZoneName: "Central Standard Time",
    timeZoneCode: "America/Chicago",
    utcOffset: "UTC-06:00",
  },
  {
    timeZoneName: "Mountain Standard Time",
    timeZoneCode: "America/Denver",
    utcOffset: "UTC-07:00",
  },
  {
    timeZoneName: "Pacific Standard Time",
    timeZoneCode: "America/Los_Angeles",
    utcOffset: "UTC-08:00",
  },
  {
    timeZoneName: "Gulf Standard Time",
    timeZoneCode: "Asia/Dubai",
    utcOffset: "UTC+04:00",
  },
  {
    timeZoneName: "Singapore Standard Time",
    timeZoneCode: "Asia/Singapore",
    utcOffset: "UTC+08:00",
  },
  {
    timeZoneName: "Japan Standard Time",
    timeZoneCode: "Asia/Tokyo",
    utcOffset: "UTC+09:00",
  },
  {
    timeZoneName: "Australian Eastern Time",
    timeZoneCode: "Australia/Sydney",
    utcOffset: "UTC+10:00",
  },
];

const seedMasterTimeZones = async () => {
  try {
    for (const tz of timeZones) {
      await MasterTimeZone.updateOne(
        { timeZoneCode: tz.timeZoneCode },
        { $set: tz },
        { upsert: true }
      );
    }

    utility.log("✅ MasterTimeZone seeded successfully");
  } catch (error) {
    utility.error("❌ Error seeding MasterTimeZone:", error);
     throw error;
  }
};

export default seedMasterTimeZones;