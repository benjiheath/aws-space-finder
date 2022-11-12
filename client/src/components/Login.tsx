import React from 'react';
import { Button, VStack } from '@chakra-ui/react';
import { FormProvider, useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { InputField } from './generic/InputField';

interface FormValues {
  username: string;
  password: string;
}

export const Login = () => {
  const auth = useAuth();
  const methods = useForm<FormValues>();

  React.useEffect(() => {
    const errMsg = (auth.error as Error)?.message;
    if (errMsg) {
      if (errMsg === 'invalid username') methods.setError('username', { message: 'invalid username' });
      if (errMsg === 'invalid password') methods.setError('password', { message: 'invalid password' });
    }
  }, [auth.error, methods]);

  return (
    <VStack justify='center' align='center' minH='100vh' spacing={10}>
      <FormProvider {...methods}>
        <VStack as='form' onSubmit={methods.handleSubmit(auth.login)} spacing={4}>
          <InputField name='username' />
          <InputField name='password' />
          <Button type='submit' disabled={!!auth.user} isLoading={auth.isLoading}>
            log in
          </Button>
        </VStack>
      </FormProvider>
    </VStack>
  );
};
