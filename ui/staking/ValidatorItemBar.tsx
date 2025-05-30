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
    liveApr = "0",
    isFocused = false,
    validatorName = '',
    validatorItem = {},
    validatorAvatar = null,
    onClick = () => {},
}: {
    showArrow?: boolean;
    liveApr?: string | number;
    isFocused?: boolean;
    validatorName?: string;
    validatorItem?: any;
    validatorAvatar?: string | null;
    onClick?: () => void;
}) => {

    const _currentItem  = validatorItem;

    return (
        <Box 
            width="100%" 
            height="40px"
            cursor={showArrow ? 'pointer' : 'default'}
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
                padding="16px"
            >
                {
                    (!!validatorName) ? (
                        <ValidatorInfo  validatorName = {validatorName} record = {_currentItem}/>
                    ) : (
                        <Text
                            fontSize="14px"
                            fontWeight="400"
                            textAlign={"left"}
                            color="rgba(0, 0, 0, 0.30)"
                            fontStyle="normal"
                            lineHeight="140%"
                            userSelect="none"
                            as ="span"
                        >
                            Select a Validator
                        </Text>
                    )
                }
                <Flex
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                    width="auto"
                    gap="8px"
                >
                    {
                        !!validatorName && (
                        <Text
                            fontSize="12px"
                            fontWeight="500"
                            textAlign={"left"}
                            color="#FF57B7"
                            fontStyle="normal"
                            lineHeight="140%"
                            userSelect="none"
                            as ="span"
                            fontFamily="HarmonyOS Sans"
                        >
                            <span style={{ 
                                color: 'rgba(0, 0, 0, 0.60)',
                                fontSize: '12px',
                                fontWeight: 400,
                                lineHeight: '20px',
                                textTransform: 'capitalize',
                                // font-family: "HarmonyOS Sans";
                                // font-size: 12px;
                                // font-style: normal;
                                // font-weight: 400;
                                // line-height: 20px; /* 166.667% */
                                // text-transform: capitalize;
                            }}>Live APR</span> 
                            <span> { liveApr }</span>
                        </Text>
                    )
                    }
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