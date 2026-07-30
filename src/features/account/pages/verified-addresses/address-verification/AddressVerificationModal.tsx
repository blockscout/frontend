// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { AddressVerificationFormFirstStepFields } from './types';
import type * as contractsInfo from '@blockscout/contracts-info-types';

import config from 'src/config';
import * as mixpanel from 'src/services/mixpanel';

import { DialogBody, DialogContent, DialogHeader, DialogRoot } from 'src/toolkit/chakra/dialog';

import AddressVerificationStepAddress from './steps/AddressVerificationStepAddress';
import AddressVerificationStepSignature from './steps/AddressVerificationStepSignature';
import AddressVerificationStepSuccess from './steps/AddressVerificationStepSuccess';

type StateData = AddressVerificationFormFirstStepFields & contractsInfo.PrepareAddressResponse_Success & { isToken?: boolean };

interface Props {
  open: boolean;
  onOpenChange: ({ open }: { open: boolean }) => void;
  onSubmit: (address: contractsInfo.VerifiedAddress) => void;
  onAddTokenInfoClick: (address: string) => void;
  onShowListClick: () => void;
  defaultAddress?: string;
  pageType: string;
}

const AddressVerificationModal = ({ defaultAddress, open, onOpenChange, onSubmit, onAddTokenInfoClick, onShowListClick, pageType }: Props) => {
  const [ stepIndex, setStepIndex ] = React.useState(0);
  const [ data, setData ] = React.useState<StateData>({ address: '', signingMessage: '', contractCreator: '' });

  React.useEffect(() => {
    open && mixpanel.logEvent(
      mixpanel.EventTypes.VERIFY_ADDRESS,
      { Action: 'Form opened', 'Page type': pageType },
    );
  }, [ open, pageType ]);

  const handleGoToSecondStep = React.useCallback((firstStepResult: typeof data) => {
    setData(firstStepResult);
    setStepIndex((prev) => prev + 1);
    mixpanel.logEvent(
      mixpanel.EventTypes.VERIFY_ADDRESS,
      { Action: 'Address entered', 'Page type': pageType },
    );
  }, [ pageType ]);

  const handleGoToThirdStep = React.useCallback((address: contractsInfo.VerifiedAddress, signMethod: 'wallet' | 'manual') => {
    onSubmit(address);
    setStepIndex((prev) => prev + 1);
    setData((prev) => ({ ...prev, isToken: Boolean(address.metadata?.tokenName) }));
    mixpanel.logEvent(
      mixpanel.EventTypes.VERIFY_ADDRESS,
      { Action: 'Sign ownership', 'Page type': pageType, 'Sign method': signMethod },
    );
  }, [ onSubmit, pageType ]);

  const handleGoToPrevStep = React.useCallback(() => {
    setStepIndex((prev) => prev - 1);
  }, []);

  const handleOpenChange = React.useCallback(({ open }: { open: boolean }) => {
    onOpenChange({ open });
    if (!open) {
      setStepIndex(0);
      setData({ address: '', signingMessage: '', contractCreator: '' });
    }
  }, [ onOpenChange ]);

  const handleAddTokenInfoClick = React.useCallback(() => {
    onAddTokenInfoClick(data.address);
    handleOpenChange({ open: false });
  }, [ handleOpenChange, data.address, onAddTokenInfoClick ]);

  const steps = [
    {
      title: 'Verify new address ownership',
      content: <AddressVerificationStepAddress onContinue={ handleGoToSecondStep } defaultAddress={ defaultAddress }/>,
    },
    {
      title: 'Copy and sign message',
      content: (
        <AddressVerificationStepSignature
          { ...data }
          onContinue={ handleGoToThirdStep }
          noWeb3Provider={ !config.features.connectWallet.isEnabled }
        />
      ),
    },
    {
      title: 'Congrats! Address is verified.',
      content: (
        <AddressVerificationStepSuccess
          onShowListClick={ onShowListClick }
          onAddTokenInfoClick={ handleAddTokenInfoClick }
          isToken={ data.isToken }
          address={ data.address }
        />
      ),
    },
  ];
  const step = steps[stepIndex];

  return (
    <DialogRoot
      open={ open }
      onOpenChange={ handleOpenChange }
      size={{ lgDown: 'full', lg: 'md' }}
      closeOnInteractOutside={ false }
      modal={ false }
      trapFocus={ false }
      preventScroll={ false }
    >
      <DialogContent>
        <DialogHeader onBackToClick={ stepIndex !== 0 ? handleGoToPrevStep : undefined }>
          { step.title }
        </DialogHeader>
        <DialogBody mb={ 0 }>
          { /* The signature step reads the wallet through the Bridge hub + `getWeb3Runtime()` actions
            (no wagmi React hooks), so no root/scoped wallet provider is needed here. */ }
          { step.content }
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default React.memo(AddressVerificationModal);
