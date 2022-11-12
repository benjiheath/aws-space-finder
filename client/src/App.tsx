import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChakraProvider } from '@chakra-ui/react';
import AuthProvider from './context/AuthContext';
import { Login } from './components/Login';
import { Nav } from './components/Nav';
import { theme } from './theme';
import { createReactRouter, createRouteConfig, RouterProvider, Outlet } from '@tanstack/react-router';
import { Home } from './components/Home';
import { Profile } from './components/Profile';

const routeConfig = createRouteConfig().createChildren((createRoute) => [
  createRoute({
    path: '/',
    element: <Login />,
  }),
  createRoute({
    path: 'home',
    element: <Home />,
  }),

  createRoute({
    path: 'profile',
    element: <Profile />,
  }),
]);

export const router = createReactRouter({ routeConfig });

export const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router}>
          <ChakraProvider theme={theme}>
            <Nav />
            <Outlet />
          </ChakraProvider>
        </RouterProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};
