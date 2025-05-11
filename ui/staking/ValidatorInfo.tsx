/* eslint-disable */

import { Box, Avatar, Flex, Button,  Text } from '@chakra-ui/react';

const ValidatorInfo = () => {

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
            <Text fontSize="16px" fontWeight="bold">Validator Name</Text>
        </Flex>
    )
}

export default ValidatorInfo;