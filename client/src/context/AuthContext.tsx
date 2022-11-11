import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProviderProps } from '../types/general';
import React from 'react';

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

export const useLogin = () =>
  useMutation((variables: LoginVariables) => mockLogin(variables), {
    mutationKey: ['user'],
  });

export const useAuthentication = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, data, ...loginMutation } = useLogin();

  const login = async (variables: LoginVariables) => {
    await mutateAsync(variables);
  };

  const logout = React.useCallback(() => {
    queryClient.clear();
    loginMutation.reset();
  }, [queryClient, loginMutation]);

  return { login, logout, user: data, ...loginMutation };
};

export type AuthState = ReturnType<typeof useAuthentication>;

export const AuthContext = React.createContext<AuthState | null>(null);

const AuthProvider = (props: ProviderProps) => {
  const auth = useAuthentication();
  return <AuthContext.Provider value={auth}>{props.children}</AuthContext.Provider>;
};

export const useAuth = () => React.useContext(AuthContext) as AuthState;

export default AuthProvider;
