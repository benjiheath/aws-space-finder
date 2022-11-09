import { config as env } from 'dotenv';
import { getEnv } from '../../config';

env();

export const cognitoConfig = {
  REGION: getEnv('REGION'),
  USER_POOL_ID: getEnv('USER_POOL_ID'),
  APP_CLIENT_ID: getEnv('APP_CLIENT_ID'),
  TEST_USER_NAME: getEnv('TEST_USER_NAME'),
  TEST_USER_PASSWORD: getEnv('TEST_USER_PASSWORD'),
};
