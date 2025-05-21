/* eslint-disable */
import useAccount from 'lib/web3/useAccount';
import { Box, Grid, Flex, Button,  Text } from '@chakra-ui/react';
import {
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
} from '@chakra-ui/react';
import CommonModal from './CommonModal';
import React , { useEffect } from 'react';
import { formatUnits } from 'viem';
import { toBigInt , parseUnits} from 'ethers';
import axios from 'axios';
import {  useSendTransaction, useWalletClient, useBalance, usePublicClient } from 'wagmi';
import { useStakeLoginContextValue } from 'lib/contexts/stakeLogin';
import { token } from 'mocks/address/address';


type txType = 'Withdraw' | 'Claim' | 'Stake' | 'MoveStake' | 'ClaimAll' | 'ChooseStake' | 'Compound-Claim' | 'Compound-Stake'


const valueFormatter = ( priceStr : string ) => {
    return `($${priceStr})`
}

const valueCalculator = ( tokenAmount : string | number, tokenPrice : string | number ) => {
    const amount = Number(tokenAmount || 0);
    const price = Number(tokenPrice || 0);
    return (amount * price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}


const icon_1 = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M13.5999 3.9998V4H13.6V4.00189C13.5982 5.76833 11.0917 7.2 8 7.2C4.90721 7.2 2.4 5.76731 2.4 4H2.3999V3.9998C2.3999 2.23249 4.90711 0.799805 7.9999 0.799805C11.0927 0.799805 13.5999 2.23249 13.5999 3.9998ZM12.5552 7.30463C12.926 7.0927 13.2835 6.83789 13.6 6.5422L13.6 8C13.6 8.00063 13.6 8.00126 13.6 8.00189C13.5982 9.76833 11.0917 11.2 8 11.2C4.90721 11.2 2.4 9.76731 2.4 8L2.4 6.5422C2.71648 6.83789 3.07395 7.0927 3.44484 7.30463C4.67042 8.00497 6.28346 8.4 8 8.4C9.71654 8.4 11.3296 8.00497 12.5552 7.30463ZM2.4 10.5422V12C2.4 13.7673 4.90721 15.2 8 15.2C11.0928 15.2 13.6 13.7673 13.6 12V10.5422C13.2835 10.8379 12.926 11.0927 12.5552 11.3046C11.3296 12.005 9.71654 12.4 8 12.4C6.28346 12.4 4.67042 12.005 3.44484 11.3046C3.07395 11.0927 2.71648 10.8379 2.4 10.5422Z" fill="black" fillOpacity="0.2"/>
    </svg>
)

const icon_2 = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M1.60005 2.39941C1.15822 2.39941 0.800049 2.75759 0.800049 3.19941V3.99941C0.800049 4.44124 1.15822 4.79941 1.60005 4.79941H14.4C14.8419 4.79941 15.2 4.44124 15.2 3.99941V3.19941C15.2 2.75759 14.8419 2.39941 14.4 2.39941H1.60005ZM1.60005 5.99941H14.4L13.7508 12.1669C13.6651 12.9812 12.9784 13.5994 12.1596 13.5994H3.84047C3.02165 13.5994 2.33498 12.9812 2.24926 12.1669L1.60005 5.99941ZM7.99995 7.19941C8.33132 7.19941 8.59995 7.46804 8.59995 7.79941V9.83584L9.35398 8.99804C9.57565 8.75173 9.95502 8.73176 10.2013 8.95344C10.4476 9.17511 10.4676 9.55449 10.2459 9.80079L8.44593 11.8008C8.33214 11.9272 8.17004 11.9994 7.99995 11.9994C7.82986 11.9994 7.66776 11.9272 7.55397 11.8008L5.75397 9.80079C5.5323 9.55449 5.55227 9.17511 5.79857 8.95344C6.04488 8.73176 6.42425 8.75173 6.64593 8.99803L7.39995 9.83584L7.39995 7.79941C7.39995 7.46804 7.66858 7.19941 7.99995 7.19941Z" fill="black" fillOpacity="0.2"/>
    </svg>
);

