import { Box, chakra, Icon, Skeleton, Tooltip } from '@chakra-ui/react';
import React from 'react';

import type { TokenInfo } from 'types/api/token';

import config from 'configs/app';
import useToast from 'lib/hooks/useToast';
import * as mixpanel from 'lib/mixpanel/index';
import useProvider from 'lib/web3/useProvider';
import { WALLETS_INFO } from 'lib/web3/wallets';

const feature = config.features.web3Wallet;

interface Props {
  className?: string;
  token: TokenInfo;
  isLoading?: boolean;
}

const AddressAddToWallet = ({ className, token, isLoading }: Props) => {
  const toast = useToast();
  const { provider, wallet } = useProvider();

  const handleClick = React.useCallback(async() => {
    if (!wallet) {
      return;
    }

    try {
      const wasAdded = await provider?.request?.({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20', // Initially only supports ERC20, but eventually more!
          options: {
            address: token.address,
            symbol: token.symbol || '',
            decimals: Number(token.decimals) || 18,
            image: token.icon_url || '',
          },
        },
      });

      if (wasAdded) {
        toast({
          position: 'top-right',
          title: 'Success',
          description: 'Successfully added token to your wallet',
          status: 'success',
          variant: 'subtle',
          isClosable: true,
        });
        mixpanel.logEvent(mixpanel.EventTypes.ADD_TO_WALLET, {
          Target: 'token',
          Wallet: wallet,
          Token: token.symbol || '',
        });
      }
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
  }, [ toast, token, provider, wallet ]);

  if (!provider || !wallet) {
    return null;
  }

  if (isLoading) {
    return <Skeleton className={ className } boxSize={ 6 } borderRadius="base"/>;
  }

  if (!feature.isEnabled) {
    return null;
  }

  return (
    <Tooltip label={ `Add token to ${ WALLETS_INFO[wallet].name }` }>
      <Box className={ className } display="inline-flex" cursor="pointer" onClick={ handleClick }>
        <Icon as={ WALLETS_INFO[wallet].icon } boxSize={ 6 }/>
      </Box>
    </Tooltip>
  );
};

export default React.memo(chakra(AddressAddToWallet));
