import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Login } from './components/Login';
import AuthProvider from './context/AuthContext';
import { theme } from './theme';

export const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ChakraProvider theme={theme}>
          <Login />
        </ChakraProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};
