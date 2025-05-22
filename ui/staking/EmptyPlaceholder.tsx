/* eslint-disable */
"use client";

import { useAppKit, createAppKit } from '@reown/appkit/react';
import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { Button } from '@chakra-ui/react'


const no_op = () => {};

const PlainButton = ({text,  onClick,  disabled = false , width = '72px'}: {
    text: string,
    onClick?: () => void,
    disabled?: boolean
    width?: string,
}) => {



    return (
        <Button
            onClick={ onClick || no_op }
            py = "4px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            _hover={{ backgroundColor: "#FFCBEC" , opacity: 0.9 }}
            width={ width }
            minWidth={ '100px' }
            height={ '32px' }
            variant='solid'
            flexShrink={ 0 }
            padding = { '0 16px' }
            backgroundColor = { disabled ? '#FFCBEC' : '#FF57B7' }
            cursor={ disabled ? 'not-allowed' : 'pointer' }
            borderRadius={9999}
        >
            <Text 
                fontSize="12px"
                fontWeight="400"
                lineHeight="normal"
                color = {'white' }
                fontFamily="HarmonyOS Sans"
            >{ text }</Text>
        </Button>
    );
}




const EmptyPlaceholder = ({
    tipsTextArray = [],
    showButton = false,
    buttonText = '',
    buttonOnClick = () => {},
}: {
    tipsTextArray?: string[];
    showButton?: boolean | string;
    buttonText?: string;
    buttonOnClick?: () => void;
}) => {


    const { open: openModal } = useAppKit();


    return (
            <Box
                width="100%"
                height="auto"
            >
                <Flex
                    flexDirection="column"
                    justifyContent="flex-start"
                    alignItems="center"
                    width="100%"
                    userSelect="none"
                >
                    <div  style={{
                            paddingTop: '11px',
                            paddingBottom: '10.68px',
                            userSelect: 'none',
                        }}
                    >
                        <img 
                            draggable="false"
                            width="93px"
                            height="78.3px"
                            src="/static/NotDate.png"/>        
                    </div>

                    <div style={{
                        display: 'flex', 
                        flexDirection: 'column',
                        justifyContent: 'center',
                        width: 'auto',
                        height: 'auto',
                        marginBottom: '16px',
                        marginTop: '16px',
                    }}>
                        
                        { tipsTextArray.map((text, index) => (
                            <span
                                style={{
                                    color: 'rgba(0, 0, 0, 0.40)',
                                    textAlign: 'center',
                                    fontFamily: 'HarmonyOS Sans',
                                    fontSize: '14px',
                                    fontStyle: 'normal',
                                    fontWeight: '400',
                                    lineHeight: '16px',
                                }}
                            >
                                {text}
                            </span>
                        ))}
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        width: 'auto',
                        height: 'auto',
                        alignItems: 'center',
                    }}>
                        { showButton === true  && 
                            <PlainButton
                                text={ buttonText }
                                onClick={ buttonOnClick }
                                width = 'auto'
                            />
                        }
                        {
                            showButton === "connect" &&
                                <PlainButton
                                    text={ "Connect Wallet" }
                                    onClick={ openModal }
                                    width = 'auto'
                                />
                        }   
                    </div>
                </Flex>
            </Box>
    );
}
export default EmptyPlaceholder;