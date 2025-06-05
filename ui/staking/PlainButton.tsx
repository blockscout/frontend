/* eslint-disable */
"use client";
import React from 'react';
import dynamic from 'next/dynamic';
import { Box, Flex, Button , Grid, Text } from '@chakra-ui/react';
import spinner from './spinner.module.css'

const spinner_icon = (
    <img 
        src="/static/spinner.svg" 
        alt="Loading..." 
        style={{ width: '20px', height: '20px' }}
    />
);


const no_op = () => {};

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
    fontSize = '14px',
    isSubmitting = false,
}: {
    text: string,
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void,
    disabled?: boolean
    bgColor?: string
    disabledBgColor?: string
    textColor?: string
    disabledTextColor?: string
    width?: string
    height?: string
    fontSize?: string
    isSubmitting?: boolean
}) => {
    return (
        <Button
            onClick={ (e) => {
                if (disabled) {
                    return;
                }
                onClick && onClick(e);
            }}
            py = "4px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            _hover={{ opacity: 0.7 }}
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
                    fontSize={ fontSize }
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

export default PlainButton;