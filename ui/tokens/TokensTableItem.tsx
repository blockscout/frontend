import { Box, Flex, Td, Tr, Text, Tag } from '@chakra-ui/react';
import React from 'react';

import type { TokenInfo } from 'types/api/token';

import getCurrencyValue from 'lib/getCurrencyValue';
import AddressAddToWallet from 'ui/shared/address/AddressAddToWallet';
import AddressLink from 'ui/shared/address/AddressLink';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import TokenLogo from 'ui/shared/TokenLogo';

type Props = {
  token: TokenInfo;
  index: number;
  page: number;
}

const PAGE_SIZE = 50;

const TokensTableItem = ({
  token,
  page,
  index,
}: Props) => {

  const {
    address,
    total_supply: totalSupply,
    exchange_rate: exchangeRate,
    type,
    name,
    symbol,
    decimals,
    holders,
  } = token;

  const totalValue = totalSupply !== null ? getCurrencyValue({ value: totalSupply, accuracy: 3, accuracyUsd: 2, exchangeRate, decimals }) : undefined;

  const tokenString = [ name, symbol && `(${ symbol })` ].filter(Boolean).join(' ');

  return (
    <Tr>
      <Td>
        <Flex>
          <Text
            fontSize="sm"
            lineHeight="24px"
            fontWeight={ 600 }
            mr={ 3 }
            minW="28px"
          >
            { (page - 1) * PAGE_SIZE + index + 1 }
          </Text>
          <Box>
            <Flex alignItems="center">
              <TokenLogo hash={ address } name={ name } boxSize={ 6 } mr={ 2 }/>
              <AddressLink fontSize="sm" fontWeight="700" hash={ address } type="token" alias={ tokenString }/>
            </Flex>
            <Flex alignItems="center" width="136px" justifyContent="space-between" ml={ 8 } mt={ 2 }>
              <Flex alignItems="center">
                <AddressLink fontSize="sm" hash={ address } type="address" truncation="constant" fontWeight={ 500 }/>
                <CopyToClipboard text={ address } ml={ 1 }/>
              </Flex>
              <AddressAddToWallet token={ token }/>
            </Flex>
            <Tag flexShrink={ 0 } ml={ 8 } mt={ 3 }>{ type }</Tag>
          </Box>
        </Flex>
      </Td>
      <Td isNumeric><Text fontSize="sm" lineHeight="24px" fontWeight={ 500 }>{ exchangeRate ? `$${ exchangeRate }` : '-' }</Text></Td>
      <Td isNumeric maxWidth="300px" width="300px">
        <Text fontSize="sm" lineHeight="24px" fontWeight={ 500 }>{ totalValue?.usd ? `$${ totalValue.usd }` : '-' }</Text>
      </Td>
      <Td isNumeric><Text fontSize="sm" lineHeight="24px" fontWeight={ 500 }>{ Number(holders).toLocaleString() }</Text></Td>
    </Tr>
  );
};

export default TokensTableItem;
