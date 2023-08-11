import { Button, Icon, chakra } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import useToast from 'lib/hooks/useToast';
import useProvider from 'lib/web3/useProvider';
import { WALLETS_INFO } from 'lib/web3/wallets';

const feature = config.features.web3Wallet;

interface Props {
  className?: string;
}

const NetworkAddToWallet = ({ className }: Props) => {
  const toast = useToast();
  const provider = useProvider();

  const handleClick = React.useCallback(async() => {
    try {
      const hexadecimalChainId = '0x' + Number(config.chain.id).toString(16);
      const params = {
        method: 'wallet_addEthereumChain',
        params: [ {
          chainId: hexadecimalChainId,
          chainName: config.chain.name,
          nativeCurrency: {
            name: config.chain.currency.name,
            symbol: config.chain.currency.symbol,
            decimals: config.chain.currency.decimals,
          },
          rpcUrls: [ config.chain.rpcUrl ],
          blockExplorerUrls: [ config.app.baseUrl ],
        } ],
      // in wagmi types for wallet_addEthereumChain method is not provided
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;
      await provider?.request?.(params);
      toast({
        position: 'top-right',
        title: 'Success',
        description: 'Successfully added network to your wallet',
        status: 'success',
        variant: 'subtle',
        isClosable: true,
      });
    } catch (error) {
      toast({
        position: 'top-right',
        title: 'Error',
        description: (error as Error)?.message || 'Something went wrong',
        status: 'error',
        variant: 'subtle',
        isClosable: true,
      });
    }
  }, [ provider, toast ]);

  if (!provider || !config.chain.rpcUrl || !feature.isEnabled) {
    return null;
  }

  return (
    <Button variant="outline" size="sm" onClick={ handleClick } className={ className }>
      <Icon as={ WALLETS_INFO[feature.defaultWallet].icon } boxSize={ 5 } mr={ 2 }/>
        Add { config.chain.name }
    </Button>
  );
};

export default React.memo(chakra(NetworkAddToWallet));
