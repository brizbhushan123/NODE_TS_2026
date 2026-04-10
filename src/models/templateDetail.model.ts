import mongoose, { Schema, Document, Model } from "mongoose";

const templateDetailSchema = new Schema(
  {
    templateName: {
      type: String,
      required: true,
      trim: true,
    },
    templateCode: {
      type: String,
      trim: true,
      unique: true,
    },
    proctoringModeId: {
      type: Number,
    },
    deviceSupportId: {
      type: Number,
    },
    monitoringSetupId: {
      type: Number,
    },
    isStrictnessEnabled: {
      type: Boolean,
      default: false,
    },
    strictnessLevelId: {
      type: Number,
    },
    sessionRecordingTypeId: {
      type: Number,
    },
    imageCaptureInterval: {
      type: Number,
    },
    isRequiredScreenSharing: {
      type: Boolean,
      default: false,
    },
    maxSpeakerCheckAttempt: {
      type: Number,
    },
    isSmartProctorEnabled: {
      type: Boolean,
      default: false,
    },
    isCaptureIdEnabled: {
      type: Boolean,
      default: false,
    },
    isAuthRegPhoto: {
      type: Boolean,
      default: false,
    },
    isAuthRegId: {
      type: Boolean,
      default: false,
    },
    isAuthCaptureId: {
      type: Boolean,
      default: false,
    },
    isAIRevokeFaceCaptureAttempt: {
      type: Boolean,
      default: false,
    },
    isHumanValidationRequired: {
      type: Boolean,
      default: false,
    },
    roomSanitizationAttempt: {
      type: Number,
    },
    isAIRevokeEnabled: {
      type: Boolean,
      default: false,
    },
    isAIFrontViewCam: {
      type: Boolean,
      default: false,
    },
    isAISideViewCam: {
      type: Boolean,
      default: false,
    },
    isAIBackViewCam: {
      type: Boolean,
      default: false,
    },
    isLiveCustomCam: {
      type: Boolean,
      default: false,
    },
    liveCustomCamIns: {
      type: String,
      trim: true,
    },
    failureThreshold: {
      type: Number,
    },
    suspiciousThreshold: {
      type: Number,
    },
    isPenaltyEnabled: {
      type: Boolean,
      default: false,
    },
    suspendTime: {
      type: Number,
    },
    isTerminateEnabled: {
      type: Boolean,
      default: false,
    },
    proctorUFMMaxScoreDeduction: {
      type: Number,
    },
    isSuperProctorEnabled: {
      type: Boolean,
      default: false,
    },
    proctorCharacteristicEnabled: {
      type: Boolean,
      default: false,
    },
    proctorScore: {
      type: Number,
    },
    minExperience: {
      type: Number,
    },
    sessionExperience: {
      type: Number,
    },
    preferredTimeZoneId: {
      type: Number,
    },
    backgroundVerification: {
      type: String,
      trim: true,
    },
    educationQualificationId: {
      type: Number,
    },
    otherText: {
      type: String,
      trim: true,
    },
    addUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    updateUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isContinuityCamera: {
      type: Boolean,
      default: false,
    },
    intervalContinuityCamera: {
      type: Number,
    },
  },
  {
    timestamps: false,
    versionKey: false,
    collection: "templateDetails",
  }
);

const TemplateDetail = mongoose.model("TemplateDetail", templateDetailSchema);

export default TemplateDetail;
