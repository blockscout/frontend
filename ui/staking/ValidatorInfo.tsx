/* eslint-disable */

import { Box, Avatar, Flex, Button,  Text } from '@chakra-ui/react';



const getShortAddress = (address: string) => {
    if( !address) {
        return '';
    }
    if ( address.length > 10) {
        return `${address.slice(0, 12)}...${address.slice(-4)}`;
    }
    return address;
}



const ValidatorInfo = ({
    validatorName,
    record = {}
}: {
    validatorName: string;
    record?: any;
}) => {

    return (
        <Flex
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            width="auto"
        >
            <img
                src="/static/moca-brand.svg"
                style={{ borderRadius: '50%', marginRight: "4px" , flexShrink: 0}}
                draggable={false}
                width="20px"
                height="20px"
            />
            <Text 
                fontSize="14px"
                fontWeight="500"
                textAlign={"left"}
                color="rgba(0, 0, 0)"
                fontStyle="normal"
                fontFamily="HarmonyOS Sans"
                lineHeight="normal"
                textTransform="capitalize"
                userSelect="none"
                as ="span"
            > { record.validatorName } </Text>
        </Flex>
    )
}

export default ValidatorInfo;