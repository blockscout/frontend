/* eslint-disable */
import {
  chakra,
  Modal,
  ModalContent,
  ModalCloseButton,
  ModalOverlay,
  ModalHeader,
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
            <ModalContent height={'auto'} maxWidth={"600px"} px={'24px'} py={'24px'}>
                <ModalHeader mb={2}>
                    Stake
                </ModalHeader>
                <ModalCloseButton zIndex={2000} />
                { children }
            </ModalContent>
        </Modal>
    )
};

export default StakingModal;