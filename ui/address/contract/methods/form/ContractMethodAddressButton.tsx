import { Button, Tooltip } from '@chakra-ui/react';
import React from 'react';

import useAccount from 'lib/web3/useAccount';

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
    <Tooltip label={ !address ? 'Connect your wallet to enter your address.' : undefined }>
      <Button
        variant="subtle"
        colorScheme="gray"
        size="xs"
        fontSize="normal"
        fontWeight={ 500 }
        ml={ 1 }
        onClick={ handleClick }
        isDisabled={ isDisabled || !address }
      >
        Self
      </Button>
    </Tooltip>
  );
};

export default React.memo(ContractMethodAddressButton);
