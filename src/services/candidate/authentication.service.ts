import { Request } from "express";
import * as commonUtils from "../../utils/commonUtils";
import { serviceResponse, ServiceResponse } from "../../utils/serviceResponse";
import * as authRepository from "../../repository/candidate/auth.repository";
import { context } from "../../utils/context";
import { utility } from "../../utils/utility";
import * as tokenUtils from "../../utils/tokenUtils";
import { getTemplateSettingDetail } from "../../repository/candidate/template.repository";


type RequestBodyType = {
  api_key: string;
  sdk_token: string;
  unique_user_id: string;
  user_name: string;
  group_code: string;
  group_name?: string;
  template_code: string;
  language: string;
  session_token?: string;
  registration_photo_url?: string;
  registration_id_url?: string;
  time_zone?: string;
  preview?: number;
};

export const createSession = async (
  req: Request<{}, {}, RequestBodyType>
): Promise<ServiceResponse> => {

    const {
      api_key: apiKey,
      sdk_token: sdkToken,
      unique_user_id: uniqueUserId,
      user_name: userName,
      group_code: groupCode,
      group_name: groupName,
      template_code: templateCode,
      language,
      session_token: sessionToken = "",
      registration_photo_url: photoSourceUrl = "",
      registration_id_url: idSourceUrl = "",
      time_zone: timeZone = "Asia/Kolkata",
      preview: isPreview = 0,
    } = req.body;

    const userIP = req.ip || req.socket.remoteAddress || "";
    const userAgent = req.get("User-Agent") || "";

    const browserInfo = commonUtils.detectBrowser(userAgent);

    // 1. decode token
    const tokenResult = authRepository.decodeSessionToken(sessionToken);
    if (!tokenResult.status) return tokenResult;
    let sessionId = tokenResult.data.sessionId;

    // 2. validate client
    const clientResult = await authRepository.validateClientDetails(apiKey);
    if (!clientResult.status) return clientResult;

    const clientId = clientResult.data.clientId;
    const secretKey = clientResult.data.secretKey;
    context.set("clientId", clientId);

    const sdkTokenValidationResult = await authRepository.validateSdkToken(sdkToken, secretKey, apiKey, uniqueUserId, groupCode);
    if (!sdkTokenValidationResult.status) return sdkTokenValidationResult;

    const templateValidationResult = await authRepository.validateTemplate(templateCode);
    if (!templateValidationResult.status) return templateValidationResult;

    if (sessionToken != '' && sessionId > 0) {
      // const sessionObj = await authRepository.getLoginSessionTemplate(sessionId);
      // if(templateValidationResult.data.templateId != sessionObj.data.templateId) {
      //   return serviceResponse.error("TEMPLATE_MISMATCH", {}, 403);
      // }
    }

    let groupData = await authRepository.checkCandidateGroup(groupCode);
    if(!groupData.status && groupData.httpCode == 500) return groupData;
    if (!groupData.status) {
       groupData = await authRepository.createNewGroup(groupName ?? "", groupCode);
       if(!groupData.status && groupData.httpCode == 500) return groupData;
    }

    let candidateDetail = await authRepository.checkCandidateDetails(uniqueUserId);
    if (!candidateDetail.status) {
      candidateDetail = await authRepository.createNewCandidate(userName, uniqueUserId);
    } else {
      await authRepository.updateCandidate(userName, uniqueUserId);
    }

    const langObj = await authRepository.getLanguage(language);
    if(!langObj.status) return langObj;
    const langId = langObj.data.langId;
    const langAlias = langObj.data.languageAlias.toLowerCase();

    const candidateId = candidateDetail.data.candidateId;
    const groupId = groupData.data.groupId;
    const templateId = templateValidationResult.data.templateId;

    if (sessionToken == '' && sessionId == '') {
      const sessionObj = await authRepository.insertStudentSession(groupId, candidateId, templateId, isPreview);
      if (!sessionObj.status) return sessionObj;
      sessionId = sessionObj.data.sessionId;
    } 

    const timeZoneObj = await authRepository.getTimeZoneId(timeZone);
    //utility.log("Session instance creation result:", timeZoneObj);
    const timeZoneId = timeZoneObj.status ? timeZoneObj.data.timeZoneId : null;
    const userDevice = commonUtils.platform();  // e.g., Linux, Windows, iOS, Android

    const instanceObj = {
        'sessionId': sessionId,
        'languageId': langId,
        'startDateTime': new Date(),
        'EVId': 0,
        'timeZoneId': timeZoneId,
        'candidateIp': userIP,
        'candidateDevice': userDevice,
        'browserAgent': browserInfo,
    };
    const sessionInstance = await authRepository.insertSessionInstance(instanceObj, isPreview);
    //utility.log("Session instance creation result:", instanceObj);
    if (!sessionInstance.status) return sessionInstance;
    const instanceId = sessionInstance.data.instanceId;
    // // Set context for image uploads
    context.set('sessionId', sessionId);
    context.set('instanceId', instanceId);
    const sessionTokenObj = {
      sessionId: sessionId, 
      instanceId: instanceId, 
      clientId: clientId, 
      templateId: templateId,
      language: langAlias
    };
    const sessionTokenData = tokenUtils.generateToken(sessionTokenObj, tokenUtils.ROLE_CANDIDATE);
    const ufmSubType = {};
    const templateJson = await getTemplateSettingDetail(templateId, clientId);
      // 10. Prepare and return response
    const returnData = {
      session_token: sessionTokenData,
      ai_frame_rate: process.env.AI_FRAME_RATE,
      ufm_capture_time: process.env.UFM_CAPTURE_TIME,
      ufm_sub_type: ufmSubType,
      config: tokenUtils.getConfiguration(process.env.SDK_ENV+"_"+clientId+"_C_"+sessionId),
      language: langAlias,
      candidate_name: candidateDetail.data.candidateName,
      socketUserName: process.env.SDK_ENV+"_"+clientId+"_C_"+sessionId,
      socketRoomName: process.env.SDK_ENV+"_"+clientId+"_C_"+sessionId,
      template: templateJson,
      previous_instance_escalated: false,
      sessionId: sessionId,
      instanceId: instanceId,
      is_preview: isPreview,
      ai_token: sessionTokenData
    };
    return serviceResponse.success('SDK_LOGIN_SUCCESS', returnData);
 
};

