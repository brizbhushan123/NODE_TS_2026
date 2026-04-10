import mongoose from "mongoose";
import masterEnvironment from "../models/masterEnvironment";
import { utility } from "../utils/utility";

const seedData = [
  {
    environmentValue: "System Check",
    subEnvironmentValue: "Browser Check",
    subEnvironmentAlias: "Browser_Check",
  },
  {
    environmentValue: "System Check",
    subEnvironmentValue: "Screen Check",
    subEnvironmentAlias: "Screen_Check",
  },
  {
    environmentValue: "System Check",
    subEnvironmentValue: "Webcam Check",
    subEnvironmentAlias: "Webcam_Check",
  },
  {
    environmentValue: "System Check",
    subEnvironmentValue: "Network Check",
    subEnvironmentAlias: "Network_Check",
  },
  {
    environmentValue: "System Check",
    subEnvironmentValue: "Mic Check",
    subEnvironmentAlias: "Mic_Check",
  },
  {
    environmentValue: "Photo Verification",
    subEnvironmentValue: "Photo Verification",
    subEnvironmentAlias: "Photo_Verification",
  },
  {
    environmentValue: "Id Capture",
    subEnvironmentValue: "Id Capture",
    subEnvironmentAlias: "Id_Capture",
  },
  {
    environmentValue: "Room Sanitization",
    subEnvironmentValue: "Room Sanitization 360",
    subEnvironmentAlias: "Room_Sanitization_360",
  },
  {
    environmentValue: "Addtional Camera",
    subEnvironmentValue: "Side Camera Setup",
    subEnvironmentAlias: "Side_Camera",
  },
  {
    environmentValue: "Exam Session",
    subEnvironmentValue: "Exam Session",
    subEnvironmentAlias: "Exam_Session",
  },
  {
    environmentValue: "Identity Verification",
    subEnvironmentValue: "Identity Verification",
    subEnvironmentAlias: "Identity_Verification",
  },
  {
    environmentValue: "Lobby",
    subEnvironmentValue: "Lobby",
    subEnvironmentAlias: "Lobby",
  },
  {
    environmentValue: "Room Sanitization",
    subEnvironmentValue: "Desk Check",
    subEnvironmentAlias: "Desk_Check",
  },
  {
    environmentValue: "Room Sanitization",
    subEnvironmentValue: "Body Scan Check",
    subEnvironmentAlias: "Body_Scan_Check",
  },
  {
    environmentValue: "Addtional Camera",
    subEnvironmentValue: "Back Camera Setup",
    subEnvironmentAlias: "Back_Camera",
  },
  {
    environmentValue: "Addtional Camera",
    subEnvironmentValue: "Front Camera Setup",
    subEnvironmentAlias: "Front_Camera",
  },
  {
    environmentValue: "Complete",
    subEnvironmentValue: "Complete",
    subEnvironmentAlias: "Complete",
  },
  {
    environmentValue: "Custom Camera",
    subEnvironmentValue: "Custom Camera Setup",
    subEnvironmentAlias: "Custom_Camera",
  },
];

const seedMasterEnvironment = async () => {
  try {
    for(const environment of seedData){
        await masterEnvironment.updateOne(
            { subEnvironmentAlias: environment.subEnvironmentAlias },
            { $set: environment },
            { upsert: true }
        );
      };
    utility.log("✅ MasterEnvironment seeded successfully");
    
  } catch (error) {
    utility.error("Seeder error:", error);
     throw error;
  }
};

export default seedMasterEnvironment;