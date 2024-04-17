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
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import { FaRegEye } from 'react-icons/fa6';

import type { Transaction } from 'types/api/transaction';

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

const TxAdditionalInfo = ({ hash, tx, isMobile }: Props) => {
  const { isOpen, onClose } = useDisclosure();
  const borderColor = useColorModeValue('rgba(233, 236, 239, 1)', 'blue.1100');

  const content = hash !== undefined ? <TxAdditionalInfoContainer hash={ hash }/> : <TxAdditionalInfoContent tx={ tx }/>;

  if (isMobile) {
    return (
      <>
        { /* <AdditionalInfoButton onClick={ onOpen } isLoading={ isLoading } className={ className }/> */ }

        { /* <AdditionalInfoButton onClick={ onOpen } isLoading={ isLoading } className={ className }/> */ }

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
      { () => (
        <>
          <PopoverTrigger>
            <Flex
              border="1px solid"
              borderColor={ borderColor }
              justify="center"
              px={ 1 }
              py={ 2 }
              borderRadius="6px"
              alignItems="center"
            >
              <FaRegEye fontSize={ 8 }/>
            </Flex>
          </PopoverTrigger>
          <PopoverContent border="1px solid" borderColor="divider">
            <PopoverBody fontWeight={ 400 } fontSize="sm">
              { content }
            </PopoverBody>
          </PopoverContent>
        </>
      ) }
    </Popover>
  );
};

export default React.memo(chakra(TxAdditionalInfo));
