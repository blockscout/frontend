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
import StakingTabList from 'ui/staking/StakingTabList';
import ValidatorItemBar from 'ui/staking/ValidatorItemBar';

const StakingValidatorSelect = () => {
    
    const { isOpen, onToggle, onClose } = useDisclosure();

    return (
        <Popover
            placement='bottom'
            closeOnBlur={false}
            matchWidth={true}
        >
            <PopoverTrigger>
                <Box width="100%">
                    <ValidatorItemBar
                        showArrow={true}
                        liveApr={0}
                        isFocused={ isOpen }
                        validatorName={'Select Validator'}
                        validatorAvatar={null}
                        onClick={onToggle}
                    />
                </Box>
            </PopoverTrigger>
            <PopoverContent 
                color='white'
                width="inherit"
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