import {
  Heading,
  Image,
  SimpleGrid,
  VStack,
  Button,
  Text,
  HStack,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';

interface SpaceProps {
  name?: string;
  image?: string;
  number?: number;
  whereuat?: string;
  isReserved?: boolean;
}

const Space = (props: SpaceProps) => {
  const { name, number, whereuat, isReserved } = props;

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <VStack>
      <Image
        src='https://www.arts.gov/sites/default/files/styles/nea_media_large_16x9/public/CottageTomMarks.jpeg?h=52605a11&itok=0gO-wCVA'
        objectFit='cover'
        rounded='md'
        border='solid 2px'
        borderColor='cream.900'
      />
      <HStack justify='space-between' w='100%' align='start'>
        <VStack spacing={1} align='flex-start'>
          <Heading size='sm'>Test location</Heading>
          <Text>123</Text>
          <Text>Canada</Text>
        </VStack>
        <Button onClick={onOpen}>reserve</Button>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent bg='cream.100'>
            <ModalHeader>
              congrats 🙄 you've reserved <Text fontWeight='bold'>Test Location</Text>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Your reservation id is{' '}
              <Text fontWeight='bold' display='inline'>
                tree fiddy
              </Text>
            </ModalBody>

            <ModalFooter>
              <Button mr={3} onClick={onClose}>
                👍
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </HStack>
    </VStack>
  );
};

export const Spaces = () => {
  return (
    <>
      <Heading size='md' my={4}>
        Here are your spaces:
      </Heading>
      <SimpleGrid minChildWidth='200px' spacing={4}>
        <Space />
        <Space />
        <Space />
        <Space />
      </SimpleGrid>
    </>
  );
};
