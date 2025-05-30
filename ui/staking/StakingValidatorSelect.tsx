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



const getShortAddress = (address: string) => {
    if( !address) {
        return '';
    }
    if ( address.length > 10) {
        return `${address.slice(0, 12)}...${address.slice(-4)}`;
    }
    return address;
}


const Selector = ({
    myValidatorsList,
    allValidatorsList,
    selectedValidator,
    setSelectedValidator,
    isOpen,
    onToggle,
    onClose,
    isMyValidatorLoading = false,
    isAllValidatorLoading = false,
}: {
    myValidatorsList: any[];
    allValidatorsList: any[];
    selectedValidator: any;
    setSelectedValidator: (validator: any) => void;
    isOpen: boolean;
    onToggle: () => void;
    onClose: () => void;
    isMyValidatorLoading?: boolean;
    isAllValidatorLoading?: boolean;
}) => {

    return (
        <Popover
            placement='bottom'
            closeOnBlur={ false }
            matchWidth={true}
            isOpen={isOpen}
        >
            <PopoverTrigger>
                <Box width="100%">
                    <ValidatorItemBar
                        showArrow={true}
                        liveApr={ (Number(selectedValidator.liveApr || 0) * 100).toFixed(2) + '%' }
                        isFocused={ isOpen }
                        validatorItem={selectedValidator}
                        validatorName={ getShortAddress(selectedValidator.validatorAddress) }
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
                overflowY="hidden"
                border = '1px solid rgba(0, 46, 51, 0.10)'
                boxShadow={'0px 4px 16px 0px rgba(0, 0, 0, 0.10)'}
            >
                <PopoverHeader pt={0} fontWeight='bold' border='0' color='black'/>
                <PopoverBody px={0} py={0} borderRadius={"12px"}>
                    <StakingTabList 
                        myValidatorsList={myValidatorsList}
                        allValidatorsList={allValidatorsList}
                        onClose ={ onClose }
                        isMyValidatorLoading={isMyValidatorLoading}
                        isAllValidatorLoading={isAllValidatorLoading}
                        setSelectedValidator={ (validator: any) => {
                            setSelectedValidator(validator);
                        }}
                    />
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
}

const StakingValidatorSelect = ({
    myValidatorsList,
    allValidatorsList,
    selectedValidator,
    setSelectedValidator,
    setCurrentAddress,
    isOpen,
    onToggle,
    onClose,
    setApr,
    isMyValidatorLoading,
    isAllValidatorLoading,
}: {
    myValidatorsList: any[];
    allValidatorsList: any[];
    selectedValidator: any;
    setCurrentAddress: (address: string) => void;
    setSelectedValidator: (validator: any) => void;
    isOpen: boolean;
    onToggle: () => void;
    onClose: () => void;
    setApr: (apr: number | string) => void;
    isMyValidatorLoading?: boolean;
    isAllValidatorLoading?: boolean;
}) => {


    return (
        <Flex width="100%" flexDirection="column" alignItems="center" userSelect="none">
            <Selector
                myValidatorsList={myValidatorsList}
                allValidatorsList={allValidatorsList}
                selectedValidator={selectedValidator}
                isMyValidatorLoading = { isMyValidatorLoading }
                isAllValidatorLoading = { isAllValidatorLoading }
                setSelectedValidator={(validator: any) => {
                    setSelectedValidator(validator);
                    setApr(validator?.liveApr);
                    setCurrentAddress(validator?.validatorAddress);
                }}
                isOpen={isOpen}
                onToggle={onToggle}
                onClose={ onClose}
            />
        </Flex>
    );
}

export default StakingValidatorSelect;