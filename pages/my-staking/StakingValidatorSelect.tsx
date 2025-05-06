/* eslint-disable */

import { Box, Grid, Flex, Button,  Text } from '@chakra-ui/react';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    useDisclosure,
} from '@chakra-ui/react'
import React from 'react';
import StakingTabList from './StakingTabList';


const StakingValidatorSelect = () => {
    
    const { isOpen, onToggle, onClose } = useDisclosure();

    return (
        <Popover
            placement='bottom'
            closeOnBlur={false}
            matchWidth={true}
        >
            <PopoverTrigger>
                <Box 
                    width="100%" 
                    height="40px"
                    cursor={"pointer"}
                    border = { isOpen ? '1px solid red' : '1px solid gray' }
                    borderRadius="9999px" display="flex" 
                    alignItems="center" justifyContent="center">
                    <Text fontSize="14px" color="black" onClick={onToggle} userSelect={"none"}>
                        Manage Your Channels
                    </Text>
                </Box>
            </PopoverTrigger>
            <PopoverContent 
                color='white'
                width="100%"
                borderColor='blue.800'
                borderRadius="12px"
                border = '1px solid rgba(0, 46, 51, 0.10)'
                boxShadow={'0px 4px 16px 0px rgba(0, 0, 0, 0.10)'}
            >
                <PopoverHeader pt={0} fontWeight='bold' border='0' color='black'/>
                <PopoverBody px={0} py={0} >
                    <StakingTabList />
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
}

export default StakingValidatorSelect;