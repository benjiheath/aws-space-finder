import { ComponentStyleConfig, extendTheme, SystemStyleInterpolation } from '@chakra-ui/react';

export const palette = {
  cream: {
    100: '#FFFCF6',
    200: '#faf4e9',
    300: '#faf3e7',
    400: '#f3efe3',
    500: '#ebe6d5',
    600: '#e6dfca',
    700: '#e0d8c1',
    800: '#d4c9ae',
    900: '#ccc1a5',
    grayed: {
      300: '#e9e1d8',
    },
  },
  error: '#AB0552',
};

const baseButtonStyles: SystemStyleInterpolation = {
  minW: '76px',
};

type ComponentStyles = Record<string, ComponentStyleConfig>;

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
  colors: {
    cream: palette.cream,
    error: palette.error,
  },
  components: {
    Button: {
      defaultProps: {
        variant: 'primary',
      },
      variants: {
        primary: {
          ...baseButtonStyles,
          bg: 'cream.400',

          _hover: {
            bg: 'cream.500',
          },
        },
        secondary: {
          ...baseButtonStyles,
          transition: '0.2s',
          bg: 'cream.100',
          outline: '2px solid',
          outlineColor: 'cream.grayed.300',
          _hover: {
            outlineColor: 'cream.200',
          },
        },
      },
    },
  } as ComponentStyles,
});
