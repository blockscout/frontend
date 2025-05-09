/* eslint-disable */
import { Box, Heading, Grid, Text,  Flex } from '@chakra-ui/react';
import { Tooltip, useDisclosure } from '@chakra-ui/react';
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
                    label={ 
                        <Box
                            maxWidth={{
                                base: '70vw',
                                lg: '260px',
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
                            { tipsInfo }
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
                dataList.map((item, index) => (
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

const InfoBox = ({
    overViewInfo,
    isDetailInfoLoading
}: {
    overViewInfo: {
        totalStake: string;
        liveApr: string;
        uptime: string;
        commissionRate: string;
        validatorStake: string;
        validatorRewards: string;
        blocksValidated: string;
    };
    isDetailInfoLoading: boolean;
}) => {

    const OverviewData  = [
        {
            label: 'Total Stake',
            tipsInfo: 'Total amount of tokens currently staked with the validator.',
            value: <Text > { overViewInfo.totalStake } </Text>,
        },
        {
            label: 'Live APR',
            tipsInfo: 'The current annual percentage return estimated from staking tokens with the validator.',
            value: <Text > { overViewInfo.liveApr } </Text>,
        },
        {
            label: 'Uptime',
            tipsInfo: 'The reliability and availability of a validator node, shown as an uptime percentage.',
            value: <Text > { overViewInfo.uptime } </Text>,
        },
        {
            label: 'Commission Rate',
            tipsInfo: `The percentage fee charged by validators from delegators' staking rewards.`,
            value: <Text > { overViewInfo.commissionRate } </Text>,
        },
    ];
    
    
    const MoreData  = [
        {
            label: `Validator's Stake`,
            tipsInfo: 'Amount of tokens the validator itself has staked.',
            value: <Text > { overViewInfo.validatorStake } </Text>,
        },
        {
            label: `Validator's Rewards`,
            tipsInfo: 'Rewards earned by the validator from network participation.',
            value: <Text > { overViewInfo.validatorStake } </Text>,
        },
        {
            label: 'Uptime',
            tipsInfo: 'Rewards distributed to users staking their tokens with this validator.',
            value: <Text > { overViewInfo.uptime } </Text>,
        },
        {
            label: 'Recently Validated Blocks',
            tipsInfo: `Number of successfully validated blocks in the last 10,000 blocks.`,
            value: <Text > { overViewInfo.blocksValidated } </Text>,
        },
    ]

    return (
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} marginBottom = {4} rowGap={"20px"} columnGap={ 6 } mb={ 8 }>
      
            <InfoBoxItem
                dataList={ OverviewData }
                titleText="Overview"
            />

            <InfoBoxItem
                dataList={ MoreData }
                titleText="More"
            />
        </Grid>
    )
}

export default InfoBox;

