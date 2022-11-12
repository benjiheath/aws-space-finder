import { Heading, SimpleGrid, Text, TextProps } from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';

interface GridRowProps extends TextProps {
  label: string;
  value: string;
}

const GridRow = (props: GridRowProps) => {
  const { label, value, ...rest } = props;

  return (
    <>
      <Text fontWeight='bold' {...rest}>
        {label}
      </Text>
      <Text {...rest}>{value}</Text>
    </>
  );
};

export const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <>
      <Heading size='md' my={4}>
        Hello {user?.username},
      </Heading>
      <Text>Here's your info:</Text>
      <SimpleGrid columns={2} mt={4} spacingX={4} spacingY={2} w={200}>
        <GridRow label='username' value={user.username} />
        <GridRow label='email' value={user.email} />
      </SimpleGrid>
    </>
  );
};
