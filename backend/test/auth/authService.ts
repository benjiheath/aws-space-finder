import Amplify from 'aws-amplify';
import { Auth } from 'aws-amplify';
import { CognitoUser } from '@aws-amplify/auth';
import { config } from '../../config';
import * as AWS from 'aws-sdk';

const congitoConfig = config.cognito;

Amplify.configure({
  Auth: {
    mandatorySignIn: false,
    region: congitoConfig.region,
    userPoolId: congitoConfig.userPool.id,
    userPoolWebClientId: congitoConfig.appClient.id,
    identityPoolId: congitoConfig.identityPool.id,
    authenticationFlowType: 'USER_PASSWORD_AUTH',
  },
});

export class AuthService {
  public async login(username: string, password: string) {
    const user = (await Auth.signIn(username, password)) as CognitoUser;
    return user;
  }

  public async getAWSTempCreds(user: CognitoUser) {
    AWS.config.credentials = new AWS.CognitoIdentityCredentials(
      {
        IdentityPoolId: congitoConfig.identityPool.id,
        Logins: {
          [congitoConfig.identityPool.address]: user.getSignInUserSession()!.getIdToken().getJwtToken(),
        },
      },
      {
        region: congitoConfig.region,
      }
    );
    await this.refreshCreds();
  }

  private async refreshCreds(): Promise<void> {
    return new Promise((resolve, reject) => {
      (AWS.config.credentials as AWS.Credentials).refresh((err) => (err ? reject(err) : resolve()));
    });
  }
}
