import { Tr, Td, Flex } from '@chakra-ui/react';
import React from 'react';

import type { AddressTokenBalance } from 'types/api/address';

import getCurrencyValue from 'lib/getCurrencyValue';
import AddressAddToWallet from 'ui/shared/address/AddressAddToWallet';
import AddressLink from 'ui/shared/address/AddressLink';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import TokenLogo from 'ui/shared/TokenLogo';

type Props = AddressTokenBalance;

const TokensTableItem = ({
  token,
  value,
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
          <TokenLogo hash={ token.address } name={ token.name } boxSize={ 6 } mr={ 2 }/>
          <AddressLink fontWeight="700" hash={ token.address } type="token" alias={ tokenString }/>
        </Flex>
      </Td>
      <Td verticalAlign="middle">
        <Flex alignItems="center" width="150px" justifyContent="space-between">
          <Flex alignItems="center">
            <AddressLink hash={ token.address } type="address" truncation="constant"/>
            <CopyToClipboard text={ token.address } ml={ 1 }/>
          </Flex>
          <AddressAddToWallet token={ token } ml={ 4 }/>
        </Flex>
      </Td>
      <Td isNumeric verticalAlign="middle">
        { token.exchange_rate && `$${ token.exchange_rate }` }
      </Td>
      <Td isNumeric verticalAlign="middle">
        { tokenQuantity }
      </Td>
      <Td isNumeric verticalAlign="middle">
        { tokenValue && `$${ tokenValue }` }
      </Td>
    </Tr>
  );
};

export default React.memo(TokensTableItem);
