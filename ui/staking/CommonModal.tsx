/* eslint-disable */

import { Box, Grid, Flex, Button,  Text } from '@chakra-ui/react';
import StakingModal from './StakingModal';
import StakingValidatorSelect from 'ui/staking/StakingValidatorSelect';
import StakingModalNumberInput from 'ui/staking/StakingModalNumberInput';
import SuccessfulContent from 'ui/stakingModal/SuccessfulContent';
import EarnInfoBox from 'ui/staking/EarnInfoBox';
import HeadsUpInfo from 'ui/staking/HeadsUpInfo';
import ModalFooterBtnGroup from 'ui/staking/ModalFooterBtnGroup';
import React from 'react';

const CommonModal = ({
    isOpen,
    onClose,
    title,
    content,
    onSubmit,
    onOpen,
    isSuccess,
    currentAmount,
    setCurrentAmount,
    currentTxType
}: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: string;
    onSubmit: () => void;
    onOpen: () => void;
    isSuccess: boolean;
    currentAmount: string;
    setCurrentAmount: (value: string) => void;
    currentTxType: string;
}) => {

    const  [ loading, setLoading ] = React.useState<boolean>(false);

    const [ myValidatorsList, setMyValidatorsList ] = React.useState<any[]>([]);
    const [ allValidatorsList, setTableDataList ] = React.useState<any[]>([]);

    const url = "http://192.168.0.97:8080";

    const requestMyValidatorsList = React.useCallback(async() => {
        try {
            setLoading(true);
            const res = await (await fetch(url + '/api/me/staking/delegations', { 
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                },
            })).json() as  any;
            if(res && res.code === 200) {
                console.log('res', res);
                // setMyValidatorsList(res.data.delegations);
            }
            setLoading(false);
        } catch (error: any) {
            setLoading(false);
        }
    }, [ url ]);

    const requestAlValidatorsList = React.useCallback(async() => {
        try {
            setLoading(true);
        const res = await (await fetch(url + '/api/network/validators/list', { method: 'get' })).json() as any
            setLoading(false);
        if(res && res.code === 200) {
            setTableDataList(res.data.validators);
        }
        }
        catch (error: any) {
            setLoading(false);
        throw Error(error);
        }
    }
    , [ url ]);


    React.useEffect(() => {
        requestMyValidatorsList();
        requestAlValidatorsList();
    }, [ requestMyValidatorsList, requestAlValidatorsList ]);

    return (
        <StakingModal isOpen={ isOpen } onClose={ onClose } onOpen={ onOpen } title={ isSuccess ? " " : title }>
            { isSuccess ? (
                <SuccessfulContent text='Transaction Success' />    
            ) : (
            <>
                <div style={{ maxHeight: '590px', marginBottom: '80px', overflowY: 'auto' }}>
                    <StakingValidatorSelect />
                    <Flex
                        flexDirection="column"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        width="100%"
                        gap="16px"
                        marginTop="16px"
                    >
                        <Box width="100%" height="auto">
                            <StakingModalNumberInput value = { currentAmount } setValue = { setCurrentAmount } />
                        </Box>
                        <Box width="100%" height="auto">
                            <EarnInfoBox 
                                yearlyEarnings = { 0 }
                                monthlyEarnings = { 0 }
                                dailyEarnings = { 0 }
                            />
                        </Box>
                        {/* <Box width="100%" height="auto">
                            <HeadsUpInfo
                                label="Heads Up"
                                value="You will be charged a 10% fee on your earnings."
                            />
                        </Box> */}
                    </Flex>
                </div>
                <ModalFooterBtnGroup
                    onCancel={ onClose }
                    onConfirm={ onClose }
                    cancelText="Cancel"
                    confirmText="Confirm"
                    isSubmitting={ false }
                    isDisabled={ false }
                />
            </>
            )
        }   
        </StakingModal>
    )
}

export default CommonModal;
