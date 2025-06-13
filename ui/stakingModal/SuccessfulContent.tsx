/* eslint-disable */

import { Button, Flex, Grid, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';

const no_op = () => {};

const PlainButton = ({text,  onClick,  disabled = false , width = '142px'}: {
    text: string,
    onClick?: () => void,
    disabled?: boolean
    width?: string,
}) => {


    return (
        <Button
            onClick={ () => {
                if (disabled) {
                    return;
                }
                onClick && onClick();
            }}
            py = "4px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            _hover={{ backgroundColor: "#FFCBEC" , opacity: 0.9 }}
            width={ width }
            height={ '40px' }
            variant='solid'
            flexShrink={ 0 }
            padding = { '0 20px' }
            backgroundColor = { disabled ? '#FFCBEC' : '#FF57B7' }
            cursor={ disabled ? 'not-allowed' : 'pointer' }
            borderRadius={9999}
        >
            <Text 
                fontSize="14px"
                fontWeight="500"
                lineHeight="normal"
                color = {'white' }
                fontFamily="HarmonyOS Sans"
            >{ text }</Text>
        </Button>
    );
}


const CancelBtn = ({text,  onClick,  disabled = false , width = '142px'}: {
    text: string,
    onClick?: () => void,
    disabled?: boolean
    width?: string,
}) => {
    return (
        <Button
            onClick={ () => {
                if (disabled) {
                    return;
                }
                onClick && onClick();
            }}
            py = "4px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            _hover={{ backgroundColor: "rgba(0, 0, 0, 0.10)" , opacity: 0.9 }}
            width={ width }
            height={ '40px' }
            variant='solid'
            flexShrink={ 0 }
            padding = { '0 20px' }
            backgroundColor = { disabled ? 'rgba(0, 0, 0, 0.07)' : 'rgba(0, 0, 0, 0.10)' }
            cursor={ disabled ? 'not-allowed' : 'pointer' }
            borderRadius={9999}
        >
            <Text 
                fontSize="14px"
                fontWeight="500"
                lineHeight="normal"
                color = {'rgba(0, 0, 0, 0.60)' }
                fontFamily="HarmonyOS Sans"
            >{ text }</Text>
        </Button>
    );
}



const SuccessfulContent = ({
    text,
    txhash,
    onClose = no_op,
}: {
    text: string;
    txhash: string;
    onClose?: () => void;
}) => {

    const router = useRouter();

    const handleViewTransaction = () => {
        if (txhash) {
            router.push({ pathname: '/tx/[hash]', query: { hash: txhash } });
        }
    };

    return (
        <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            width="100%" height="auto"
        >
            <img 
                src="/static/check-badge.svg"
                draggable="false"
                width="100px"
                height="100px"
            />
            <h2 style={{
                color: '#000',
                fontFamily: 'HarmonyOS Sans',
                fontSize: '20px',
                fontStyle: 'normal',
                fontWeight: 700,
                lineHeight: '32px',
            }}> { text } </h2>
            <Flex
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                width="auto"
                height="auto"
                gap="12px"
                marginTop={"40px"}
                paddingBottom={"48px"}
            >
                <CancelBtn
                    text="View Transaction"
                    onClick={ () => handleViewTransaction() }
                    width="142px"
                />
                <PlainButton
                    text="Got it"
                    onClick={ onClose }
                    width="142px"
                />
            </Flex>
        </Flex>
    );
}

export default SuccessfulContent;
