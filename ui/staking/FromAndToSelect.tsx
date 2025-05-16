/* eslint-disable */

import StakingValidatorSelect from 'ui/staking/StakingValidatorSelect';
import WithTextWrapper from 'ui/staking/WithTextWrapper';
import React from 'react';
import ValidatorItemBar from 'ui/staking/ValidatorItemBar';

const FromAndToSelect = ({
    FromItem,
    currentToItem,
    setCurrentToItem,
    setCurrentFromAddress,  
    myValidatorsList,
    allValidatorsList,
    setCurrentToAddress,
}: {
    FromItem: any;
    currentToItem: any;
    setCurrentToItem: (item: any) => void;
    myValidatorsList: any[];
    setCurrentFromAddress: (address: string) => void;
    allValidatorsList: any[];
    setCurrentToAddress: (address: string) => void;
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
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <WithTextWrapper text="From">
                <ValidatorItemBar
                    showArrow={false}
                    liveApr={ (Number(FromItem?.liveApr || 0) * 100 ) + '%' }
                    validatorName = {FromItem?.validatorAddress || ''}
                    validatorAvatar={null}
                    onClick={() => {} }
                />
            </WithTextWrapper>
            <WithTextWrapper text="To">
                <StakingValidatorSelect 
                    myValidatorsList={ myValidatorsList }
                    allValidatorsList={ allValidatorsList }
                    selectedValidator={ currentToItem }
                    isOpen={ isToOpen }
                    onToggle={ onToToggle }
                    onClose={ onToClose }
                    setSelectedValidator={ (validator: any) => {
                        console.log('setSelectedValidator', validator);
                        setCurrentToItem(validator);
                        setCurrentToAddress(validator?.validatorAddress);
                    } }
                />
            </WithTextWrapper>
        </div>
    );
}

export default FromAndToSelect;