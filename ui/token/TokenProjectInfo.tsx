import {
  Popover, PopoverTrigger, PopoverContent, PopoverBody,
  Modal, ModalContent, ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';

import type { TokenVerifiedInfo } from 'types/api/token';

import useIsMobile from 'lib/hooks/useIsMobile';

import Content, { hasContent } from './TokenProjectInfo/Content';
import TriggerButton from './TokenProjectInfo/TriggerButton';

interface Props {
  data: TokenVerifiedInfo;
}

const TokenProjectInfo = ({ data }: Props) => {
  const isMobile = useIsMobile();
  const { isOpen, onToggle, onClose } = useDisclosure();

  if (!hasContent(data)) {
    return null;
  }

  if (isMobile) {
    return (
      <>
        <TriggerButton isOpen={ isOpen } onClick={ onToggle }/>
        <Modal isOpen={ isOpen } onClose={ onClose } size="full">
          <ModalContent>
            <ModalCloseButton/>
            <Content data={ data }/>
          </ModalContent>
        </Modal>
      </>
    );
  }

  return (
    <Popover isOpen={ isOpen } onClose={ onClose } placement="bottom-start" isLazy>
      <PopoverTrigger>
        <TriggerButton isOpen={ isOpen } onClick={ onToggle }/>
      </PopoverTrigger>
      <PopoverContent w="500px">
        <PopoverBody px={ 6 } py={ 5 }>
          <Content data={ data }/>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default React.memo(TokenProjectInfo);
