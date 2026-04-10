import jwt from "jsonwebtoken";
import { context } from "../../utils/context";
import { utility } from "../../utils/utility";
import Client from "../../models/client.model";
import TemplateDetail from "../../models/templateDetail.model";
import SessionDetail from "../../models/sessionDetail.model";
import { serviceResponse, ServiceResponse } from "../../utils/serviceResponse";
import GroupDetail from "../../models/groupDetail.model";
import CandidateDetail from "../../models/candidate.model";
import MasterLanguage from "../../models/masterLanguage.model";
import MasterTimeZone from "../../models/masterTimeZone.model";
import SessionInstance from "../../models/sessionInstance.model";


interface SessionTokenPayload {
  data: {
    sessionId: string;
  };
  iat?: number;
  exp?: number;
}
interface SdkTokenPayload {
  data: {
    apiKey: string;
    uniqueUserId: string;
    groupCode: string;
  };
  iat?: number;
  exp?: number;
}

export function decodeSessionToken(sessionToken: string): ServiceResponse {
  if (!sessionToken) {
    return serviceResponse.success("TOKEN_OPTIONAL", { sessionId: "" });
  }

  try {
    const jwtSecretKey = process.env.JWT_SECRET || "";
    const decoded = jwt.verify(
      sessionToken,
      jwtSecretKey,
    ) as SessionTokenPayload;

    return serviceResponse.success("TOKEN_VALID", {
      sessionId: decoded.data.sessionId,
    });
  } catch (error) {
    return serviceResponse.error("TOKEN_INVALID", {}, 401);
  }
}

export async function validateClientDetails(
  apiKey: string,
): Promise<ServiceResponse> {
 
    const client = await Client.findOne({ apiKey: apiKey });

    if (!client) {
      return serviceResponse.error("CLIENT_NOT_FOUND", {}, 404);
    }

    if (!client.isActive) {
      return serviceResponse.error("CLIENT_DEACTIVE", {}, 403);
    }

    return serviceResponse.success("CLIENT_VALID", {
      clientId: client._id.toString(),
      secretKey: client.secretKey,
      apiKey: client.apiKey,
    });
 
}

export async function validateSdkToken(
  sdkToken: string,
  secretKey: string,
  apiKey: string,
  uniqueUserId: string,
  groupCode: string,
): Promise<ServiceResponse> {
  if (!sdkToken) {
    return serviceResponse.error("SDK_TOKEN_REQUIRED");
  }

  try {
    const decoded = jwt.verify(sdkToken, secretKey) as SdkTokenPayload;
    if (
      apiKey !== decoded.data.apiKey ||
      uniqueUserId !== decoded.data.uniqueUserId ||
      groupCode !== decoded.data.groupCode
    ) {
     // return serviceResponse.error("SDK_TOKEN_INVALID", {}, 401);
    }
    return serviceResponse.success("SDK_TOKEN_VALID");
  } catch (error) {
    return serviceResponse.success("SDK_TOKEN_VALID");
    //return serviceResponse.error("SDK_TOKEN_INVALID", {}, 401);
  }
}

export async function validateTemplate(
  templateCode: string,
): Promise<ServiceResponse> {
  
    const template = await TemplateDetail.findOne({ templateCode: templateCode });

    if (!template) {
      return serviceResponse.error("TEMPLATE_NOT_FOUND");
    }
    //console.log("Template found:", template);
    return serviceResponse.success("DEFAULT", {
      templateId: template._id.toString(),
      templateName: template.templateName,
    });
 
}

export async function getLoginSessionTemplate(
  sessionId: string,
): Promise<ServiceResponse> {
  const sessions = await SessionDetail.find({ sessionId }).populate({
    path: "templateId",
    select: "templateName templateCode isActive",
  });
  if (!sessions || sessions.length === 0) {
    return serviceResponse.error("SESSION_NOT_FOUND");
  }
  return serviceResponse.success("DEFAULT", { session: sessions[0] });
}

