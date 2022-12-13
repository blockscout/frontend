import { Box, chakra, Icon, Tooltip } from '@chakra-ui/react';
import React from 'react';

import type { TokenInfo } from 'types/api/tokenInfo';

import metamaskIcon from 'icons/metamask.svg';
import useToast from 'lib/hooks/useToast';

interface Props {
  className?: string;
  token: TokenInfo;
}

const AddressAddToMetaMask = ({ className, token }: Props) => {
  const toast = useToast();

  const handleClick = React.useCallback(async() => {
    try {
      const wasAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20', // Initially only supports ERC20, but eventually more!
          options: {
            address: token.address,
            symbol: token.symbol,
            decimals: Number(token.decimals) || 18,
          },
        },
      });

      if (wasAdded) {
        toast({
          position: 'top-right',
          title: 'Success',
          description: 'Successfully added token to MetaMask',
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
  }, [ toast, token ]);

  if (token.type !== 'ERC-20' || !('ethereum' in window)) {
    return null;
  }

  return (
    <Tooltip label="Add token to MetaMask">
      <Box className={ className } display="inline-flex" cursor="pointer" onClick={ handleClick }>
        <Icon as={ metamaskIcon } boxSize={ 6 }/>
      </Box>
    </Tooltip>
  );
};

export default React.memo(chakra(AddressAddToMetaMask));
