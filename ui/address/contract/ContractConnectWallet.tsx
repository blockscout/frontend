import { Alert, Button, chakra } from '@chakra-ui/react';
import { useWeb3Modal } from '@web3modal/react';
import React from 'react';
import { useAccount, useDisconnect } from 'wagmi';

import AddressIcon from 'ui/shared/address/AddressIcon';

const ContractConnectWallet = () => {
  const { open } = useWeb3Modal();
  const { address, isDisconnected } = useAccount();
  const { disconnect } = useDisconnect();

  const handleConnect = React.useCallback(() => {
    open();
  }, [ open ]);

  const handleDisconnect = React.useCallback(() => {
    disconnect();
  }, [ disconnect ]);

  const content = (() => {
    if (isDisconnected || !address) {
      return (
        <>
          <span>Disconnected</span>
          <Button ml={ 3 } onClick={ handleConnect } size="sm" variant="outline">Connect wallet</Button>
        </>
      );
    }

    return (
      <>
        <span>Connected to </span>
        <AddressIcon address={{ hash: address, is_contract: false }} mx={ 2 }/>
        <chakra.span fontWeight={ 600 }>{ address }</chakra.span>
        <Button ml={ 3 } onClick={ handleDisconnect } size="sm" variant="outline">Disconnect</Button>
      </>
    );
  })();

  return <Alert mb={ 6 } status={ address ? 'success' : 'warning' }>{ content }</Alert>;
};

export default ContractConnectWallet;
