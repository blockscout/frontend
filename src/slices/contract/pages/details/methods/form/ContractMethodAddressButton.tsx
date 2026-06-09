// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import useAccount from 'src/features/connect-wallet/hooks/useAccount';

import { Button } from 'src/toolkit/chakra/button';
import { Tooltip } from 'src/toolkit/chakra/tooltip';

interface Props {
  onClick: (address: string) => void;
  isDisabled?: boolean;
}

const ContractMethodAddressButton = ({ onClick, isDisabled }: Props) => {
  const { address } = useAccount();

  const handleClick = React.useCallback(() => {
    address && onClick(address);
  }, [ address, onClick ]);

  return (
    <Tooltip content="Connect your wallet to enter your address." disabled={ Boolean(address) } disableOnMobile>
      <Button
        variant="subtle"
        size="xs"
        textStyle="md"
        fontWeight={ 500 }
        ml={ 1 }
        onClick={ handleClick }
        disabled={ isDisabled || !address }
      >
        Self
      </Button>
    </Tooltip>
  );
};

export default React.memo(ContractMethodAddressButton);
