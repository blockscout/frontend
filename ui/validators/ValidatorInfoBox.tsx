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


const TokenAmount = ({
    amount,
    isLoading = false,
}: {
    amount: string | number;
    isLoading?: boolean;
}) => {
    return (
        <Skeleton isLoaded={ !isLoading } >
            <span
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 'auto',
                    height: 'auto',
                    gap: '6px',
                }}
            >
                <span style={{ color: '#A80C53' }}>
                    { amount } 
                </span>

                <span style={{ color: 'black' }}>
                    {' '}
                    Moca
                </span>
            </span>
        </Skeleton>
    )
}



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
            <Box display="flex" alignItems="center" gap={ "4px" } as="span">
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
                        w="14px"
                        h="14px"
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
                <span style={{
                    fontSize: '12px',
                    fontWeight: '400',
                    color: 'rgba(0, 0, 0, 0.4)',
                    lineHeight: 'normal',
                    fontStyle: 'normal',
                    textTransform: 'capitalize',
                    fontFamily: 'HarmonyOS Sans',
                }}>
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
                        p="12px 0"
                        borderBottom = { index === dataList.length - 1 ? 'none' : '1px solid' }
                    >
                        <Flex justifyContent="space-between" height={ '29px' } alignItems="center">
                            <InfoBoxItemLabel  label={ item.label } tipsInfo={ item.tipsInfo } />
                            <Box 
                                fontSize="12px"
                                fontWeight="500"
                                color="#000"
                                lineHeight="normal"
                                fontStyle="normal"
                                textTransform="capitalize"
                                fontFamily="HarmonyOS Sans"
                                display="flex"
                                alignItems="center"
                                justifyContent="flex-end"
                                width="auto"
                            >
                                { item.value }
                            </Box>
                        </Flex>
                    </Box>
                ))
            }
        </Box>
    )
}

const percentageFormat = (value: number | string) => {
    const _n = Number(value);
    if (isNaN(_n)) {
        return '0.00%';
    }
    if (_n > 1) {
        return `${_n.toFixed(2)}%`;
    }
    return `${(_n * 100).toFixed(2)}%`;
}

const integerFormat = (value: number | string) => {
    const _n = Number(value);
    if (isNaN(_n)) {
        return '0';
    }
    return `${ _n.toLocaleString('en-US') }`;
}

const InfoBox = ({
    overViewInfo,
    isDetailInfoLoading
}: {
    overViewInfo: {
        totalStake: string;
        commissionRate?: string;
        validatorStake?: string;
        uptime: string;
        blocksValidated: string;
        validatorRewards ?: string;
        liveApr?: string;
        validator?: string;
        status?: string;
        delegatorRewards?: string;
    };
    isDetailInfoLoading: boolean;
}) => {

    const OverviewData  = [
        {
            label: 'Total Stake',
            tipsInfo: 'Total amount of tokens currently staked with the validator.',
            value: <TokenAmount amount={ overViewInfo.totalStake } isLoading={ isDetailInfoLoading } />,
        },
        {
            label: 'Live APR',
            tipsInfo: 'The current annual percentage return estimated from staking tokens with the validator.',
            value: <Text > { overViewInfo.liveApr } </Text>,
        },
        {
            label: 'Uptime',
            tipsInfo: 'The reliability and availability of a validator node, shown as an uptime percentage.',
            value: <Text > { percentageFormat(overViewInfo.uptime) } </Text>,
        },
        {
            label: 'Commission Rate',
            tipsInfo: `The percentage fee charged by validators from delegators' staking rewards.`,
            value: <Text > { percentageFormat(overViewInfo.commissionRate || 0) } </Text>,
        },
    ];
    
    
    const MoreData  = [
        {
            label: `Validator's Stake`,
            tipsInfo: 'Amount of tokens the validator itself has staked.',
            value: <TokenAmount amount={ overViewInfo.validatorStake ||  0} isLoading={ isDetailInfoLoading } />,
        },
        {
            label: `Validator's Rewards`,
            tipsInfo: 'Rewards earned by the validator from network participation.',
            value: <TokenAmount amount={ overViewInfo.validatorRewards || 0 } isLoading={ isDetailInfoLoading } />,
        },
        {
            label: `Delegator's Rewards`,
            tipsInfo: 'Rewards distributed to users staking their tokens with this validator.',
            value:<TokenAmount amount={ overViewInfo.delegatorRewards || 0 } isLoading={ isDetailInfoLoading } /> ,
        },
        {
            label: 'Recently Validated Blocks',
            tipsInfo: `Number of successfully validated blocks in the last 10,000 blocks.`,
            value: <span > { integerFormat(overViewInfo.blocksValidated )} </span>,
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