const icon_3 = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M11.2002 4.79961C11.4513 4.46535 11.6001 4.04985 11.6001 3.59961C11.6001 2.49504 10.7047 1.59961 9.6001 1.59961C8.94586 1.59961 8.36499 1.91375 8.0001 2.39942C7.63521 1.91375 7.05434 1.59961 6.4001 1.59961C5.29553 1.59961 4.4001 2.49504 4.4001 3.59961C4.4001 4.04985 4.54888 4.46535 4.79995 4.79961H2.6001C2.04781 4.79961 1.6001 5.24732 1.6001 5.79961V6.19961C1.6001 6.75189 2.04781 7.19961 2.6001 7.19961H7.4001V4.79961H8.6001V7.19961H13.4001C13.9524 7.19961 14.4001 6.75189 14.4001 6.19961V5.79961C14.4001 5.24732 13.9524 4.79961 13.4001 4.79961H11.2002ZM10.4001 3.59961C10.4001 4.04144 10.0419 4.39961 9.6001 4.39961H8.8001L8.8001 3.59961C8.8001 3.15778 9.15827 2.79961 9.6001 2.79961C10.0419 2.79961 10.4001 3.15778 10.4001 3.59961ZM5.6001 3.59961C5.6001 4.04144 5.95827 4.39961 6.4001 4.39961H7.2001V3.59961C7.2001 3.15778 6.84193 2.79961 6.4001 2.79961C5.95827 2.79961 5.6001 3.15778 5.6001 3.59961Z" fill="black" fillOpacity="0.2"/>
        <path d="M7.4001 8.39961H2.4001V12.1996C2.4001 13.4146 3.38507 14.3996 4.6001 14.3996H7.4001V8.39961Z" fill="black" fillOpacity="0.2"/>
        <path d="M8.6001 14.3996V8.39961H13.6001V12.1996C13.6001 13.4146 12.6151 14.3996 11.4001 14.3996H8.6001Z" fill="black" fillOpacity="0.2"/>
    </svg>
)

const icon_4 = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8.60005 8.6537V10.7455C8.94536 10.6817 9.25972 10.5633 9.51018 10.3995C9.89594 10.1473 10.0001 9.88123 10.0001 9.69961C10.0001 9.51799 9.89594 9.25194 9.51018 8.99971C9.25972 8.83594 8.94536 8.71749 8.60005 8.6537Z" fill="black" fillOpacity="0.2"/>
        <path d="M6.66378 6.89519C6.7068 6.93996 6.75581 6.98403 6.81133 7.02694C6.97768 7.15548 7.17894 7.25383 7.4001 7.31713V5.28213C7.34046 5.2992 7.28227 5.31882 7.22582 5.34089C7.18986 5.35495 7.15462 5.37 7.12016 5.38602C7.00806 5.43814 6.90425 5.50052 6.81133 5.57232C6.50936 5.80566 6.4001 6.07363 6.4001 6.29963C6.4001 6.4467 6.44637 6.61156 6.56192 6.77307C6.59128 6.81411 6.62511 6.85493 6.66378 6.89519Z" fill="black" fillOpacity="0.2"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M14.4001 7.99961C14.4001 11.5342 11.5347 14.3996 8.0001 14.3996C4.46548 14.3996 1.6001 11.5342 1.6001 7.99961C1.6001 4.46499 4.46548 1.59961 8.0001 1.59961C11.5347 1.59961 14.4001 4.46499 14.4001 7.99961ZM8.00005 3.19961C8.33142 3.19961 8.60005 3.46824 8.60005 3.79961V4.05228C9.0739 4.13645 9.53466 4.32302 9.92255 4.62276C10.2635 4.88624 10.5174 5.2143 10.6627 5.58278C10.7842 5.89107 10.6328 6.23949 10.3245 6.361C10.0162 6.48251 9.66777 6.3311 9.54626 6.02281C9.48804 5.87511 9.37609 5.71701 9.18882 5.5723C9.02247 5.44376 8.82121 5.34541 8.60005 5.28211V7.43916C9.15851 7.51347 9.70625 7.69416 10.1669 7.99535C10.7965 8.40701 11.2001 9.0111 11.2001 9.69961C11.2001 10.3881 10.7965 10.9922 10.1669 11.4039C9.70625 11.7051 9.15851 11.8857 8.60005 11.9601V12.1996C8.60005 12.531 8.33142 12.7996 8.00005 12.7996C7.66868 12.7996 7.40005 12.531 7.40005 12.1996V11.9601C6.84159 11.8857 6.29386 11.7051 5.83323 11.4039C5.4472 11.1515 5.14705 10.8297 4.9708 10.4533C4.83026 10.1532 4.9596 9.79604 5.25969 9.65549C5.55978 9.51495 5.91698 9.64429 6.05752 9.94439C6.12216 10.0824 6.25363 10.245 6.48993 10.3995C6.74039 10.5633 7.05474 10.6817 7.40005 10.7455V8.54694C6.9262 8.46276 6.46543 8.27619 6.07755 7.97646C5.52037 7.54591 5.20005 6.94375 5.20005 6.29961C5.20005 5.65547 5.52037 5.05331 6.07755 4.62276C6.46543 4.32302 6.9262 4.13645 7.40005 4.05228V3.79961C7.40005 3.46824 7.66868 3.19961 8.00005 3.19961Z" fill="black" fillOpacity="0.2"/>
    </svg>
);


