import { ChakraProvider } from '@chakra-ui/react';
import { theme } from './theme';

export const App = () => <ChakraProvider theme={theme}></ChakraProvider>;
