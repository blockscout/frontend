import { useDisclosure, Modal, ModalContent, ModalCloseButton } from '@chakra-ui/react';
import React from 'react';

import type { AddressTokenBalance } from 'types/api/address';

import TokenSelectButton from './TokenSelectButton';
import TokenSelectMenu from './TokenSelectMenu';
import useTokenSelect from './useTokenSelect';

interface Props {
  data: Array<AddressTokenBalance>;
  isLoading: boolean;
}

const TokenSelectMobile = ({ data, isLoading }: Props) => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const result = useTokenSelect(data);

  return (
    <>
      <TokenSelectButton isOpen={ isOpen } onClick={ onToggle } data={ result.modifiedData } isLoading={ isLoading }/>
      <Modal isOpen={ isOpen } onClose={ onClose } size="full">
        <ModalContent>
          <ModalCloseButton/>
          <TokenSelectMenu { ...result }/>
        </ModalContent>
      </Modal>
    </>
  );
};

export default React.memo(TokenSelectMobile);
