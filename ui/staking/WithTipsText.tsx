/* eslint-disable */
import { Box, Button, Grid, Text,  Flex } from '@chakra-ui/react';
import { Tooltip, useDisclosure } from '@chakra-ui/react';
import React from 'react';
import IconSvg from 'ui/shared/IconSvg';


const WithTipsText = ({
    label,
    tips,
}: {
    label: string | React.ReactNode;
    tips: string | React.ReactNode;
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
                    placement='right'
                    hasArrow = { false }
                    label={ 
                    <Box
                        maxWidth={{
                            base: '70vw',
                            lg: '300px',
                        }}
                    >{ tips }</Box> }
                    bg="white"
                    color="gray.500"
                    border="1px solid"
                    borderColor="divider"
                    borderRadius="8px"
                    padding = { 2 }
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