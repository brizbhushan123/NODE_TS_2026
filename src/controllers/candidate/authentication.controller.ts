import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest } from "../../utils/validation";
import { createSession } from "../../services/candidate/authentication.service";
import { ApiResponse, Context } from "../../utils/apiResponse";
import logger from "../../config/logger";
import * as tokenUtils from "../../utils/tokenUtils";

const alphaNumSpecialRegex = /^[a-zA-Z0-9_\-.@]+$/;

const validationRules = [
  body("api_key").notEmpty().withMessage("api_key is required"),
  body("sdk_token").notEmpty().withMessage("sdk_token is required"),
  body("unique_user_id")
    .notEmpty().withMessage("unique_user_id is required")
    .isLength({ max: 100 }).withMessage("unique_user_id must not exceed 100 characters")
    .matches(alphaNumSpecialRegex).withMessage("unique_user_id format is invalid"),
  body("user_name").notEmpty().withMessage("user_name is required"),
  body("group_code")
    .notEmpty().withMessage("group_code is required")
    .isLength({ max: 100 }).withMessage("group_code must not exceed 100 characters")
    .matches(alphaNumSpecialRegex).withMessage("group_code format is invalid"),
  body("template_code").notEmpty().withMessage("template_code is required"),
  body("language").notEmpty().withMessage("language is required"),
];

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    Context.add("lang", req.body.language?.toLowerCase() || "en");

    const validation = await validateRequest(validationRules, req);

    if (!validation.status) {
      res.status(validation.httpCode).json(ApiResponse.error(validation.key, validation.data));
      return;
    }

    const result = await createSession(req);

    if (!result.status) {
      res.status(result.httpCode).json(ApiResponse.error(result.key, result.data));
      return;
    }
    
    const sessionTokenData = result.data.session_token;
    const sessionCokie = tokenUtils.getAccessTokenCookieConfig(sessionTokenData, tokenUtils.ROLE_CANDIDATE);
    res.cookie(sessionCokie.name, sessionCokie.value, sessionCokie.options);

    res.status(result.httpCode).json(ApiResponse.success(result.key, result.data));
    return;
    
  } catch (error) {
    next(error);
  } finally {
    Context.clear();
  }
};