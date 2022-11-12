import { Box, HStack, Link } from '@chakra-ui/react';
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
          minW={500}
          justify='space-between'
          borderBottom='2px solid'
          borderBottomColor='cream.200'
        >
          <Box>
            <router.Link to='/home'>
              <Link mr={6}>home</Link>
            </router.Link>
            <router.Link to='/profile'>
              <Link>profile</Link>
            </router.Link>
          </Box>

          <router.Link to='/'>
            <Link onClick={logout}>log out</Link>
          </router.Link>
        </HStack>
      )}
    </>
  );
};
