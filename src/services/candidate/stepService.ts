import { Request } from "express";
import { serviceResponse, ServiceResponse } from "../../utils/serviceResponse";

import masterEnvironment from "../../models/masterEnvironment";
import { context } from "../../utils/context";
import SessionDetail from "../../models/sessionDetail.model";
import CandidateSessionInitiateLog from "../../models/CandidateSessionInitiateLog.model";
import  seedMasterEnvironment from  "../../seeds/masterEnvironment.seed";

type RequestBodyInterface = {
  environment: string;
};

export const stageStart = async (
  req: Request<{}, {}, RequestBodyInterface>,
): Promise<ServiceResponse> => {
  
    const { environment } = req.body;

    const envObj = await getEnvironmentId(environment);
    if (!envObj.status) return envObj;
    const environmentId = envObj.data.environmentId;

    const sessionDetails = await getSessionDetails();
    if (!sessionDetails.status) return sessionDetails;
    const candidateId = sessionDetails.data?.candidateId || "";

    const inserArr = {
      candidateId: candidateId,
      sessionId: context.get("sessionId"),
      templateId: context.get("templateId"),
      environmentVariableId: environmentId,
      startDateTime: new Date(),
      attemptNumber: 0,
      instanceId: context.get("instanceId"),
      credibilityScore: 0,
    };    
    const logsObj = await candidateSessionInitateLogs(inserArr);

    return serviceResponse.success("DEFAULT", logsObj.data);
};


export const stageEnd = async(
  req: Request<{}, {}, RequestBodyInterface>
):  Promise<ServiceResponse>=> {

    const { environment } = req.body;

    const envObj = await getEnvironmentId(environment);
    if (!envObj.status) return envObj;
    const environmentId = envObj.data.environmentId;
   
    const logsObj = await CandidateSessionInitiateLog.updateOne(
      {
        sessionId: context.get('sessionId'),
        instanceId: context.get('instanceId'),
        environmentVariableId: environmentId
      } as any,
      { $set: { environmentVariableValue: 'END STEP', completeDateTime: new Date() } }
    );

    return serviceResponse.success("DEFAULT", logsObj);
}

async function getEnvironmentId(environment: string): Promise<ServiceResponse> {
  //await seedMasterEnvironment(); // insert if not exists
  const envObj = await masterEnvironment
    .findOne({ subEnvironmentAlias: environment })
    .select("_id subEnvironmentAlias");
  return serviceResponse.success("DEFAULT", {
    environmentId: envObj?._id.toString() || "",
    environmentValue: envObj?.subEnvironmentAlias || "",
  });
}

async function getSessionDetails() {
  const sessionDetails = await SessionDetail.findOne({
    _id: context.get("sessionId"),
  }).select("candidateId");
  const candidateId =
    sessionDetails && sessionDetails.candidateId
      ? sessionDetails.candidateId.toString()
      : "";
  return serviceResponse.success("DEFAULT", { candidateId });
}

async function candidateSessionInitateLogs(inserArr: any) {
  const result = await CandidateSessionInitiateLog.create(inserArr);
  return serviceResponse.success("DEFAULT", result);
}
