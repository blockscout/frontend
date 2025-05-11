/* eslint-disable */
import { Flex, Text, Box } from '@chakra-ui/react';
import { validator } from 'mocks/address/address';
import ValidatorInfo from 'ui/staking/ValidatorInfo';


const expandIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
        <path d="M4 6.5L8 10.5L12 6.5" stroke="black" strokeOpacity="0.2" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

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
                <ValidatorInfo />
                <Flex
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                    width="auto"
                    gap="8px"
                >
                    <Text
                        fontSize="12px"
                        fontWeight="500"
                        textAlign={"left"}
                        color="rgba(0, 0, 0, 0.60)"
                        fontStyle="normal"
                        lineHeight="140%"
                        userSelect="none"
                        as ="span"
                        fontFamily="HarmonyOS Sans"
                    >
                        { liveApr }%
                    </Text>
                    {
                        showArrow && (
                            <Box
                                width="16px"
                                height="16px"
                                borderRadius="9999px"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                transform={ isFocused ? 'rotate(0deg)' : 'rotate(-180deg)' }
                                transition="transform 0.3s ease-in-out"
                            >
                                { expandIcon }
                            </Box>
                        )
                    }
                </Flex>
            </Flex>
        </Box>
    );
}

export default ValidatorItemBar;