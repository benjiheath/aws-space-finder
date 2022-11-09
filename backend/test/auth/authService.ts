import { cognitoConfig } from './config';
import Amplify from 'aws-amplify';
import { Auth } from 'aws-amplify';
import { CognitoUser } from '@aws-amplify/auth';

Amplify.configure({
  Auth: {
    mandatorySignIn: false,
    region: cognitoConfig.REGION,
    userPoolId: cognitoConfig.USER_POOL_ID,
    userPoolWebClientId: cognitoConfig.APP_CLIENT_ID,
    authenticationFlowType: 'USER_PASSWORD_AUTH',
  },
});

export class AuthService {
  public async login(username: string, password: string) {
    const user = (await Auth.signIn(username, password)) as CognitoUser;

    return user;
  }
}
