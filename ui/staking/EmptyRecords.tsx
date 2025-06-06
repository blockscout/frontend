/* eslint-disable */
import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';


const EmptyRecords = ({
    text = 'No records',
}) => {

    return (
        <Flex
            flexDirection="column"
            justifyContent="flex-start"
            alignItems="center"
            width="100%"
            userSelect="none"
            height = "auto"
            paddingTop="80px"
            paddingBottom="80px"
        >
            <div style={{
                    paddingTop: '6.6px',
                    paddingBottom: '6.4px',
                    userSelect: 'none',
                }}
            >
                <img 
                    draggable="false"
                    width="55.8px"
                    height="47px"
                    src="/static/NotDate.png"/>        
            </div>

            <div style={{
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center',
                width: 'auto',
                height: 'auto',
                marginTop: '16px',
            }}>
                <span
                    style={{
                        color: 'rgba(0, 0, 0, 0.40)',
                        textAlign: 'center',
                        fontFamily: 'HarmonyOS Sans',
                        fontSize: '12px',
                        fontStyle: 'normal',
                        fontWeight: '400',
                        lineHeight: '16px',
                    }}
                >
                    {text}
                </span>
            </div>
        </Flex>
    )
}

export default EmptyRecords;