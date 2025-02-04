import {
  PopoverTrigger, PopoverContent, PopoverBody,
  Modal, ModalContent, ModalCloseButton,
  useDisclosure,
  Button,
} from '@chakra-ui/react';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import Popover from 'ui/shared/chakra/Popover';

import IconSvg from './IconSvg';

interface Props {
  children: React.ReactNode;
}

const InfoButton = ({ children }: Props) => {
  const isMobile = useIsMobile();
  const { isOpen, onToggle, onClose } = useDisclosure();

  const triggerButton = (
    <Button
      size="sm"
      variant="outline"
      colorScheme="gray"
      onClick={ onToggle }
      isActive={ isOpen }
      aria-label="Show info"
      fontWeight={ 500 }
      lineHeight={ 6 }
      pl={ 1 }
      pr={ isMobile ? 1 : 2 }
      h="32px"
    >
      <IconSvg name="info" boxSize={ 6 } mr={ isMobile ? 0 : 1 }/>
      { !isMobile && <span>Info</span> }
    </Button>
  );

  if (isMobile) {
    return (
      <>
        { triggerButton }
        <Modal isOpen={ isOpen } onClose={ onClose } size="full">
          <ModalContent>
            <ModalCloseButton/>
            { children }
          </ModalContent>
        </Modal>
      </>
    );
  }

  return (
    <Popover isOpen={ isOpen } onClose={ onClose } placement="bottom-start" isLazy>
      <PopoverTrigger>
        { triggerButton }
      </PopoverTrigger>
      <PopoverContent w="500px">
        <PopoverBody px={ 6 } py={ 5 }>
          { children }
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default React.memo(InfoButton);
