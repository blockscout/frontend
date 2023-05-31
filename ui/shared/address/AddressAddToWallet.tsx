import { Box, chakra, Icon, Skeleton, Tooltip } from '@chakra-ui/react';
import React from 'react';

import type { TokenInfo } from 'types/api/token';

import appConfig from 'configs/app/config';
import useToast from 'lib/hooks/useToast';
import useProvider from 'lib/web3/useProvider';
import { WALLETS_INFO } from 'lib/web3/wallets';

interface Props {
  className?: string;
  token: TokenInfo;
  isLoading?: boolean;
}

const AddressAddToWallet = ({ className, token, isLoading }: Props) => {
  const toast = useToast();
  const provider = useProvider();

  const handleClick = React.useCallback(async() => {
    try {
      const wasAdded = await provider?.request?.({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20', // Initially only supports ERC20, but eventually more!
          options: {
            address: token.address,
            symbol: token.symbol || '',
            decimals: Number(token.decimals) || 18,
            // TODO: add token image when we have it in API
            // image: ''
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
  }, [ toast, token, provider ]);

  if (!provider) {
    return null;
  }

  if (isLoading) {
    return <Skeleton className={ className } boxSize={ 6 } borderRadius="base"/>;
  }

  const defaultWallet = appConfig.web3.defaultWallet;

  return (
    <Tooltip label={ `Add token to ${ WALLETS_INFO[defaultWallet].name }` }>
      <Box className={ className } display="inline-flex" cursor="pointer" onClick={ handleClick }>
        <Icon as={ WALLETS_INFO[defaultWallet].icon } boxSize={ 6 }/>
      </Box>
    </Tooltip>
  );
};

export default React.memo(chakra(AddressAddToWallet));
