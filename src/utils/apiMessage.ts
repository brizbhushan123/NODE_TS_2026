export type ApiResponseType = "SUCCESS" | "ERROR";

export interface ApiMessageConfig {
  code: number;
  message_key: string;
}

export const apiMessages: Record<ApiResponseType, Record<string, ApiMessageConfig>> = {
  SUCCESS: {
    DEFAULT: { code: 2000, message_key: "default" },
    SESSION_CREATED: { code: 2001, message_key: "session_created" },
    CLIENT_CREATED: { code: 2002, message_key: "client_created" },
    TEMPLATE_VALID: { code: 2003, message_key: "template_valid" },
    SDK_LOGIN_SUCCESS: { code: 2004, message_key: "sdk_login_success" },
  },
  ERROR: {
    DEFAULT: { code: 4000, message_key: "error_default" },
    VALIDATION_ERROR: { code: 4220, message_key: "validation_error" },
    TOKEN_INVALID: { code: 4010, message_key: "token_invalid" },
    CLIENT_NOT_FOUND: { code: 4040, message_key: "client_not_found" },
    CLIENT_DEACTIVE: { code: 4030, message_key: "client_deactive" },
    DATABASE_ERROR: { code: 5001, message_key: "database_error" },
    INTERNAL_SERVER_ERROR: { code: 5000, message_key: "internal_server_error" },
    TEMPLATE_NOT_FOUND: { code: 4041, message_key: "template_not_found" },
    GROUP_NOT_FOUND: { code: 4042, message_key: "group_not_found" },
    LANGUAGE_NOT_FOUND: { code: 4043, message_key: "language_not_found" },
    TOKEN_MISSING: { code: 4044, message_key: "token_missing"}
  },
};