const icon_eye = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 10.0004C9.10457 10.0004 10 9.10496 10 8.00039C10 6.89582 9.10457 6.00039 8 6.00039C6.89543 6.00039 6 6.89582 6 8.00039C6 9.10496 6.89543 10.0004 8 10.0004Z" fill="black" fillOpacity="0.2"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M0.531404 8.47269C0.413913 8.16738 0.414015 7.8289 0.531688 7.52365C1.68702 4.52669 4.59464 2.40039 7.99887 2.40039C11.4048 2.40039 14.3136 4.5288 15.4678 7.52809C15.5853 7.83341 15.5852 8.17189 15.4675 8.47713C14.3121 11.4741 11.4045 13.6004 8.0003 13.6004C4.59438 13.6004 1.68558 11.472 0.531404 8.47269ZM11.2003 8.00039C11.2003 9.7677 9.76761 11.2004 8.0003 11.2004C6.23299 11.2004 4.8003 9.7677 4.8003 8.00039C4.8003 6.23308 6.23299 4.80039 8.0003 4.80039C9.76761 4.80039 11.2003 6.23308 11.2003 8.00039Z" fill="black" fillOpacity="0.2"/>
    </svg>
);


const no_op = () => {};

const PlainButton = ({text, onClick, disabled = false} : {
    text: string,
    onClick?: () => void,
    disabled?: boolean
}) => {
    return (
        <Button
            onClick={ onClick || no_op }
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius={9999}
            _hover={{ backgroundColor: "#FFCBEC" , opacity: 0.9 }}
            width={ '100px' }
            height={ '32px' }
            variant='solid'
            backgroundColor = { disabled ? '#FFCBEC' : '#FF57B7' }
            cursor={ disabled ? 'not-allowed' : 'pointer' }
        >
            <Text 
                fontSize="12px"
                fontWeight="500"
                lineHeight="normal"
                fontStyle="normal"
                color = { '#FFF' }
                fontFamily="HarmonyOS Sans"
                textTransform="capitalize"
            >{ text }</Text>
        </Button>
    );
}

const PlainButton2 = ({text, onClick, disabled = false} : {
    text: string,
    onClick?: () => void,
    disabled?: boolean
}) => {
    return (
        <Button
            onClick={ onClick || no_op }
            px = "8px"
            py = "4px"
            width={ '100px' }
            height={ '32px' }
            display="flex"
            alignItems="center"
            justifyContent="center"
            _hover={{ backgroundColor: "#FFCBEC" , opacity: 0.9 }}
            borderRadius={9999}
            backgroundColor = { disabled ? '#FEF1F9' : '#FEE5F4' }
            cursor={ disabled ? 'not-allowed' : 'pointer' }
        >
            <Text 
                fontSize="12px"
                fontWeight="500"
                lineHeight="normal"
                fontStyle="normal"
                color = { disabled ? '#FFCBEC' : '#FF57B7' }
                fontFamily="HarmonyOS Sans"
                textTransform="capitalize"
            >{ text }</Text>
        </Button>
    );
}


const IconContainer = ({ children }: { children: React.ReactNode }) => {
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="16px"
            height="16px"
        >
            {children}
        </Box>
    );
}


