/* eslint-disable */

import React from 'react';
import { Box, Flex, Button , Grid, Text } from '@chakra-ui/react';
import PlainButton from './PlainButton';

const ModalFooterBtnGroup = ({
    onCancel,
    onConfirm,
    cancelText = 'Cancel',
    confirmText = 'Confirm',
    isSubmitting = false,
    isDisabled = false,
}: {
    onCancel?: () => void,
    onConfirm?: (e : React.MouseEvent<HTMLButtonElement>) => void,
    cancelText?: string,
    confirmText?: string,
    isSubmitting?: boolean,
    isDisabled?: boolean,
}) => {
    return (
        <Flex
            width="100%"
            height="auto"
            padding = { '0' }
            alignItems="center"
            justifyContent="flex-end"
            gap="12px"
        >
            <PlainButton 
                text={ cancelText }
                onClick={ onCancel }
                disabled={ false }
                width="100px"
                height="40px"
                bgColor="rgba(0, 0, 0, 0.10)"
                disabledBgColor="rgba(0, 0, 0, 0.07)"
                textColor="rgba(0, 0, 0, 0.60);"
                disabledTextColor="rgba(0, 0, 0, 0.60);"
            />
            <PlainButton 
                text={ confirmText }
                onClick={ onConfirm }
                disabled={ isDisabled || isSubmitting }
                isSubmitting={ isSubmitting }
                width="100px"
                height="40px"
            />
        </Flex>
    );
}

export default ModalFooterBtnGroup;