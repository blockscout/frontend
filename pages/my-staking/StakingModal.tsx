/* eslint-disable */
import {
  chakra,
  Modal,
  ModalContent,
  ModalCloseButton,
  ModalOverlay,   
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';

const StakingModal = ({ 
    isOpen,
    onOpen,
    onClose,
    children,
}: {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    children: React.ReactNode | React.ReactNode[] | string;
}) => {

    return (
        <Modal isOpen={ isOpen } onClose={ onClose }>
                <ModalOverlay
                    bg='blackAlpha.300'
                />
            <ModalContent paddingTop={ 4 }>
            <ModalCloseButton/>
            { children }
            </ModalContent>
        </Modal>
    )
};

export default StakingModal;