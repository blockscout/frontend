import {
  chakra,
  Modal,
  ModalContent,
  ModalCloseButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';

import type { Transaction } from 'types/api/transaction';

import AdditionalInfoButton from 'ui/shared/AdditionalInfoButton';

import TxAdditionalInfoContainer from './TxAdditionalInfoContainer';
import TxAdditionalInfoContent from './TxAdditionalInfoContent';

type Props =
  ({
    hash: string;
    tx?: undefined;
  } |
  {
    hash?: undefined;
    tx: Transaction;
  }) & {
    isMobile?: boolean;
    isLoading?: boolean;
    className?: string;
  }

const TxAdditionalInfo = ({ hash, tx, isMobile, isLoading, className }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const content = hash !== undefined ? <TxAdditionalInfoContainer hash={ hash }/> : <TxAdditionalInfoContent tx={ tx }/>;

  if (isMobile) {
    return (
      <>
        <AdditionalInfoButton onClick={ onOpen } isLoading={ isLoading } className={ className }/>
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
    <Popover placement="right-start" openDelay={ 300 } isLazy>
      { ({ isOpen }) => (
        <>
          <PopoverTrigger>
            <AdditionalInfoButton isOpen={ isOpen } isLoading={ isLoading } className={ className }/>
          </PopoverTrigger>
          <PopoverContent border="1px solid" borderColor="divider">
            <PopoverBody>
              { content }
            </PopoverBody>
          </PopoverContent>
        </>
      ) }
    </Popover>
  );
};

export default React.memo(chakra(TxAdditionalInfo));
