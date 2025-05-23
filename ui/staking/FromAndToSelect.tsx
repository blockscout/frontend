/* eslint-disable */

import StakingValidatorSelect from 'ui/staking/StakingValidatorSelect';
import WithTextWrapper from 'ui/staking/WithTextWrapper';
import React from 'react';
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
    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '16px' }}>
            <WithTextWrapper text="From Validator">
                <ValidatorItemBar
                    showArrow={false} 
                    liveApr={ (Number(FromItem?.liveApr || 0) * 100).toFixed(1)   + '%' }
                    validatorName = {FromItem?.validatorAddress || ''}
                    validatorAvatar={null}
                    onClick={() => {} }
                />
            </WithTextWrapper>
            <WithTextWrapper text="To Validator">
                <StakingValidatorSelect 
                    myValidatorsList={ myValidatorsList }
                    allValidatorsList={ allValidatorsList }
                    selectedValidator={ currentToItem }
                    isOpen={ isToOpen }
                    setApr={ setApr }
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