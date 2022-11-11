import { CfnOutput } from 'aws-cdk-lib';
import {
  UserPool,
  UserPoolClient,
  CfnIdentityPool,
  CfnIdentityPoolRoleAttachment,
} from 'aws-cdk-lib/aws-cognito';
import { Effect, FederatedPrincipal, PolicyStatement, Role } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class IdentityPoolWrapper {
  private scope: Construct;
  private userPool: UserPool;
  private userPoolClient: UserPoolClient;
  private identityPool: CfnIdentityPool;

  private authenticatedRole: Role;
  private unauthenticatedRole: Role;
  public adminRole: Role;

  constructor(scope: Construct, userPool: UserPool, userPoolClient: UserPoolClient) {
    this.scope = scope;
    this.userPool = userPool;
    this.userPoolClient = userPoolClient;
    this.init();
  }

  private init() {
    this.createIdentityPool();
    this.initRoles();
    this.attachRoles();
  }

  private createIdentityPool() {
    this.identityPool = new CfnIdentityPool(this.scope, 'SpaceFinderIdentityPool', {
      identityPoolName: 'SpaceFinderIdentityPool',
      allowUnauthenticatedIdentities: true,
      cognitoIdentityProviders: [
        {
          clientId: this.userPoolClient.userPoolClientId,
          providerName: this.userPool.userPoolProviderName,
        },
      ],
    });

    new CfnOutput(this.scope, 'IdentityPoolId', {
      value: this.identityPool.ref,
    });
  }

  public getIdentityPoolId(): string {
    return this.identityPool.ref;
  }

  private createRole(id: string, auth: 'authenticated' | 'unauthenticated') {
    return new Role(this.scope, id, {
      assumedBy: new FederatedPrincipal(
        'cognito-identity.amazonaws.com',
        {
          StringEquals: { 'cognito-identity.amazonaws.com:aud': this.identityPool.ref },
          'ForAnyValue:StringLike': { 'cognito-identity.amazonaws.com:amr': auth },
        },
        'sts:AssumeRoleWithWebIdentity'
      ),
    });
  }

  private initRoles() {
    this.authenticatedRole = this.createRole('CognitoDefaultAuthenticatedRole', 'authenticated');
    this.unauthenticatedRole = this.createRole('CognitoDefaultUnauthenticatedRole', 'unauthenticated');

    this.adminRole = this.createRole('CognitoAdminRole', 'authenticated');
    this.adminRole.addToPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['s3:ListAllMyBuckets'],
        resources: ['*'],
      })
    );
  }

  private attachRoles() {
    new CfnIdentityPoolRoleAttachment(this.scope, 'RolesAttachment', {
      identityPoolId: this.identityPool.ref,
      roles: {
        authenticated: this.authenticatedRole.roleArn,
        unauthenticated: this.unauthenticatedRole.roleArn,
      },
      roleMappings: {
        adminsMapping: {
          type: 'token',
          ambiguousRoleResolution: 'AuthenticatedRole',
          identityProvider: `${this.userPool.userPoolProviderName}:${this.userPoolClient.userPoolClientId}`,
        },
      },
    });
  }
}
