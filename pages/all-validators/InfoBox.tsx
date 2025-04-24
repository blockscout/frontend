/* eslint-disable */
import { Box, Heading, Grid, Text,  Flex } from '@chakra-ui/react';
import { Tooltip, useDisclosure } from '@chakra-ui/react';
import AdditionalInfoButton from 'ui/shared/AdditionalInfoButton';
import {
  useColorModeValue,
  chakra,
  Button,
  Skeleton,
} from '@chakra-ui/react';
import React from 'react';

import IconSvg from 'ui/shared/IconSvg';

const sectionProps = {
    borderBottom: '1px solid',
    borderColor: 'divider',
};


const sectionTitleProps = {
    color: 'gray.500',
    fontWeight: 600,
};



const mockData  = [
    {
        label: 'Validator',
        tipsInfo: 'Validator info',
        value: <Text color="red"> hahahrwetwetweah </Text>,
    },
    {
        label: 'Validator',
        tipsInfo: 'Validator info',
        value: <Text color="green"> hatwetwetwhahah </Text>,
    },
    {
        label: 'Validator',
        tipsInfo: 'Validator info',
        value: <Text color="blue"> hahaetwetwehah </Text>,
    },
]

const InfoBoxItemLabel = ({ 
    label,
    tipsInfo,
}: {
    label: string;
    tipsInfo: string;
}) => {

    const { isOpen, onOpen, onToggle, onClose } = useDisclosure();

    return (
        <Text fontWeight="400" fontSize="14px" color="rgba(0, 0, 0, 0.4)" p="12px 0">
            <Box display="inline-block">
                <Tooltip 
                    isOpen={ isOpen }
                    onOpen={ onOpen }
                    onClose={ onClose }
                    placement='right'
                    hasArrow = { false }
                    label={ tipsInfo }
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
                <span>
                    { label }
                </span>
            </Box>
        </Text>
    )
}
const InfoBoxItem = ({
    dataList,
    titleText,
}: {
    dataList: any[];
    titleText: string;
}) => {
    return (
        <Box flex="1" border="1px" borderRadius="12px" borderColor="rgba(0, 0, 0, 0.06);" p="24px">
            <Heading as="h4" size="sm" mb={ 2 }> { titleText } </Heading>
            {
                mockData.map((item, index) => (
                    <Box { ...sectionProps } key={ index } 
                        borderBottom = { index === dataList.length - 1 ? 'none' : '1px solid' }
                    >
                        <Flex justifyContent="space-between">
                            <InfoBoxItemLabel  label={ item.label } tipsInfo={ item.tipsInfo } />
                            <Box p="12px 0">
                                { item.value }
                            </Box>
                        </Flex>
                    </Box>
                ))
            }
        </Box>
    )
}

const InfoBox = () => {
    return (
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} marginBottom = {4} rowGap={"20px"} columnGap={ 6 } mb={ 8 }>
      
            <InfoBoxItem
                dataList={ [1, 2, 3] }
                titleText="Validator"
            />

            <InfoBoxItem
                dataList={ [1, 2, 3] }
                titleText="Validator"
            />
        </Grid>
    )
}

export default InfoBox;

