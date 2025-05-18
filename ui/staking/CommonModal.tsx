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
import React from 'react';


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
    currentFromItem,
    currentAddress,
    currentFromAddress,
    setCurrentAddress,
    setCurrentFromAddress,
    setCurrentItem,
    currentToItem,
    setCurrentToItem = () => {},
    setCurrentToAddress = () => {},
    txhash,
}: {
    isOpen: boolean;
    isSubmitting: boolean;
    onClose: () => void;
    title: string;
    onSubmit: (targetAddress: string, txType: string, amount: string, target?: string) => void;
    onOpen: () => void;
    currentAmount: string;
    setCurrentAmount: (value: string) => void;
    currentTxType: txType;
    transactionStage: string;
    availableAmount: string;
    setAvailableAmount: (value: string) => void;
    extraDescription?: string | null;
    currentAddress?: string;
    currentItem?: any;
    currentToItem?: any;
    currentFromItem?: any;
    currentFromAddress?: string;
    setCurrentAddress: (value: string) => void;
    setCurrentFromAddress: (value: string) => void;
    setCurrentFromItem: (value: any) => void;
    setCurrentItem: (value: any) => void;
    setCurrentToItem ?: (value: any) => void;
    setCurrentToAddress ?: (value: string) => void;
    txhash?: string;
}) => {

    const [ loading, setLoading ] = React.useState<boolean>(false);

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

    const url = "http://192.168.0.97:8080";

    const selectable = React.useMemo(() => {
        if (currentTxType === 'ChooseStake' || currentTxType === 'MoveStake' || currentTxType === 'Compound-Stake') {
            return true;
        }
        return false;
    }, [ currentTxType ]);

    const { address: userAddr } = useAccount();

    const requestMyValidatorsList = React.useCallback(async() => {
        if ( !userAddr) {
            return;
        }
        try {
            setLoading(true);
            const param = new URLSearchParams();
            param.append('limit', '100');
            param.append('address', (userAddr || '').toLowerCase());
            const res = await (await fetch(url + '/api/me/staking/delegations?' + param.toString(), {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                },
            })).json() as  any;
            if(res && res.code === 200) {
                const _temp = (res.data.validators || []).map((item: any) => {
                    return {
                        ...item,
                        validatorAddress: item.validatorAddress,
                        liveApr: item.liveAPR,
                    }
                });
                setMyValidatorsList(_temp);
            }
            setLoading(false);
        } catch (error: any) {
            setLoading(false);
        }
    }, [ url , userAddr]);

    const requestAlValidatorsList = React.useCallback(async() => {
        try {
            setLoading(true);
            const param = new URLSearchParams();
            param.append('limit', '100');
            const res = await (await fetch(url + '/api/network/validators/list' + '?' + param.toString(), {
                headers: {
                    'Content-Type': 'application/json',
                },
            })).json() as  any;
            setLoading(false);
            if(res && res.code === 200) {
                const _temp = (res.data.validators || []).map((item: any) => {
                    return {
                        ...item,
                        liveApr: item.liveApr,
                        validatorAddress: item.validator,
                    }
                });
                setAllValidatorsList(_temp);
            }
        }
        catch (error: any) {
            setLoading(false);
        throw Error(error);
        }
    }
    , [ url ]);

    const handleCloseModal = () => {
        setCurrentAmount("0");
        onClose();
    }


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
            onSubmit(currentAddress, currentTxType, currentAmount);
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
                return 'Claim All';
            case 'MoveStake':
                return 'Move Stake';
            case 'Compound-Claim':
                return 'Claim';
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
    return (
        <StakingModal 
            isOpen={ isOpen }
            onClose={ handleCloseModal }
            onOpen={ onOpen }
            title={ isSuccess ? " " : title }
            isSuccess={ isSuccess }
            extraDescription={ extraDescription }
        >
            { isSuccess ? (
                <SuccessfulContent 
                    text='Transaction Success'
                    txhash = { txhash || '' }
                    onClose={ handleCloseModal }
                />
            ) : (
            <>
                <div style={{ maxHeight: '590px', marginBottom: '80px', overflowY: 'auto' }}>
                    {
                        (currentTxType === 'Claim' || currentTxType === 'ClaimAll' || currentTxType === 'Compound-Claim') ? (
                            <Box width="100%" height="auto">
                                <ReadOnlyInput 
                                    amount = { currentAmount }
                                    price = { currentAmount }
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
                                                    setCurrentToItem = { setCurrentToItem }
                                                    
                                                    setCurrentFromAddress = { setCurrentFromAddress }
                                                    setCurrentToAddress = { setCurrentToAddress }
                                                    myValidatorsList = { myValidatorsList }
                                                    allValidatorsList = { allValidatorsList }
                                                /> 
                                            ) : ( 
                                                <WithTextWrapper text="Validators">
                                                    <StakingValidatorSelect 
                                                        isOpen={ isPopOverOpen }
                                                        onToggle={ handlePopOverToggle }
                                                        onClose={ handlePopOverClose }
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
                                            setValue = { setCurrentAmount }
                                            availableAmount = { availableAmount }
                                        />
                                    </Box>
                                    {
                                        currentTxType !== 'Withdraw' && (
                                            <Box width="100%" height="auto">
                                                <EarnInfoBox 
                                                    apr = { "0.00" }
                                                />
                                            </Box>
                                        )
                                    }

                                    {
                                        currentTxType === 'Withdraw' && (
                                            <Box width="100%" height="auto">
                                                <HeadsUpInfo
                                                    label="Heads Up"
                                                    value="You will be charged a 10% fee on your earnings."
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
                    onConfirm={ (e) => handleSubmit(e) }
                    cancelText="Cancel"
                    confirmText= { ConfirmBtnText }
                    isSubmitting={ isSubmitting }
                    isDisabled={ false }
                />
            </>
            )
        }   
        </StakingModal>
    )
}

export default CommonModal;
