import { Alert, chakra, Link } from '@chakra-ui/react';
import { useWeb3Modal } from '@web3modal/react';
import React from 'react';
import { useAccount, useDisconnect } from 'wagmi';

import AddressIcon from 'ui/shared/address/AddressIcon';

const ContractConnectWallet = () => {
  const { isOpen, open } = useWeb3Modal();
  const { address, isDisconnected } = useAccount();
  const { disconnect } = useDisconnect();

  const handleConnect = React.useCallback(() => {
    open();
  }, [ open ]);

  const handleDisconnect = React.useCallback(() => {
    disconnect();
  }, [ disconnect ]);

  const content = (() => {
    if (isOpen) {
      return <span>connecting...</span>;
    }

    if (isDisconnected || !address) {
      return (
        <>
          <span>Disconnected.</span>
          <Link ml={ 1 } onClick={ handleConnect }>Connect wallet</Link>
        </>
      );
    }

    return (
      <>
        <span>Connected to </span>
        <AddressIcon address={{ hash: address, is_contract: false }} mx={ 2 }/>
        <chakra.span fontWeight={ 600 }>{ address }</chakra.span>
        <Link ml={ 2 } onClick={ handleDisconnect }>Disconnect</Link>
      </>
    );
  })();

  return <Alert mb={ 6 } status={ address ? 'success' : 'warning' }>{ content }</Alert>;
};

export default ContractConnectWallet;
