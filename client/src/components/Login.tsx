import { Box, Button, VStack } from '@chakra-ui/react';
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

  return (
    <VStack justify='center' align='center' minH='100vh' spacing={10}>
      <FormProvider {...methods}>
        <VStack as='form' onSubmit={methods.handleSubmit(auth.login)} spacing={4}>
          <InputField name='username' />
          <InputField name='password' />
          <Button type='submit' disabled={!!auth.user} bg='#FFF9EE' _hover={{ bg: '#FFF5E3' }}>
            log in
          </Button>
        </VStack>
      </FormProvider>
      {auth.user && (
        <VStack spacing={2}>
          <Box>username: {auth.user?.username}</Box>
          <Box>email: {auth.user?.email}</Box>
          <Button onClick={auth.logout}>log out</Button>
        </VStack>
      )}
    </VStack>
  );
};
