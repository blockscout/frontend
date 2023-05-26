import { Tr, Td, Flex, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { AddressTokenBalance } from 'types/api/address';

import getCurrencyValue from 'lib/getCurrencyValue';
import AddressAddToWallet from 'ui/shared/address/AddressAddToWallet';
import AddressLink from 'ui/shared/address/AddressLink';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import TokenLogo from 'ui/shared/TokenLogo';

type Props = AddressTokenBalance & { isLoading: boolean };

const ERC20TokensTableItem = ({
  token,
  value,
  isLoading,
}: Props) => {

  const tokenString = [ token.name, token.symbol && `(${ token.symbol })` ].filter(Boolean).join(' ');

  const {
    valueStr: tokenQuantity,
    usd: tokenValue,
  } = getCurrencyValue({ value: value, exchangeRate: token.exchange_rate, decimals: token.decimals, accuracy: 8, accuracyUsd: 2 });

  return (
    <Tr>
      <Td verticalAlign="middle">
        <Flex alignItems="center">
          <TokenLogo data={ token } boxSize={ 6 } mr={ 2 } isLoading={ isLoading }/>
          <AddressLink fontWeight="700" hash={ token.address } type="token" alias={ tokenString } isLoading={ isLoading }/>
        </Flex>
      </Td>
      <Td verticalAlign="middle">
        <Flex alignItems="center" width="150px" justifyContent="space-between">
          <Flex alignItems="center">
            <AddressLink hash={ token.address } type="address" truncation="constant" isLoading={ isLoading }/>
            <CopyToClipboard text={ token.address } isLoading={ isLoading }/>
          </Flex>
          <AddressAddToWallet token={ token } ml={ 4 } isLoading={ isLoading }/>
        </Flex>
      </Td>
      <Td isNumeric verticalAlign="middle">
        <Skeleton isLoaded={ !isLoading } display="inline-block">
          { token.exchange_rate && `$${ token.exchange_rate }` }
        </Skeleton>
      </Td>
      <Td isNumeric verticalAlign="middle">
        <Skeleton isLoaded={ !isLoading } display="inline">
          { tokenQuantity }
        </Skeleton>
      </Td>
      <Td isNumeric verticalAlign="middle">
        <Skeleton isLoaded={ !isLoading } display="inline">
          { tokenValue && `$${ tokenValue }` }
        </Skeleton>
      </Td>
    </Tr>
  );
};

export default React.memo(ERC20TokensTableItem);
