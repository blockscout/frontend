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
                    bg="blue.100" 
                    cursor={"pointer"}
                    border = { isOpen ? '1px solid red' : 'none' }
                    borderRadius="9999px" display="flex" 
                    alignItems="center" justifyContent="center">
                    <Text fontSize="14px" color="blue.800" onClick={onToggle} userSelect={"none"}>
                        Manage Your Channels
                    </Text>
                </Box>
            </PopoverTrigger>
            <PopoverContent color='white' width="100%"  borderColor='blue.800'>
                <PopoverHeader pt={4} fontWeight='bold' border='0'/>
                <PopoverBody>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                    eiusmod tempor incididunt ut labore et dolore.
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
}

export default StakingValidatorSelect;