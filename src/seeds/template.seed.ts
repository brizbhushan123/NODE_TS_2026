import mongoose from "mongoose";
import TemplateDetail from "../models/templateDetail.model";
import Client from "../models/client.model";
import { utility } from "../utils/utility";

const defaultTemplates = [
      {
        templateName: "Basic Proctoring",
        templateCode: "BASIC_PROCTORING",
        proctoringModeId: 1,
        deviceSupportId: 1,
        monitoringSetupId: 1,
        isStrictnessEnabled: true,
        strictnessLevelId: 1,
        sessionRecordingTypeId: 1,
        imageCaptureInterval: 30,
        isRequiredScreenSharing: true,
        maxSpeakerCheckAttempt: 3,
        isSmartProctorEnabled: true,
        isCaptureIdEnabled: true,
        isAuthRegPhoto: true,
        isAuthRegId: false,
        isAuthCaptureId: false,
        isAIRevokeFaceCaptureAttempt: false,
        isHumanValidationRequired: false,
        roomSanitizationAttempt: 2,
        isAIRevokeEnabled: false,
        isAIFrontViewCam: true,
        isAISideViewCam: false,
        isAIBackViewCam: false,
        isLiveCustomCam: false,
        liveCustomCamIns: "",
        failureThreshold: 3,
        suspiciousThreshold: 2,
        isPenaltyEnabled: false,
        suspendTime: 5,
        isTerminateEnabled: false,
        proctorUFMMaxScoreDeduction: 10,
        isSuperProctorEnabled: false,
        proctorCharacteristicEnabled: false,
        proctorScore: 50,
        minExperience: 1,
        sessionExperience: 1,
        preferredTimeZoneId: 1,
        backgroundVerification: "none",
        educationQualificationId: 1,
        otherText: "",
        addUserId: new mongoose.Types.ObjectId("67f00d5c3c6b2d9b6c8a2222"), // replace if needed
        updateUserId: new mongoose.Types.ObjectId("67f00d5c3c6b2d9b6c8a2222"), // replace if needed
        clientId: new mongoose.Types.ObjectId("69d0176bbe027deb50639f2c"), // replace with real client _id
        isActive: true,
        isContinuityCamera: false,
        intervalContinuityCamera: 0,
      },
      {
        templateName: "Advanced AI Proctoring",
        templateCode: "ADV_AI_PROCTORING",
        proctoringModeId: 2,
        deviceSupportId: 1,
        monitoringSetupId: 2,
        isStrictnessEnabled: true,
        strictnessLevelId: 2,
        sessionRecordingTypeId: 2,
        imageCaptureInterval: 15,
        isRequiredScreenSharing: true,
        maxSpeakerCheckAttempt: 5,
        isSmartProctorEnabled: true,
        isCaptureIdEnabled: true,
        isAuthRegPhoto: true,
        isAuthRegId: true,
        isAuthCaptureId: true,
        isAIRevokeFaceCaptureAttempt: true,
        isHumanValidationRequired: true,
        roomSanitizationAttempt: 3,
        isAIRevokeEnabled: true,
        isAIFrontViewCam: true,
        isAISideViewCam: true,
        isAIBackViewCam: false,
        isLiveCustomCam: false,
        liveCustomCamIns: "",
        failureThreshold: 5,
        suspiciousThreshold: 3,
        isPenaltyEnabled: true,
        suspendTime: 10,
        isTerminateEnabled: true,
        proctorUFMMaxScoreDeduction: 20,
        isSuperProctorEnabled: true,
        proctorCharacteristicEnabled: true,
        proctorScore: 80,
        minExperience: 2,
        sessionExperience: 2,
        preferredTimeZoneId: 1,
        backgroundVerification: "basic",
        educationQualificationId: 2,
        otherText: "AI enabled template",
        addUserId: new mongoose.Types.ObjectId("67f00d5c3c6b2d9b6c8a2222"), // replace if needed
        updateUserId: new mongoose.Types.ObjectId("67f00d5c3c6b2d9b6c8a2222"), // replace if needed
        clientId: new mongoose.Types.ObjectId("69d0176bbe027deb50639f2c"), // replace with real client _id
        isActive: true,
        isContinuityCamera: true,
        intervalContinuityCamera: 60,
      },
    ];
    
const seedTemplateDetails = async () => {
  try {
    const clientObj = await Client.findOne({}, {_id: 1}).sort({_id: 1}).lean();
     if (!clientObj || !clientObj._id) {
      utility.warn("No client found. Template seeding aborted.");
      return;
    }

    for (const template of defaultTemplates) {
        template.clientId = clientObj._id instanceof mongoose.Types.ObjectId
        ? clientObj._id
        : new mongoose.Types.ObjectId(clientObj._id);

        await TemplateDetail.updateOne(
            { templateCode: template.templateCode },
            { $set: template },
            { upsert: true }
        );

        utility.log(`Template Name: ${template.templateName}`);
    };
    utility.log("✅ TemplateDetail seeding completed");
  } catch (error) {
    utility.error("TemplateDetail seeding error:", error);
    throw error;
  }
};

export default seedTemplateDetails;