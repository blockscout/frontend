/* eslint-disable */

import React from 'react';
import { Button, Text } from '@chakra-ui/react';


const PlainButton = ({ text, onClick, disabled = false} : {
    text: string,
    onClick?: () => void,
    disabled?: boolean
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
            width={ '72px' }
            height={ '22px' }
            variant='solid'
            padding = { '4px 20px' }
            backgroundColor = { disabled ? '#FFCBEC' : '#FF57B7' }
            cursor={ disabled ? 'not-allowed' : 'pointer' }
            borderRadius={9999}
        >
            <Text 
                fontSize="12px"
                fontWeight="500"
                lineHeight="normal"
                fontStyle="normal"
                color = {'white' }
                fontFamily="HarmonyOS Sans"
            >{ text }</Text>
        </Button>
    );
}

export default PlainButton;