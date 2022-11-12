import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProviderProps } from '../types/general';
import React from 'react';
import { router } from '../App';
import Auth, { CognitoUser } from '@aws-amplify/auth';
import Amplify from 'aws-amplify';

export interface User {
  username: string;
  email?: string;
  cognitoUser: CognitoUser;
}

export interface LoginVariables {
  username: string;
  password: string;
}

Amplify.configure({
  Auth: {
    mandatorySignIn: false,
    region: process.env.REACT_APP_REGION,
    userPoolId: process.env.REACT_APP_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_APP_CLIENT_ID,
    identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
    authenticationFlowType: 'USER_PASSWORD_AUTH',
  },
});

const loginFetcher = async (variables: LoginVariables): Promise<User> => {
  const cognitoUser = (await Auth.signIn(variables.username, variables.password)) as CognitoUser;
  const attributes = await Auth.userAttributes(cognitoUser);

  return {
    username: cognitoUser.getUsername(),
    email: attributes.find((a) => a.Name === 'email')?.Value,
    cognitoUser,
  };
};

const useAuthentication = () => {
  const queryClient = useQueryClient();
  const loginMutation = useMutation((variables: LoginVariables) => loginFetcher(variables));

  React.useEffect(() => {
    if (!loginMutation.data) {
      router.navigate({ to: '/' });
    }
  }, [loginMutation.data]);

  const login = React.useCallback(
    async (variables: LoginVariables) => {
      const user = await loginMutation.mutateAsync(variables);

      if (user) {
        router.navigate({ to: '/home' });
      }
    },
    [loginMutation]
  );

  const logout = React.useCallback(() => {
    queryClient.clear();
    loginMutation.reset();
    router.navigate({ to: '/' });
  }, [queryClient, loginMutation]);

  return { login, logout, user: loginMutation.data, ...loginMutation };
};

type AuthState = ReturnType<typeof useAuthentication>;

const AuthContext = React.createContext<AuthState | null>(null);

const AuthProvider = (props: ProviderProps) => {
  const auth = useAuthentication();

  return <AuthContext.Provider value={auth}>{props.children}</AuthContext.Provider>;
};

export const useAuth = () => React.useContext(AuthContext) as AuthState;

export default AuthProvider;