const NumberStats = ({
    icon,
    label,
    amount,
    value,
    hide,
    isWrapper = false,
}: {
    icon: React.ReactNode;
    label: string;
    amount: string | number;
    value: string | number;
    hide: boolean;
    isWrapper?: boolean;
}) => {
    return (
        <Stat>
            <StatLabel>
                <Flex alignItems="center" justifyContent="flex-start"  gap={2}>
                    {icon}
                    <Text marginLeft={"4px"} fontSize="12px" fontWeight="400" color="rgba(0, 0, 0, 0.40)" lineHeight="16px" fontStyle="normal" textTransform="capitalize" fontFamily="HarmonyOS Sans">
                        {label}
                    </Text>
                </Flex>
            </StatLabel>
            <Flex alignItems="baseline" justifyContent="flex-start" height={"32px"} marginTop="8px" >
                <StatNumber>
                    <Text fontSize="22px" fontWeight="700" color="#000" lineHeight="32px" fontStyle="normal" textTransform="capitalize" fontFamily="HarmonyOS Sans">
                        {hide ? '****' : amount}
                    </Text>
                </StatNumber>
                
                    { isWrapper ? (

                        <>
                            <StatHelpText marginLeft={"4px"} >
                                <Text fontSize="12px" fontWeight="500" color="rgba(0, 0, 0, 0.40)" lineHeight="20px" fontStyle="normal" textTransform="capitalize" fontFamily="HarmonyOS Sans">
                                    MOCA
                                </Text>
                            </StatHelpText>
                        </>

                    ) : (

                        <StatHelpText marginLeft={"4px"} >
                            <Flex alignItems="center" gap={"8px"} >
                                <Text fontSize="12px" fontWeight="500" color="rgba(0, 0, 0, 0.40)" lineHeight="20px" fontStyle="normal" textTransform="capitalize" fontFamily="HarmonyOS Sans">
                                    MOCA
                                </Text>
                                <Text fontSize="12px" fontWeight="500" color="rgba(0, 0, 0, 0.20)" lineHeight="20px" fontStyle="normal" textTransform="capitalize" fontFamily="HarmonyOS Sans">
                                    {hide ? '(****)' : value}
                                </Text>
                            </Flex>
                        </StatHelpText>
                )}

            </Flex>
            { isWrapper && (
                <Text fontSize="12px" fontWeight="500" color="rgba(0, 0, 0, 0.20)" lineHeight="20px" fontStyle="normal" textTransform="capitalize" fontFamily="HarmonyOS Sans">
                    {hide ? '****' : value}
                </Text>
            )}
        </Stat>
    )
}