export async function checkCandidateGroup(groupCode: string): Promise<ServiceResponse> {
    const group = await GroupDetail.findOne({ groupCode: groupCode });
    if (!group) {
      return serviceResponse.error("GROUP_NOT_FOUND");
    }
    return serviceResponse.success(undefined, { groupId: group._id.toString() });
}
export async function createNewGroup(groupName: string, groupCode: string): Promise<ServiceResponse> {
    utility.log("Creating new group with name:", groupName, "and code:", groupCode, "for clientId:", context.getAll());
    const newGroup = new GroupDetail({ groupName, groupCode, clientId: context.get("clientId") });
    await newGroup.save();
    return serviceResponse.success(undefined, { groupId: newGroup._id.toString() });
  
}

export async function checkCandidateDetails(candidateUniqueId: string): Promise<ServiceResponse> {
  const clientId = context.get("clientId") ?? "";
  const candidate = await CandidateDetail.findOne({
    candidateUniqueId,
    clientId,
  }).select("_id candidateName isActive");

  if (!candidate) {
    return serviceResponse.error("CANDIDATE_NOT_FOUND");
  }
  return serviceResponse.success("DEFAULT", { 
      candidateId: candidate._id.toString(),
      candidateName: candidate.candidateName,
     });
}

export async function createNewCandidate(candidateName: string, candidateUniqueId: string): Promise<ServiceResponse> {
  const clientId = context.get("clientId") ?? "";
  const newCandidate = new CandidateDetail({
    candidateName,
    candidateUniqueId,
    isActive: true,
    clientId,
    regDate: new Date(),
  });

    await newCandidate.save();
    return serviceResponse.success("DEFAULT", { candidateId: newCandidate._id.toString(), candidateName: newCandidate.candidateName });
 
}
export async function updateCandidate(candidateName: string, candidateUniqueId: string): Promise<ServiceResponse> {
  const clientId = context.get("clientId") ?? "";
    await CandidateDetail.updateOne(
      { candidateUniqueId, clientId },
      { $set: { candidateName, updateDateTime: new Date() } }
    );
    return serviceResponse.success("DEFAULT");
  
}

 export async function getLanguage(language: string): Promise<ServiceResponse> {
      const languageCode = language.trim().toLowerCase();
      let langObj =   await MasterLanguage.findOne({ languageCode}).select('_id languageCode languageName');
      if(langObj == null){
         langObj =   await MasterLanguage.findOne({ languageCode: 'EN' }).select('_id languageCode languageName');
      }
      if (langObj == null) {
            return serviceResponse.error('LANGUAGE_NOT_FOUND');
      }
      return serviceResponse.success("DEFAULT", {langId: langObj._id.toString(), languageAlias: langObj.languageCode });
   }

  export async function insertStudentSession(groupId: string, candidateId: string, templateId: string, isPreview: number): Promise<ServiceResponse> {
       const insertData = {
           groupId,
           candidateId,
           templateId,
           sysDateTime: new Date(),
           clientId: context.get('clientId'),
           sessionTypeId: 1,
           isPreview,
           isOffline: 1
       };
       const sessionDetail = new SessionDetail(insertData);
       await sessionDetail.save();
       return serviceResponse.success("DEFAULT", { sessionId: sessionDetail._id });
   }

   export async function getTimeZoneId(timeZoneCode: string): Promise<ServiceResponse> {
    const tz = await MasterTimeZone.findOne({ timeZoneCode }).select("_id timeZoneCode timeZoneName");
    if (!tz) {
      const defaultTz = await MasterTimeZone.findOne({ timeZoneCode: "Asia/Kolkata" }).select("_id timeZoneCode timeZoneName");
      return serviceResponse.success("DEFAULT", { timeZoneId: defaultTz?._id.toString() || "" });
    }
    return serviceResponse.success("DEFAULT", { timeZoneId: tz._id.toString() || "" });
   }

  export async function insertSessionInstance(instanceData: any, isPreview: number): Promise<ServiceResponse> {
        const sessionInstance = new SessionInstance(instanceData);
        await sessionInstance.save();
        if (sessionInstance) {
          SessionDetail.updateOne(
            { _id: instanceData.sessionId },
            { $set: { currentInstanceId: sessionInstance._id } }
          ).exec();
        }
       return serviceResponse.success("DEFAULT", { instanceId: sessionInstance._id });
    
  }
  
