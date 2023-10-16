import { Box, chakra, Icon, IconButton, Skeleton, Tooltip } from '@chakra-ui/react';
import React from 'react';

import type { TokenInfo } from 'types/api/token';

import config from 'configs/app';
import useToast from 'lib/hooks/useToast';
import * as mixpanel from 'lib/mixpanel/index';
import useAddOrSwitchChain from 'lib/web3/useAddOrSwitchChain';
import useProvider from 'lib/web3/useProvider';
import { WALLETS_INFO } from 'lib/web3/wallets';

const feature = config.features.web3Wallet;

interface Props {
  className?: string;
  token: TokenInfo;
  isLoading?: boolean;
  variant?: 'icon' | 'button';
  iconSize?: number;
}

const AddressAddToWallet = ({ className, token, isLoading, variant = 'icon', iconSize = 6 }: Props) => {
  const toast = useToast();
  const { provider, wallet } = useProvider();
  const addOrSwitchChain = useAddOrSwitchChain();

  const handleClick = React.useCallback(async() => {
    if (!wallet) {
      return;
    }

    try {
      // switch to the correct network otherwise the token will be added to the wrong one
      await addOrSwitchChain();

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
  }, [ toast, token, provider, wallet, addOrSwitchChain ]);

  if (!provider || !wallet) {
    return null;
  }

  if (isLoading) {
    return <Skeleton className={ className } boxSize={ iconSize } borderRadius="base"/>;
  }

  if (!feature.isEnabled) {
    return null;
  }

  if (variant === 'button') {
    return (
      <Tooltip label={ `Add token to ${ WALLETS_INFO[wallet].name }` }>
        <IconButton
          className={ className }
          aria-label="Add token to wallet"
          variant="outline"
          size="sm"
          px="6px"
          onClick={ handleClick }
          icon={ <Icon as={ WALLETS_INFO[wallet].icon } boxSize={ 6 }/> }
          flexShrink={ 0 }
        />
      </Tooltip>
    );
  }

  return (
    <Tooltip label={ `Add token to ${ WALLETS_INFO[wallet].name }` }>
      <Box className={ className } display="inline-flex" cursor="pointer" onClick={ handleClick } flexShrink={ 0 }>
        <Icon as={ WALLETS_INFO[wallet].icon } boxSize={ iconSize }/>
      </Box>
    </Tooltip>
  );
};

export default React.memo(chakra(AddressAddToWallet));