const StakingInfo = ({
    stakedAmount = 0,
    claimableRewards = 0,
    withdrawingAmount = 0,
    totalRewards = 0,
    handleCloseModal,
    isOpen,
    handleClaimAll,
    handleCompound,
    handleStakeMore,
    handleSubmit,
    setAvailableAmount,
    setCurrentAmount,
    extraDescription,
    transactionStage,
    currentItem,
    currentFromItem,
    currentFromAddress,
    setCurrentFromAddress,
    setCurrentFromItem,
    currentTxType,
    availableAmount,
    isTxLoading,
    currentAddress,
    setCurrentAddress,
    transactionHash,
    isHideNumber,
    setIsHideNumber,
    onOpen = no_op,
    modalTitle = 'Stake',
    currentAmount,
    setCurrentItem,
    setCurrentTxType
}: {
    stakedAmount?: number | string;
    claimableRewards?: number | string;
    withdrawingAmount?: number | string;
    totalRewards?: number | string;
    handleCloseModal: () => void;
    isOpen: boolean;
    handleClaimAll: () => void;
    handleCompound: () => void;
    handleStakeMore: () => void;
    handleSubmit: (targetAddress: string, txType: string, amount: string, from?: string) => Promise<void>;
    setAvailableAmount: (amount: string) => void;
    setCurrentAmount: (amount: string) => void;
    extraDescription: string | null;
    transactionStage: string;
    currentItem: string;
    currentFromItem: string;
    currentFromAddress: string;
    setCurrentFromAddress: (address: string) => void;
    setCurrentFromItem: (item: string) => void; 
    currentTxType: txType;
    availableAmount: string;
    isTxLoading: boolean;
    currentAddress: string;
    setCurrentAddress: (address: string) => void;
    setCurrentTxType: (txType: txType) => void;
    transactionHash: string;
    isHideNumber: boolean;
    setIsHideNumber: (isHide: boolean) => void;
    onOpen?: () => void;
    modalTitle?: string;
    currentAmount: string;
    setCurrentItem: (item: string) => void;
}) => {


    const { address: userAddr } = useAccount();

    const { data: balanceData } = useBalance({ address: userAddr});
    const { tokenPrice} = useStakeLoginContextValue();
    const formattedBalanceStr = React.useMemo(() => {
        if (balanceData && !!balanceData.value) {
            return formatUnits(balanceData.value, 18);
        }
        return '0.00';
    }, [userAddr , balanceData]);

    return (
        <Grid templateColumns={{ base: '1fr', lg: '1fr 2fr' }} 
            paddingRight={{ base: '0', lg: '24px' }}
            paddingBottom={{ base: '24px', lg: '0' }}
            marginBottom = {4} rowGap={"20px"} columnGap={ 6 } mb={ 8 }
        >
            <Box flex="1" border="1px" borderRadius="12px" borderColor="rgba(0, 0, 0, 0.06);" p="16px" >
                <Box width={'100%'} height={'100%'} position={'relative'}>
                    <Flex p="0" height={'100%'} flexDirection="column" justifyContent={{ base: 'flex-start', lg: 'space-between' }} alignItems='flex-start' gap={ 4 }>
                        <NumberStats
                            icon={<IconContainer>{icon_3}</IconContainer>}
                            label="Claimable Rewards"
                            amount={ Number(claimableRewards || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
                            value= { valueFormatter(valueCalculator(claimableRewards, tokenPrice)) }
                            isWrapper={true}
                            hide={isHideNumber}
                        />
                        <Flex alignItems="center" mt={4} justifyContent="flex-start" gap={"12px"}>
                            <PlainButton 
                                text="Claim all"
                                onClick={ handleClaimAll }
                                disabled={ false }
                            />
                            <PlainButton2 
                                text="Compounding"
                                onClick={ handleCompound }
                                disabled={ false }
                            />
                        </Flex>
                    </Flex>
                    <Box position={'absolute'} top={0} right={0} zIndex={10}>
                        <button onClick={ () => setIsHideNumber(!isHideNumber) }
                        >
                            { isHideNumber ? icon_eye : icon_eye }
                        </button>
                    </Box>
                </Box>
            </Box>

            <Box flex="1" border="1px"  position={'relative'}  px="16px" py="16px"  borderRadius="12px" borderColor="rgba(0, 0, 0, 0.06)">
                <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} rowGap={"20px"} columnGap={"auto"} alignItems="space-between" height={'100%'}>
                    <Box>
                        <NumberStats
                            icon={<IconContainer>{icon_1}</IconContainer>}
                            label="Staked Amount"
                            amount={ Number(stakedAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
                            value= { valueFormatter(valueCalculator(stakedAmount, tokenPrice)) }
                            hide={isHideNumber}
                        />
                    </Box>

                    <Box>
                        <NumberStats
                            icon={<IconContainer>{icon_2}</IconContainer>}
                            label="Withdrawing Amount"
                            amount={ Number(withdrawingAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
                            value= { valueFormatter(valueCalculator(withdrawingAmount, tokenPrice)) }
                            hide={isHideNumber}
                        />
                    </Box>

                    <Box>
                        <NumberStats
                            icon={<IconContainer>{icon_3}</IconContainer>}
                            label="Total Rewards"
                            amount={ Number(totalRewards || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
                            value= { valueFormatter(valueCalculator(totalRewards, tokenPrice)) }
                            hide={isHideNumber}
                        />
                    </Box>
                    <Box>
                        <NumberStats
                            icon={<IconContainer>{icon_4}</IconContainer>}
                            label="Available Balance"
                            amount= { Number(formattedBalanceStr || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
                            value= { valueFormatter(valueCalculator(formattedBalanceStr, tokenPrice)) }
                            hide={isHideNumber}
                        />
                    </Box>
                </Grid>

                <Box
                    bottom={ 4 } right={ 4 }
                    position={'absolute'}
                >
                    <PlainButton 
                        text="Stake More"
                        onClick={ handleStakeMore }
                        disabled={ false }
                    />
                </Box>
                <CommonModal 
                    isOpen = { isOpen }
                    onClose = { handleCloseModal }
                    title = { modalTitle}
                    extraDescription = { extraDescription }
                    transactionStage = { transactionStage }
                    currentTxType = { currentTxType }
                    availableAmount = { availableAmount }
                    setAvailableAmount = { setAvailableAmount }
                    onSubmit = { handleSubmit }
                    onOpen = { onOpen }
                    txhash= { transactionHash }
                    isSubmitting = { isTxLoading }
                    currentAmount = { currentAmount }
                    setCurrentItem = { setCurrentItem }
                    setCurrentAmount = { setCurrentAmount }
                    currentAddress = { currentAddress }
                    setCurrentFromItem = { setCurrentFromItem }
                    setCurrentAddress = { setCurrentAddress }
                    currentItem = { currentItem }
                    currentFromItem = { currentFromItem }
                    currentFromAddress = { currentFromAddress }
                    setCurrentFromAddress = { setCurrentFromAddress }
                />
            </Box>
        </Grid>
    );
}

export default StakingInfo;