/* eslint-disable */

import React from 'react';
import { Box, Flex, Button , Grid, Text } from '@chakra-ui/react';
import spinner from './spinner.module.css'

const no_op = () => {};

const spinner_icon = (
    <img 
        src="/static/spinner.svg" 
        alt="Loading..." 
        style={{ width: '20px', height: '20px' }}
    />
);

const PlainButton = ({
    text, 
    onClick, 
    disabled = false,
    bgColor = '#FF57B7', 
    disabledBgColor = '#FFCBEC',
    textColor = 'white',
    disabledTextColor = 'white',
    width = '72px',
    height = 'auto',
    isSubmitting = false,
}: {
    text: string,
    onClick?: () => void,
    disabled?: boolean
    bgColor?: string
    disabledBgColor?: string
    textColor?: string
    disabledTextColor?: string
    width?: string
    height?: string
    isSubmitting?: boolean
}) => {
    return (
        <Button
            onClick={ onClick || no_op }
            py = "4px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            _hover={{ backgroundColor: disabledBgColor , opacity: 0.9 }}
            width={ width }
            height={ height }
            variant='solid'
            padding = { '4px 20px' }
            backgroundColor = { disabled ? disabledBgColor : bgColor }
            cursor={ disabled ? 'not-allowed' : 'pointer' }
            borderRadius={9999}
        >
            { isSubmitting ? (
                <Box className={ spinner.spinnerloading }
                    width="20px" height="20px">
                    { spinner_icon }
                </Box>
            ) : (
                <Text 
                    fontSize="14px"
                    fontWeight="500"
                    lineHeight="normal"
                    fontStyle="normal"
                    color = { disabled ? disabledTextColor : textColor }
                    fontFamily="HarmonyOS Sans"
                >{ text }</Text>
            )}
        </Button>
    );
}

const ModalFooterBtnGroup = ({
    onCancel,
    onConfirm,
    cancelText = 'Cancel',
    confirmText = 'Confirm',
    isSubmitting = false,
    isDisabled = false,
}: {
    onCancel?: () => void,
    onConfirm?: () => void,
    cancelText?: string,
    confirmText?: string,
    isSubmitting?: boolean,
    isDisabled?: boolean,
}) => {
    return (
        <Flex
            width="100%"
            height="auto"
            padding = { '0 20px' }
            alignItems="center"
            justifyContent="flex-end"
            gap="12px"
        >
            <PlainButton 
                text={ cancelText }
                onClick={ onCancel }
                disabled={ isDisabled || isSubmitting }
                width="100px"
                height="40px"
                bgColor="rgba(0, 0, 0, 0.10)"
                disabledBgColor="rgba(0, 0, 0, 0.06)"
                textColor="rgba(0, 0, 0, 0.60)"
                disabledTextColor="rgba(0, 0, 0, 0.45)"
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