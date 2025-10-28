import { config as conf } from 'dotenv';
import ms from 'ms';
conf();

/**
 * exporting the environment variables
 */
export const config = Object.freeze({
  MONGO_URI: process.env.MONGO_URI || '',
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY as ms.StringValue,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY as ms.StringValue,
  LOG_LEVEL: process.env.LOG_LEVEL,
  API_KEY: process.env.API_KEY,
});

/**
 * exporting http status codes
 */
export const statusCodes = Object.freeze({
  OK: 200,
  CREATED: 202,
  NO_CONTENT: 204,
  RESET_CONTENT: 205,
  pARTIAL_CONTENT: 206,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDED: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUEST: 429,
  INTERNAL_SERVER_ERROR: 500,
});
