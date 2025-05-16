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
    validatorName
}: {
    validatorName: string;
}) => {

    return (
        <Flex
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            width="auto"
            gap="8px"
        >
            <Avatar
                name="Validator Name"
                src="https://bit.ly/broken-link"
                size='2xs'
                borderRadius="full"
                marginRight="8px"
            />
            <Text fontSize="16px" fontWeight="bold"> { getShortAddress(validatorName) } </Text>
        </Flex>
    )
}

export default ValidatorInfo;