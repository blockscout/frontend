/* eslint-disable */
import {
  chakra,
  Modal,
  ModalContent,
  ModalCloseButton,
  ModalOverlay,
  ModalHeader,
  Text,
} from '@chakra-ui/react';
import React from 'react';

const StakingModal = ({ 
    isOpen,
    onOpen,
    onClose,
    children,
    title,
    isSuccess,
    extraDescription = null
}: {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    children: React.ReactNode | React.ReactNode[] | string;
    title: string;
    isSuccess: boolean;
    extraDescription?: string | null;
}) => {

    return (
        <Modal isOpen={ isOpen } onClose={ onClose } closeOnOverlayClick={false} isCentered>
            <ModalOverlay bg='blackAlpha.300' />
            <ModalContent height={'auto'} maxWidth={"600px"} px={'24px'} py={'24px'}>
                <ModalHeader mb={"24px"}>
                    {
                        isSuccess ? null : (
                            <>
                                <Text
                                    fontSize="20px"
                                    fontWeight="700"
                                    lineHeight="32px"
                                    color ="#000"
                                    fontFamily="HarmonyOS Sans"
                                >
                                    { title }
                                </Text>
                                {
                                    extraDescription && (
                                        <Text
                                            fontSize="12px"
                                            userSelect="none"
                                            fontWeight="500"
                                            lineHeight="140%"
                                            color ="rgba(0, 0, 0, 0.60)"
                                            fontFamily="HarmonyOS Sans"
                                            mt='12px'
                                        >
                                            { extraDescription }
                                        </Text>
                                    )
                                }

                            </>

                        )
                    }

                </ModalHeader>
                <ModalCloseButton zIndex={2000} width={'20px'} height={'20px'} top={'30px'} right={'24px'} />
                { children }
            </ModalContent>
        </Modal>
    )
};

export default StakingModal;