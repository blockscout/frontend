import { Flex, HStack } from '@chakra-ui/react';
import React from 'react';

import type { AddressTokensErc20Item } from './types';

import config from 'configs/app';
import multichainConfig from 'configs/multichain';
import getCurrencyValue from 'lib/getCurrencyValue';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import AddressAddToWallet from 'ui/shared/address/AddressAddToWallet';
import NativeTokenTag from 'ui/shared/celo/NativeTokenTag';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';

type Props = AddressTokensErc20Item & { isLoading: boolean };

const ERC20TokensTableItem = ({
  token,
  value,
  chain_values: chainValues,
  isLoading,
}: Props) => {

  const {
    valueStr: tokenQuantity,
    usd: tokenValue,
  } = getCurrencyValue({ value: value, exchangeRate: token.exchange_rate, decimals: token.decimals, accuracy: 8, accuracyUsd: 2 });

  const isNativeToken = config.UI.views.address.nativeTokenAddress &&
    token.address_hash.toLowerCase() === config.UI.views.address.nativeTokenAddress.toLowerCase();

  const chainInfo = React.useMemo(() => {
    if (!chainValues) {
      return;
    }

    const chainId = Object.keys(chainValues)[0];
    const chain = multichainConfig()?.chains.find((chain) => chain.id === chainId);
    return chain;
  }, [ chainValues ]);

  return (
    <TableRow role="group" >
      <TableCell verticalAlign="middle">
        <HStack gap={ 2 }>
          <TokenEntity
            token={ token }
            chain={ chainInfo }
            isLoading={ isLoading }
            noCopy
            jointSymbol
            fontWeight="700"
            width="auto"
          />
          { isNativeToken && <NativeTokenTag/> }
        </HStack>
      </TableCell>
      <TableCell verticalAlign="middle">
        <Flex alignItems="center" width="150px" justifyContent="space-between">
          <AddressEntity
            address={{ hash: token.address_hash }}
            isLoading={ isLoading }
            truncation="constant"
            noIcon
          />
          <AddressAddToWallet token={ token } ml={ 4 } isLoading={ isLoading } opacity="0" _groupHover={{ opacity: 1 }}/>
        </Flex>
      </TableCell>
      <TableCell isNumeric verticalAlign="middle">
        <Skeleton loading={ isLoading } display="inline-block" color={ isNativeToken ? 'text.secondary' : undefined }>
          { token.exchange_rate && `$${ Number(token.exchange_rate).toLocaleString() }` }
        </Skeleton>
      </TableCell>
      <TableCell isNumeric verticalAlign="middle">
        <Skeleton loading={ isLoading } display="inline" color={ isNativeToken ? 'text.secondary' : undefined }>
          { tokenQuantity }
        </Skeleton>
      </TableCell>
      <TableCell isNumeric verticalAlign="middle">
        <Skeleton loading={ isLoading } display="inline" color={ isNativeToken ? 'text.secondary' : undefined }>
          { tokenValue && `$${ tokenValue }` }
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(ERC20TokensTableItem);
