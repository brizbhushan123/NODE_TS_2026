import TemplateDetail from "../../models/templateDetail.model";
import UfmMaster from "../../models/masterUfmType.model";
import mongoose from "mongoose";

export const getTemplateSettingDetail = async (
  templateId: string,
  clientId: string,
  noDetails = false
) => {
  // ✅ 1. Get template
  const template = await TemplateDetail.findOne({
    _id: templateId,
    clientId: new mongoose.Types.ObjectId(clientId),
    isActive: true,
  }).lean();

  if (templateId && !template) {
    throw {
      message: "Template Not Found",
      status: 404,
    };
  }

  const t = template || {} as any;

  // ✅ 2. Basic flags
  const smartProctorEnabled = t.isSmartProctorEnabled ?? false;

  const isContinuityCameraOn = t.isContinuityCamera ?? false;
  const continuityCameraInterval = t.intervalContinuityCamera ?? 10;

  // ✅ 3. Mode logic
  let monitoringSetUpId = 0;
  let humanValidationRequired = false;
  let liveCustomCam = false;
  let proctorTriggeredUfm = 0;
  let superProctorEnabled = false;
  let proctorCharacteristicEnabled = false;
  let aiRevokeFaceCapture = false;
  let aiRevokeFaceCaptureAttempt = 0;
  let aiRevokeEnabled = false;

  if (t.proctoringModeId === 2) {
    monitoringSetUpId = t.monitoringSetupId ?? 0;
    humanValidationRequired = t.isHumanValidationRequired ?? false;
    liveCustomCam = t.isLiveCustomCam ?? false;
    proctorTriggeredUfm = t.proctorUFMMaxScoreDeduction ? 1 : 0;
    superProctorEnabled = t.isSuperProctorEnabled ?? false;
    proctorCharacteristicEnabled = t.proctorCharacteristicEnabled ?? false;
  } else {
    aiRevokeFaceCapture = !!t.isAIRevokeFaceCaptureAttempt;
    aiRevokeFaceCaptureAttempt = t.isAIRevokeFaceCaptureAttempt ?? 0;
    aiRevokeEnabled = t.isAIRevokeEnabled ?? false;
  }

  // ✅ 4. Camera logic
  const aiEnables =
    t.isAIFrontViewCam || t.isAISideViewCam || t.isAIBackViewCam ? 1 : 0;

  const additionalCamera = aiEnables || liveCustomCam ? 1 : 0;

  const liveCustomCamIns = liveCustomCam ? t.liveCustomCamIns || "" : "";

  // ✅ 5. Recording logic
  const imageCaptureInterval =
    t.sessionRecordingTypeId === 2 ? t.imageCaptureInterval : 0;

  // ✅ 6. UFM Master
  const ufmList = await UfmMaster.find(
    noDetails ? {} : { isActive: true }
  ).lean();

  // ⚠️ Replace with your actual model if exists
  const templateCredScoreRes: any[] = []; // TODO: fetch from DB

  const templateCredScoreArr: Record<string, any> = {};
  templateCredScoreRes.forEach((row) => {
    templateCredScoreArr[row.ufmId] = {
      active: 1,
      escalation_count: row.escalationCount,
      score_deducted: row.scoreDeducted,
    };
  });

  // ✅ 7. Build UFM object
  const ufmArr: any = {};

  ufmList.forEach((ufm: object|any) => {
    const cred = templateCredScoreArr[ufm._id?.toString()] || {};

    ufmArr[ufm.ufmAlias] = {
      value: cred.active || 0,
      data: {
        id: ufm._id,
        ufm_name: ufm.ufmAlias,
        ufm_desc: ufm.ufmDescription,
        is_active: ufm.isActive,
        accuracy: ufm.accuracyPercent,
        escalation_count: cred.escalation_count || 0,
        score_deducted: cred.score_deducted || 0,
      },
    };
  });

  // ✅ 8. Final Response (IMPORTANT)
  const data: any = {
    template_name: {
      value: t.templateName || "Untitled",
    },
    template_code: {
      value: t.templateCode || generateCode(),
    },
    device_support: {
      value: t.deviceSupportId || 0,
    },
    proctoring_mode: {
      value: t.proctoringModeId || 0,
    },
    monitoring_setup: {
      value: monitoringSetUpId,
    },
    strictness_enabled: {
      value: t.isStrictnessEnabled || false,
    },
    session_recording: {
      value: t.sessionRecordingTypeId ? 1 : 0,
      data: {
        session_recording_type: {
          value: t.sessionRecordingTypeId || 0,
          image_capture_interval: imageCaptureInterval,
        },
      },
    },
    smart_proctor_enabled: {
      value: smartProctorEnabled,
    },
    candidate_authentication: {
      value:
        t.isCaptureIdEnabled ||
        t.isAuthRegPhoto ||
        t.isAuthRegId ||
        t.isAuthCaptureId ||
        aiRevokeFaceCapture ||
        humanValidationRequired
          ? 1
          : 0,
    },
    additional_cam: {
      value: additionalCamera,
      data: {
        ai_enable: aiEnables,
        live_custom_cam: liveCustomCam,
        live_custom_cam_ins: liveCustomCamIns,
      },
    },
    failure_threshold: {
      value: t.failureThreshold || 0,
    },
    suspicious_threshold: {
      value: t.suspiciousThreshold || 0,
    },
    ufm: {
      data: ufmArr,
    },
    proctor_triggered_ufm: {
      value: proctorTriggeredUfm,
    },
    super_proctor_enabled: {
      value: superProctorEnabled,
    },
    proctor_characteristic_enabled: {
      value: proctorCharacteristicEnabled,
    },
    continuity_camera: {
      value: isContinuityCameraOn,
      data: {
        continuity_camera_interval: continuityCameraInterval,
      },
    },
  };

  return data;
};

// 🔥 helper
const generateCode = () => {
  return "TMP_" + Math.random().toString(36).substring(2, 8).toUpperCase();
};