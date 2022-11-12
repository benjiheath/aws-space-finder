import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProviderProps } from '../types/general';
import React from 'react';
import { router } from '../App';

export interface User {
  username: string;
  email: string;
}

export interface LoginVariables {
  username: string;
  password: string;
}

const mockLogin = async (variables: LoginVariables): Promise<User | undefined> => {
  if (variables.username === 'test' && variables.password === 'test') {
    return {
      username: 'test',
      email: 'test',
    };
  }
};

const useAuthentication = () => {
  const queryClient = useQueryClient();
  const loginMutation = useMutation((variables: LoginVariables) => mockLogin(variables));

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
