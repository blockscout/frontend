/* eslint-disable */

import React from 'react';
import { Box, Flex, Button , Grid, Text } from '@chakra-ui/react';

const no_op = () => {};

type statusstring = "Active" | "Unbonding" | "Inactive" | "Jailed";

const StatusButton = ({ status, onClick }: { status: statusstring; onClick?: () => void }) => {

    const colorPlate = {
        "Active": {
            color: "#30D3BF",
            backgroundColor: "rgba(130, 245, 231, 0.20)"
        },
        "Unbonding": {
            color: "#F2B310",
            backgroundColor: "rgba(255, 226, 142, 0.20)"
        },
        "Inactive": {
            color: "rgba(0, 0, 0, 0.40)",
            backgroundColor: " linear-gradient(0deg, rgba(0, 85, 99, 0.08) 0%, rgba(0, 85, 99, 0.08) 100%), #FFF)"
        },
        "Jailed": {
            color: "#EE6969",
            backgroundColor: "rgba(238, 105, 105, 0.20)"
        },
    }

    const _c = colorPlate[ status || "Inactive"];
    
    return (
        <Button
            onClick={onClick}
            px = "8px"
            py = "4px"
            width={ 'auto' }
            height={ 'auto' }
            variant="surface"
            _hover={{ backgroundColor: _c.backgroundColor, opacity: 0.95 }}
            color={_c.color}
            borderRadius={9999}
            background={_c.backgroundColor}
        >
            <Text 
                fontSize="12px"
                fontWeight="400"
                color={_c.color}
                lineHeight="normal"
                fontFamily="HarmonyOS Sans"
            >{ status }</Text>
        </Button>
    );
}

export default StatusButton;