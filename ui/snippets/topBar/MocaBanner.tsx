/* eslint-disable */
'use client';

import React ,  { useEffect, useLayoutEffect, useState } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';

interface BannerProps {
  storageKey?: string;
}

const boxStyle = {
    // background: var(--decorative-pink-2, #FFA3F4);  
    background: '#FFA3F4',
}

const btnStyle = {
    color: '#FFF',
    fontFamily: 'Outfit',
    fontSize: '0.875rem',
    fontStyle: 'normal',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '9999px',
    lineHeight: 'normal',
    backgroundColor: '#000',
    minWidth: '4.562rem',
    height: '1.625rem',
    padding: '0  0.75rem',
}
    


const textStyle = {
    color: '#002536',
    fontFamily: 'Outfit',
    fontSize: '0.875rem',
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: 'normal',
};

const MocaBanner: React.FC<BannerProps> = ({ storageKey = 'bannerDismissed' }) => {

    const [isMounted, setIsMounted] = useState(false);
    const [visible, setVisible] = useState(false);

    useLayoutEffect(() => {
        setIsMounted(true);
        const dismissed = localStorage.getItem(storageKey);
        if (!dismissed) {
            setVisible(true);
        }
    }, [storageKey]);

    const handleDismiss = () => {
        localStorage.setItem(storageKey, 'true');
        setVisible(false);
    };

    useEffect(() => {
        console.log('MocaBanner mounted', isMounted, visible);
    }, [isMounted, visible]);


    if (!isMounted || !visible) {
        // SSR期间什么都不渲染，避免水合不一致
        return null;
    }


    return ( 
        <Box 
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="40px"
            width="100%"
            style={boxStyle}
            paddingX={{ base: '0.5rem', md: '2rem' }}
        >
            <Flex 
                width="100%"
                maxWidth="1200px"
                justifyContent="center"
                alignItems="center"
                gap="1rem"
            >
                <Text 
                    textAlign="center"
                    style={textStyle}
                >
                    This is a beta version for developer testing. All data is temporary and for testing only
                </Text>

                <button style={btnStyle}
                    onClick={() => {
                        handleDismiss();
                    }}
                >
                    Dismiss
                </button>
            </Flex>
        </Box>
    )
}

export default MocaBanner;