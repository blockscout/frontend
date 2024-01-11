import {
  Alert,
  Box,
  Button,
  Flex,
  Heading,
  Modal,
  ModalCloseButton,
  ModalContent,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  StackDivider,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import React from 'react';

import type { SmartContractExternalLibrary } from 'types/api/contract';

import useIsMobile from 'lib/hooks/useIsMobile';
import { apos } from 'lib/html-entities';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  className?: string;
  data: Array<SmartContractExternalLibrary>;
}

const Item = (data: SmartContractExternalLibrary) => {
  return (
    <Flex flexDir="column" py={ 2 } w="100%" rowGap={ 1 }>
      <Box>{ data.name }</Box>
      <AddressEntity
        address={{ hash: data.address_hash, is_contract: true, implementation_name: null }}
        query={{ tab: 'contract' }}
        fontSize="sm"
        fontWeight="500"
        target="_blank"
      />
    </Flex>
  );
};

const ContractExternalLibraries = ({ className, data }: Props) => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const isMobile = useIsMobile();

  if (data.length === 0) {
    return null;
  }

  const button = (
    <Button
      className={ className }
      size="sm"
      variant="outline"
      colorScheme="gray"
      onClick={ onToggle }
      fontWeight={ 600 }
      px={ 2 }
      aria-label="View external libraries"
    >
      <span>{ data.length } { data.length > 1 ? 'Libraries' : 'Library' } </span>
      <IconSvg name="status/warning" boxSize={ 5 } color="orange.400" ml="2px"/>
      <IconSvg name="arrows/east-mini" transform={ isOpen ? 'rotate(90deg)' : 'rotate(-90deg)' } transitionDuration="faster" boxSize={ 5 } ml={ 2 }/>
    </Button>
  );

  const content = (
    <>
      <Heading size="sm">External libraries ({ data.length })</Heading>
      <Alert status="warning" mt={ 4 }>
        The linked library{ apos }s source code may not be the real one.
        Check the source code at the library address (if any) if you want to be sure in case if there is any library linked
      </Alert>
      <VStack
        divider={ <StackDivider borderColor="divider"/> }
        spacing={ 2 }
        mt={ 4 }
      >
        { data.map((item) => <Item key={ item.address_hash } { ...item }/>) }
      </VStack>
    </>
  );

  if (isMobile) {
    return (
      <>
        { button }
        <Modal isOpen={ isOpen } onClose={ onClose } size="full">
          <ModalContent paddingTop={ 4 }>
            <ModalCloseButton/>
            { content }
          </ModalContent>
        </Modal>
      </>
    );
  }

  return (
    <Popover isOpen={ isOpen } onClose={ onClose } placement="bottom-start" isLazy>
      <PopoverTrigger>
        { button }
      </PopoverTrigger>
      <PopoverContent w="400px">
        <PopoverBody >
          { content }
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default ContractExternalLibraries;
