/* eslint-disable */
import useAccount from 'lib/web3/useAccount';
import { Box, Grid, Flex, Button,  Text } from '@chakra-ui/react';
import StakingModal from './StakingModal';
import ValidatorItemBar from 'ui/staking/ValidatorItemBar';
import StakingModalNumberInput from 'ui/staking/StakingModalNumberInput';
import SuccessfulContent from 'ui/stakingModal/SuccessfulContent';
import EarnInfoBox from 'ui/staking/EarnInfoBox';
import ReadOnlyInput from 'ui/stakingModal/ReadOnlyInput';
import ModalFooterBtnGroup from 'ui/staking/ModalFooterBtnGroup';
import HeadsUpInfo from 'ui/staking/HeadsUpInfo';
import StakingValidatorSelect from 'ui/staking/StakingValidatorSelect';
import WithTextWrapper from 'ui/staking/WithTextWrapper';
import FromAndToSelect from 'ui/staking/FromAndToSelect';
import { useStakeLoginContextValue } from 'lib/contexts/stakeLogin';
import React ,  { useMemo, useCallback, useEffect } from 'react';
import axios from 'axios';
import {  useSendTransaction, useWalletClient, useBalance, usePublicClient } from 'wagmi';
import Decimal from 'decimal.js';


const SetInput = ({ value , setValue, currentAmount, refetchBalance, userAddr }: {
    value: string;
    setValue: (value: string) => void;
    currentAmount: string;
    refetchBalance: () => void;
    userAddr?: string;
}) => {


    useEffect(() => {
        if(currentAmount === '0.00' || currentAmount === '') {
            setValue('');
        } else {
            setValue(currentAmount);
        }
        !!userAddr && refetchBalance();
    }, []);


    return (
        <div style={{height: "0"}}></div>
    )
}

const formatTokenAmountTruncated = (
  num: number | string | null | undefined,
  decimalPlaces: number = 2
): string => {
    
  if (num === null || num === undefined || num === '') return '-';

  const _num = typeof num === 'string' ? Number(num) : num;

  if (isNaN(_num)) return '-';

  if (_num === 0) return '0';

    const factor = new Decimal(10).pow(decimalPlaces);
    const sum = new Decimal(num).mul(factor).toNumber(); 
    const truncated = new Decimal( Math.trunc(sum) ).div(factor).toNumber();
  // 小于最小可展示值时（例如 0.01）
  if (truncated === 0 && _num > 0 && _num < 1 / factor.toNumber()) {
    return `<${(1 / factor.toNumber()).toFixed(decimalPlaces)}`;
  }

  const [intPart, decPart = ''] = truncated.toString().split('.');

  // 整数部分加千分位逗号
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // 截取指定小数位数，去除末尾 0
  const cleanedDec = decPart.slice(0, decimalPlaces).replace(/0+$/, '');

  return cleanedDec ? `${formattedInt}.${cleanedDec}` : formattedInt;
};


const valueCalculator = ( tokenAmount : string | number, tokenPrice : string | number ) => {
    const amount = typeof tokenAmount === 'string' ? Number(tokenAmount) : tokenAmount;
    const price = typeof tokenPrice === 'string' ? Number(tokenPrice) : tokenPrice;
    const _ = amount * price;
    return formatTokenAmountTruncated( String(_), 4 );
}


type txType = 'Withdraw' | 'Claim' | 'Stake' | 'MoveStake' | 'ClaimAll' | 'ChooseStake' | 'Compound-Claim' | 'Compound-Stake'

