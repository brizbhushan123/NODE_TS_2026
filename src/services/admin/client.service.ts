import { Request, Response } from "express";
import { ApiResponse, Context } from "../../utils/apiResponse";
import Client from "../../models/client.model";
import { serviceResponse, ServiceResponse } from "../../utils/serviceResponse";


export const createClientService = async (
  req: Request,
): Promise<ServiceResponse> => {

   try {
    const clientObj = await Client.create(req.body);
    if(!clientObj){
        return serviceResponse.error("CLIENT_NOT_FOUND", {}, 400);
    }
    return serviceResponse.success("CLIENT_CREATED", clientObj);
  } catch (error) {
    return serviceResponse.error("INTERNAL_SERVER_ERROR", error, 500);
  }
 
};

