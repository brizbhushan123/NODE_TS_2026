import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest } from "../../utils/validation";
import { createSession } from "../../services/candidate/authentication.service";
import { ApiResponse, Context } from "../../utils/apiResponse";
import logger from "../../config/logger";
import * as tokenUtils from "../../utils/tokenUtils";
import * as stepService from "../../services/candidate/stepService";



export const stageStart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validationRules = [
        body("environment").notEmpty().withMessage("environment is required") 
    ];

    const validation = await validateRequest(validationRules, req);

    if (!validation.status) {
      res.status(validation.httpCode).json(ApiResponse.error(validation.key, validation.data));
      return;
    }

    const result = await stepService.stageStart(req);

    if (!result.status) {
      res.status(result.httpCode).json(ApiResponse.error(result.key, result.data));
      return;
    }
    
    res.status(result.httpCode).json(ApiResponse.success(result.key, result.data));
    return;
    
  } catch (error) {
    next(error); // send to global error handler
  }
};



export const stageEnd = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
    const validationRules = [
        body("environment").notEmpty().withMessage("environment is required") 
    ];

    const validation = await validateRequest(validationRules, req);

    if (!validation.status) {
      res.status(validation.httpCode).json(ApiResponse.error(validation.key, validation.data));
      return;
    }

    const result = await stepService.stageEnd(req);

    if (!result.status) {
      res.status(result.httpCode).json(ApiResponse.error(result.key, result.data));
      return;
    }
    
    res.status(result.httpCode).json(ApiResponse.success(result.key, result.data));
    return;
    
  } catch (error) {
    next(error); // send to global error handler
  } 
}