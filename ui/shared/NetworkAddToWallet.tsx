import { Box, Icon, Tooltip, chakra } from '@chakra-ui/react';
import React from 'react';

import appConfig from 'configs/app/config';
import useToast from 'lib/hooks/useToast';
import useProvider from 'lib/web3/useProvider';
import { WALLETS_INFO } from 'lib/web3/wallets';

interface Props {
  className?: string;
}

const NetworkAddToWallet = ({ className }: Props) => {
  const toast = useToast();
  const provider = useProvider();

  const handleClick = React.useCallback(async() => {
    try {
      const hexadecimalChainId = '0x' + Number(appConfig.network.id).toString(16);
      const config = {
        method: 'wallet_addEthereumChain',
        params: [ {
          chainId: hexadecimalChainId,
          chainName: appConfig.network.name,
          nativeCurrency: {
            name: appConfig.network.currency.name,
            symbol: appConfig.network.currency.symbol,
            decimals: appConfig.network.currency.decimals,
          },
          rpcUrls: [ appConfig.network.rpcUrl ],
          blockExplorerUrls: [ appConfig.baseUrl ],
        } ],
      };
      await provider?.request?.(config);
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

  if (!provider) {
    return null;
  }

  const defaultWallet = appConfig.web3.defaultWallet;

  return (
    <Tooltip label={ WALLETS_INFO[defaultWallet].add_network_text }>
      <Box className={ className } display="inline-flex" cursor="pointer" onClick={ handleClick }>
        <Icon as={ WALLETS_INFO[defaultWallet].icon } boxSize={ 5 }/>
      </Box>
    </Tooltip>
  );
};

export default React.memo(chakra(NetworkAddToWallet));