const CommonModal = ({
    isOpen,
    onClose,
    isSubmitting,
    title,
    onSubmit,
    onOpen,
    currentAmount,
    setCurrentAmount,
    currentTxType,
    availableAmount,
    setAvailableAmount,
    transactionStage,
    extraDescription = null,
    currentItem,
    currentApr,
    currentFromItem,
    currentAddress,
    currentFromAddress,
    setCurrentAddress,
    setCurrentFromAddress,
    setCurrentItem,
    callback,
    currentToItem,
    setCurrentToItem = () => {},
    setCurrentToAddress = () => {},
    txhash,
}: {
    isOpen: boolean;
    isSubmitting: boolean;
    onClose: () => void;
    title: string;
    onSubmit: (targetAddress: string, txType: string, amount: string, source?: string) => void;
    onOpen: () => void;
    currentAmount: string;
    transactionStage: string;
    setCurrentAmount: (value: string) => void;
    currentTxType: txType;
    availableAmount: string;
    setAvailableAmount: (value: string) => void;
    extraDescription?: string | null;
    currentAddress?: string;
    currentItem?: any;
    currentToItem?: any;
    currentApr?: string;
    currentFromItem?: any;
    currentFromAddress?: string;
    setCurrentAddress: (value: string) => void;
    setCurrentFromAddress: (value: string) => void;
    setCurrentFromItem: (value: any) => void;
    setCurrentItem: (value: any) => void;
    setCurrentToItem ?: (value: any) => void;
    callback ?: () => void;
    setCurrentToAddress ?: (value: string) => void;
    txhash?: string;
}) => {

    const [ loading, setLoading ] = React.useState<boolean>(false);
    const [ isMyValidatorLoading, setIsMyValidatorLoading ] = React.useState<boolean>(false);
    const [ isAllValidatorLoading, setIsAllValidatorLoading ] = React.useState<boolean>(false);
    const { address: userAddr } = useAccount();
    const { data: balanceData, refetch: refetchBalance } = useBalance({ address: userAddr});
    const { tokenPrice } = useStakeLoginContextValue();


    const spinner = (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '180px',
            width: '100%', marginTop: '10px' }}>
            <span className ="modal-spinner"></span>
        </div>
    );

    const [ apr , setApr ] = React.useState<string | number>("0.00");

    const [ inputStr , setInputStr ] = React.useState<string>(currentAmount);


    
    const handleSetApr = (value: string | number) => {
        setApr(value);
    }

    React.useEffect(() => {
        if( currentApr ) {
            setApr(currentApr);
        }
    }, [ currentApr ]);

    const [ myValidatorsList, setMyValidatorsList ] = React.useState<any[]>([]);
    const [ allValidatorsList, setAllValidatorsList ] = React.useState<any[]>([]);

    const isSuccess = React.useMemo(() => {
        if (transactionStage === 'success') {
            return true;
        } else {
            return false;
        }
    }
    , [ transactionStage ]);

    const { serverUrl : url } = useStakeLoginContextValue();
    
    const selectable = React.useMemo(() => {
        if (currentTxType === 'ChooseStake' || currentTxType === 'MoveStake' || currentTxType === 'Compound-Stake') {
            return true;
        }
        return false;
    }, [ currentTxType ]);
    

    const sourceValidatorAddress = useMemo(() => {
        if (currentTxType === 'MoveStake' && currentFromItem && currentFromItem.validatorAddress) {
            return currentFromItem.validatorAddress;
        }
        return null;
    }
    , [ currentTxType, currentFromItem ]);

    const requestMyValidatorsList = React.useCallback(async() => {
        if ( !userAddr) {
            return;
        }
        try {
            setIsMyValidatorLoading(true);
            setLoading(true);
            const param = new URLSearchParams();
            param.append('limit', '100');
            param.append('address', (userAddr || '').toLowerCase());
            const res = await axios.get(url + '/api/me/staking/delegations?' + param.toString(), {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 10000,
            }).then((response) => {
                setIsMyValidatorLoading(false);
                return response.data;
            }).catch((error) => {
                setIsMyValidatorLoading(false);
                return null;
            });
            setLoading(false);
            setIsMyValidatorLoading(false);
            if(res && res.code === 200) {
                const _temp = (res.data.validators || []).map((item: any) => {
                    return {
                        ...item,
                        validatorAddress: item.validatorAddress,
                        liveApr: item.liveAPR,
                    }
                });
                setIsMyValidatorLoading(false);
                setMyValidatorsList(_temp);
            }
            setLoading(false);
        } catch (error: any) {
            setLoading(false);
            setIsMyValidatorLoading(false);
        }
    }, [ url , userAddr]);

    const requestAlValidatorsList = React.useCallback(async() => {
        try {
            setIsAllValidatorLoading(true);
            const param = new URLSearchParams();
            param.append('limit', '100');
            // const res = await (await fetch(url + '/api/network/validators/list' + '?' + param.toString(), {
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            // })).json() as  any;
            const res = await axios.get(url + '/api/network/validators/list' + '?' + param.toString(), {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 10000,
            }).then((response) => {
                setIsAllValidatorLoading(false);
                return response.data;
            }).catch((error) => {
                setIsAllValidatorLoading(false);
                return null;
            });
            if(res && res.code === 200) {
                const _temp = (res.data.validators || []).map((item: any) => {
                    return {
                        ...item,
                        liveApr: item.liveApr,
                        validatorAddress: item.validator,
                    }
                });
                setIsAllValidatorLoading(false);
                setAllValidatorsList(_temp);
            }
        }
        catch (error: any) {
            setLoading(false);
            setIsAllValidatorLoading(false);
            throw Error(error);
        }
    }
    , [ url ]);



    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!currentAddress) {
            return;
        }
        if (currentTxType === 'ChooseStake') {
            if (!currentItem) {
                return;
            }
            onSubmit(currentAddress, currentTxType, currentAmount);
        }
        if (currentTxType === 'Stake' || currentTxType === 'Withdraw') {
            onSubmit(currentAddress, currentTxType, currentAmount);
        } else if (currentTxType === 'Claim' || currentTxType === 'ClaimAll' || currentTxType === 'Compound-Claim') {
            onSubmit(currentAddress, currentTxType, "0");
        } else if (currentTxType === 'MoveStake') { 
            if (!sourceValidatorAddress) {
                return;
            }
            onSubmit(currentAddress, currentTxType, currentAmount, sourceValidatorAddress);
        }
    };


    React.useEffect(() => {
        if (isOpen) {
            requestMyValidatorsList();
            requestAlValidatorsList();
        }
    }, [ isOpen, requestMyValidatorsList, requestAlValidatorsList ]);


    const ConfirmBtnText = React.useMemo(() => {
        switch (currentTxType) {
            case 'Stake':
                return 'Stake';
            case 'ChooseStake':
                return 'Stake';
            case 'Withdraw':
                return 'Withdraw';
            case 'Claim':
                return 'Claim';
            case 'ClaimAll':
                return 'Claim';
            case 'MoveStake':
                return 'Move Stake';
            case 'Compound-Claim':
                return 'Claim All';
            case 'Compound-Stake':
                return 'Stake';
            default:
                return '';
        }
    }, [ currentTxType ]);


    const [ isPopOverOpen, setIsPopOverOpen ] = React.useState(false);
    
    const handlePopOverOpen = () => {
        setIsPopOverOpen(true);
    }
    const handlePopOverClose = () => {
        setIsPopOverOpen(false);
    }
    const handlePopOverToggle = () => {
        setIsPopOverOpen((prev) => !prev);
    }

    const isOverAmount = React.useMemo(() => {
        if (currentTxType === 'Claim' || currentTxType === 'ClaimAll' || currentTxType === 'Compound-Claim') {
            return false;
        }
        const _ca = Number(currentAmount);
        const _va = Number(availableAmount);
        if( isNaN(_ca) || isNaN(_va)) {
            return false;
        }
        if ( _ca > _va ) {
            return true;
        }
        return false;
    }, [ currentAmount, availableAmount, currentTxType ]);


    const isInputAmountValid = React.useMemo(() => {
        if (!inputStr) {
            return false;
        }
        if (isNaN(Number(inputStr)) || Number(inputStr) < 0 || Number(inputStr) === 0) {
            return false;
        }
        if (!currentTxType.includes('Claim') ) {
            if (Number(inputStr) > Number(availableAmount)) {
                return false;
            }
        }
        return true;
    } , [ inputStr, availableAmount, currentTxType ]);


    const isSelectedValidatorValid = React.useMemo(() => {
        if (currentTxType === 'ChooseStake' || currentTxType === 'MoveStake' || currentTxType === 'Compound-Stake') {

            if(!currentItem || !currentItem.validatorAddress) {
                return false;
            }
            if(currentTxType === 'MoveStake' && (
                currentToItem.validatorAddress === sourceValidatorAddress ||
                !currentToItem.validatorAddress)
            ) {
                return false;
            }
        }

        return true;
    }, [ currentItem, currentTxType , currentFromItem , currentToItem ]);


    const handleCloseDialog = useCallback(() => {
        if ( transactionStage === 'success' ) {
            callback && callback();
        }
    }, [ transactionStage, callback ]);

    const handleCloseModal = () => {
        setCurrentAmount("0.00");
        setInputStr("");
        refetchBalance();
        setAvailableAmount("0.00");
        setCurrentItem(null);
        onClose();
        handleCloseDialog();
    }

    const headsupText =  useMemo(() => {
        if (currentTxType === 'MoveStake' || currentTxType === 'ChooseStake') {
            return "If rewards are available, this action will claim all rewards from the current Validator and transfer them to your wallet.";
        } else if (currentTxType === 'Stake') {
            return "If rewards are available, this action will claim all rewards from the current Validator and transfer them to your wallet.";
        } else if (currentTxType === 'Withdraw') {
            return "It takes 1 days to receive MOCA after you withdraw. If rewards are available, this action will claim all rewards from the current Validator and transfer them to your wallet.";
        }
    } , [ currentTxType ]);

    return (
        <StakingModal 
            isOpen={ isOpen }
            onClose={ handleCloseModal }
            onOpen={ onOpen }
            title={ isSuccess ? " " : title }
            isSuccess={ isSuccess }
            extraDescription={ extraDescription }
        >
            { transactionStage === 'success' && (
                <SuccessfulContent 
                    text='Transaction Success'
                    txhash = { txhash || '' }
                    onClose={ () => {
                        handleCloseModal();
                    }}
                />
            )}
            <SetInput 
                value={ inputStr }
                setValue={ setInputStr  }
                currentAmount={ currentAmount }
                refetchBalance={ refetchBalance }
                userAddr={ userAddr }
            />
            { transactionStage === 'comfirming' && ( spinner ) }
            { (transactionStage !== 'success' && transactionStage !== 'comfirming') && (
                <>
                    <div style={{ maxHeight: '590px', marginBottom: '80px', overflowY: 'auto' }}>
                        {
                            (currentTxType === 'Claim' || currentTxType === 'ClaimAll' || currentTxType === 'Compound-Claim' ||  currentTxType === 'Compound-Stake') ? ( 
                                <Box width="100%" height="auto">
                                    <ReadOnlyInput 
                                        amount = { currentAmount}
                                        priceStr = { valueCalculator( currentAmount , tokenPrice || 0) }
                                    />
                                </Box>
                            ): (
                                <>
                                    { 
                                        selectable ? (
                                            ( currentTxType === 'MoveStake' ) ? (
                                                    <FromAndToSelect
                                                        FromItem = { currentItem }
                                                        currentToItem = { currentToItem }
                                                        isMyValidatorLoading = { isMyValidatorLoading }
                                                        isAllValidatorLoading = { isAllValidatorLoading }
                                                        setCurrentToItem = { setCurrentToItem }
                                                        setApr = { handleSetApr }
                                                        setCurrentFromAddress = { setCurrentFromAddress }
                                                        setCurrentToAddress = { setCurrentToAddress }
                                                        myValidatorsList = { myValidatorsList }
                                                        setCurrentAddress = { setCurrentAddress }
                                                        allValidatorsList = { allValidatorsList }
                                                    /> 
                                                ) : ( 
                                                    <WithTextWrapper text="Validators">
                                                        <StakingValidatorSelect 
                                                            isOpen={ isPopOverOpen }
                                                            onToggle={ handlePopOverToggle }
                                                            isMyValidatorLoading = { isMyValidatorLoading }
                                                            isAllValidatorLoading = { isAllValidatorLoading }
                                                            onClose={ handlePopOverClose }
                                                            setApr = { handleSetApr }
                                                            setCurrentAddress = { setCurrentAddress }
                                                            myValidatorsList={ myValidatorsList }
                                                            allValidatorsList={ allValidatorsList }
                                                            selectedValidator={ currentItem }
                                                            setSelectedValidator={ (validator: any) => setCurrentItem(validator) }
                                                        />
                                                    </WithTextWrapper>
                                            )
                                        ) : (
                                            <ValidatorItemBar
                                                showArrow={false}
                                                liveApr={ (Number(currentItem?.liveApr  || 0) * 100).toFixed(1) + '%' }
                                                validatorName = {currentItem?.validatorAddress || ''}
                                                validatorAvatar={null}
                                                validatorItem ={ currentItem || {}}
                                                onClick={() => {} }
                                            />
                                        )
                                    }

                                    <Flex
                                        flexDirection="column"
                                        justifyContent="flex-start"
                                        alignItems="flex-start"
                                        width="100%"
                                        gap="16px"
                                        marginTop="16px"
                                    >
                                        <Box width="100%" height="auto">
                                            <StakingModalNumberInput 
                                                value = { currentAmount }
                                                currentTxType = { currentTxType }
                                                handleMaxClick = { () => {
                                                    const _t = Math.floor(Number(availableAmount || 0) * 100) / 100;
                                                    setCurrentAmount(_t.toString());
                                                    setInputStr((_t.toString()));
                                                }}
                                                isOverAmount = { isOverAmount }
                                                setValue = { setCurrentAmount }
                                                inputStr = { inputStr }
                                                setInputStr = { setInputStr }
                                                availableAmount = { availableAmount }
                                            />
                                        </Box>
                                        {
                                            currentTxType !== 'Withdraw' && (
                                                <Box width="100%" height="auto">
                                                    <EarnInfoBox 
                                                        amount = { currentAmount }
                                                        apr = { apr }
                                                    />
                                                </Box>
                                            )
                                        }

                                        {
                                            (   currentTxType === 'Withdraw' || 
                                                currentTxType === 'Stake' || 
                                                currentTxType === 'MoveStake' || 
                                                currentTxType === 'ChooseStake'
                                            ) && (
                                                <Box width="100%" height="auto">
                                                    <HeadsUpInfo
                                                        label="Heads Up"
                                                        value= { headsupText }
                                                    />
                                                </Box>
                                            )
                                        }
                                    </Flex>
                                </>
                            )
                        }
                    </div>
                    <ModalFooterBtnGroup
                        onCancel={ handleCloseModal }
                        onConfirm={ (e) => {
                            handleSubmit(e);
                        }}
                        cancelText="Cancel"
                        confirmText= { ConfirmBtnText }
                        isSubmitting={ isSubmitting }
                        isDisabled={ !(isInputAmountValid && isSelectedValidatorValid) }
                    />
                </>
                )
            }   
        </StakingModal>
    )
}

export default CommonModal;
