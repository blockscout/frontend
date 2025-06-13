/* eslint-disable */

import StakingValidatorSelect from 'ui/staking/StakingValidatorSelect';
import WithTextWrapper from 'ui/staking/WithTextWrapper';
import React , { useMemo } from 'react';
import ValidatorItemBar from 'ui/staking/ValidatorItemBar';
import { garnet } from '@reown/appkit/networks';

const FromAndToSelect = ({
    FromItem,
    currentToItem,
    setCurrentToItem,
    setCurrentFromAddress,  
    myValidatorsList,
    allValidatorsList,
    setCurrentAddress,
    setCurrentToAddress,
    setApr,
    isMyValidatorLoading = false,
    isAllValidatorLoading = false,
}: {
    FromItem: any;
    currentToItem: any;
    setCurrentToItem: (item: any) => void;
    myValidatorsList: any[];
    setCurrentFromAddress: (address: string) => void;
    allValidatorsList: any[];
    setCurrentToAddress: (address: string) => void;
    setCurrentAddress: (address: string) => void;
    setApr: (apr: number | string) => void;
    isMyValidatorLoading?: boolean;
    isAllValidatorLoading?: boolean;
}) => {

    const [ isFromOpen, setFromIsOpen ] = React.useState(false);

    const [ isToOpen, setToIsOpen ] = React.useState(false);

    const onToToggle = () => {
        setFromIsOpen(false);
        setToIsOpen((prev) => !prev);
    }
    const onToClose = () => {
        setToIsOpen(false);
    }

    const CurrentItemfilteredArr = (arr: any[]) => {
        return arr.filter((item) => item.validatorAddress !== FromItem?.validatorAddress);
    }

    const _myValidatorsList = useMemo(() => {
        return CurrentItemfilteredArr(myValidatorsList);
    }, [ FromItem, myValidatorsList ]);

    const _allValidatorsList = useMemo(() => {
        return CurrentItemfilteredArr(allValidatorsList);
    }, [ FromItem, allValidatorsList ]);


    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '16px' }}>
            <WithTextWrapper text="From Validator">
                <ValidatorItemBar
                    showArrow={false} 
                    validatorItem={FromItem}
                    liveApr={ (Number(FromItem?.liveApr || 0) * 100).toFixed(1)   + '%' }
                    validatorName = {FromItem?.validatorAddress || ''}
                    validatorAvatar={null}
                    onClick={() => {} }
                />
            </WithTextWrapper>
            <WithTextWrapper text="To Validator">
                <StakingValidatorSelect 
                    myValidatorsList={ _myValidatorsList }
                    allValidatorsList={ _allValidatorsList }
                    selectedValidator={ currentToItem }
                    isOpen={ isToOpen }
                    setCurrentAddress ={ setCurrentAddress }
                    setApr={ setApr }
                    isMyValidatorLoading={ isMyValidatorLoading }
                    isAllValidatorLoading={ isAllValidatorLoading }
                    onToggle={ onToToggle }
                    onClose={ onToClose }
                    setSelectedValidator={ (validator: any) => {
                        setCurrentToItem(validator);
                        setCurrentAddress(validator?.validatorAddress);
                        setCurrentToAddress(validator?.validatorAddress);
                    } }
                />
            </WithTextWrapper>
        </div>
    );
}

export default FromAndToSelect;