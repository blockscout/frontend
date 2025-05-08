/* eslint-disable */

import React from 'react';
import { Box, Flex, Button , Grid, Text } from '@chakra-ui/react';
import { Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';

const no_op = () => {};


const ChevronDownIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="12" viewBox="0 0 13 12" fill="none">
            <path d="M3.5 4.5L6.5 7.5L9.5 4.5" stroke="black" strokeOpacity="0.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
}

const PlainButton = ({text, onClick, disabled = false} : {
    text: string,
    onClick?: () => void,
    disabled?: boolean
}) => {
    return (
        <Button
            onClick={ onClick || no_op }
            py = "4px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            _hover={{ backgroundColor: "#FFCBEC" , opacity: 0.9 }}
            width={ '72px' }
            height={ 'auto' }
            variant='solid'
            padding = { '4px 20px' }
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


const ActionButtonGroup = ({
    showClaim = false,
    showStake = false,
    disableClaim = false,
    disableStake = false,
    onClaim = no_op,
    onStake = no_op,
}: {
    showClaim?: boolean,
    showStake?: boolean,
    disableClaim?: boolean,
    disableStake?: boolean,
    onClaim?: () => void,
    onStake?: () => void,
}) => {

    return (
        <Flex
            width="100%"
            height="auto"
            padding = { '0 20px' }
            alignItems="center"
            justifyContent="space-between"
        >
            <Flex
                width="100%"
                height="auto"
                alignItems="center"
                justifyContent="space-between"
            >
                { showClaim && 
                    <PlainButton
                        text={ 'Claim' }
                        onClick={ onClaim }
                        disabled={ disableClaim }
                    />
                }
                { showStake && 
                    <PlainButton
                        text={ 'Stake' }
                        onClick={ onStake }
                        disabled={ disableStake }
                    />
                }
                <Menu placement="bottom-end">
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                        Actions
                    </MenuButton>
                    <MenuList>
                        <MenuItem>Download</MenuItem>
                        <MenuItem>Create a Copy</MenuItem>
                    </MenuList>
                </Menu>
            </Flex>
        </Flex>
    );
}


export default ActionButtonGroup;