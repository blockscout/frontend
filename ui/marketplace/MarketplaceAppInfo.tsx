import {
  PopoverTrigger, PopoverContent, PopoverBody,
  Modal, ModalContent, ModalCloseButton, useDisclosure,
} from '@chakra-ui/react';
import React from 'react';

import type { MarketplaceAppOverview } from 'types/client/marketplace';

import useIsMobile from 'lib/hooks/useIsMobile';
import Popover from 'ui/shared/chakra/Popover';

import Content from './MarketplaceAppInfo/Content';
import TriggerButton from './MarketplaceAppInfo/TriggerButton';

interface Props {
  data: MarketplaceAppOverview | undefined;
}

const MarketplaceAppInfo = ({ data }: Props) => {
  const isMobile = useIsMobile();
  const { isOpen, onToggle, onClose } = useDisclosure();

  if (isMobile) {
    return (
      <>
        <TriggerButton onClick={ onToggle } onlyIcon/>
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
        <TriggerButton onClick={ onToggle } isActive={ isOpen }/>
      </PopoverTrigger>
      <PopoverContent w="500px">
        <PopoverBody px={ 6 } py={ 5 }>
          <Content data={ data }/>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default React.memo(MarketplaceAppInfo);
