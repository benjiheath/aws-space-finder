import { HStack, Link } from '@chakra-ui/react';
import { router } from '../App';
import { useAuth } from '../context/AuthContext';

export const Nav = () => {
  const { logout, user } = useAuth();

  return (
    <>
      {user && (
        <HStack
          py={4}
          mb={4}
          w='100%'
          justify='space-between'
          borderBottom='2px solid'
          borderBottomColor='cream.200'
        >
          <HStack spacing={6}>
            <router.Link to='/home'>
              <Link>home</Link>
            </router.Link>
            <router.Link to='/profile'>
              <Link>profile</Link>
            </router.Link>
            <router.Link to='/spaces'>
              <Link>spaces</Link>
            </router.Link>
          </HStack>

          <router.Link to='/'>
            <Link onClick={logout}>log out ({user.username})</Link>
          </router.Link>
        </HStack>
      )}
    </>
  );
};
