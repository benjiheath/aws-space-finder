import { AuthService } from './authService';
import { config } from '../../config';
import * as AWS from 'aws-sdk';

AWS.config.region = config.cognito.region;

const getBuckets = async () => {
  let buckets;

  try {
    buckets = await new AWS.S3().listBuckets().promise();
  } catch (e) {
    buckets = undefined;
  }

  return buckets;
};

const runTest = async () => {
  const authService = new AuthService();
  const { testUser } = config.cognito;

  const user = await authService.login(testUser.username, testUser.password);
  await authService.getAWSTempCreds(user);

  const someCreds = AWS.config.credentials;

  const buckets = await getBuckets();
};

runTest();
