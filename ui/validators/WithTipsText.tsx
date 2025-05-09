/* eslint-disable */
import { Box, Button, Grid, Text,  Flex } from '@chakra-ui/react';
import { Tooltip, useDisclosure } from '@chakra-ui/react';
import React from 'react';
import IconSvg from 'ui/shared/IconSvg';


const WithTipsText = ({
    label,
    tips,
    placement = 'top',
}: {
    label: string | React.ReactNode;
    tips: string | React.ReactNode;
    placement?: 'top' | 'bottom' | 'left' | 'right';
}) => {
    
    const { isOpen, onOpen, onToggle, onClose } = useDisclosure();

    return (
        <Text fontWeight="400" fontSize="14px" color="rgba(0, 0, 0, 0.4)">
            <Box display="inline-block">
                <span>
                    { label }
                </span>
                <Tooltip 
                    isOpen={ isOpen }
                    onOpen={ onOpen }
                    onClose={ onClose }
                    placement= { placement }
                    hasArrow = { false }
                    label={ 
                        <Box
                            maxWidth={{
                                base: '70vw',
                                lg: '195px',
                            }}
                            fontSize="12px"
                            fontWeight="400"
                            color="rgba(0, 0, 0, 0.60)"
                            lineHeight="16px"
                            fontStyle="normal"
                            textTransform="capitalize"
                            fontFamily="HarmonyOS Sans"
                            as="div"
                        >
                            { tips }
                        </Box>
                    }
                    border= "0.5px solid rgba(0, 46, 51, 0.10)"
                    backgroundColor="white"
                    boxShadow="0px 2px 12px 0px rgba(0, 0, 0, 0.10)"
                    padding = {"8px"}
                    borderRadius="8px"
                >
                    <Button
                        variant="unstyled"
                        display="inline-flex"
                        alignItems="center"
                        borderRadius="8px"
                        w="24px"
                        h="24px"
                        cursor="pointer"
                        flexShrink={ 0 }
                        aria-label="Transaction info"
                        >
                            <IconSvg
                                name="info"
                                boxSize={ 5 }
                                color={ isOpen ? 'link_hovered' : 'icon_info' }
                                _hover={{ color: 'link_hovered' }}
                            />
                        </Button>
                </Tooltip>
            </Box>
        </Text>
    );
}
export default WithTipsText;