import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  styles: {
    global: {
      html: { overflowY: 'scroll' },
      'html, body': {
        color: 'gray.600',
        bg: '#FFFCF6',
        fontSize: '14px',
      },
      body: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        alignItems: 'center',
      },
    },
  },
});
