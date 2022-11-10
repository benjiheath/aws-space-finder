import { AuthService } from './authService';
import { config } from '../../config';
import * as AWS from 'aws-sdk';

const runTest = async () => {
  const authService = new AuthService();
  const { testUser } = config.cognito;

  const user = await authService.login(testUser.username, testUser.password);
  await authService.getAWSTempCreds(user);

  const someCreds = AWS.config.credentials;

  console.log('someCreds', someCreds);
};

runTest();
