/* eslint-disable */
import { Flex, Text, Box } from '@chakra-ui/react';
import { validator } from 'mocks/address/address';


const ValidatorItemBar = ({
    showArrow = false,
    liveApr = 0,
    isFocused = false,
    validatorName = '',
    validatorAvatar = null,
    onClick = () => {},
}: {
    showArrow?: boolean;
    liveApr?: number;
    isFocused?: boolean;
    validatorName?: string;
    validatorAvatar?: string | null;
    onClick?: () => void;
}) => {
    return (
        <Box 
            width="100%" 
            height="40px"
            cursor={"pointer"}
            position="relative"
            border = { isFocused ? '1px solid #FF57B7' : '1px solid rgba(0, 46, 51, 0.10)' }
            borderRadius="9999px" display="flex" 
            alignItems="center" justifyContent="center"
            onClick={onClick}
        >
            <Flex
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                width="100%"
                gap="8px"
                padding="16px"
            >
                <Text
                    fontSize="14px"
                    fontWeight="500"
                    width="auto"
                    textAlign={"left"}
                    color="#000"
                    fontStyle="normal"
                    lineHeight="140%"
                    fontFamily="HarmonyOS Sans"
                >
                    { validatorName }
                </Text>
                <Text
                    fontSize="12px"
                    fontWeight="500"
                    textAlign={"left"}
                    color="rgba(0, 0, 0, 0.60)"
                    fontStyle="normal"
                    lineHeight="140%"
                    fontFamily="HarmonyOS Sans"
                >
                    { liveApr }%
                </Text>
            </Flex>
        </Box>
    );
}

export default ValidatorItemBar;