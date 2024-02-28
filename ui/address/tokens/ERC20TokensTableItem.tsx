import { Tr, Td, Flex, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { AddressTokenBalance } from 'types/api/address';

import getCurrencyValue from 'lib/getCurrencyValue';
import AddressAddToWallet from 'ui/shared/address/AddressAddToWallet';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';

type Props = AddressTokenBalance & { isLoading: boolean };

const ERC20TokensTableItem = ({
  token,
  value,
  isLoading,
}: Props) => {

  const {
    valueStr: tokenQuantity,
    usd: tokenValue,
  } = getCurrencyValue({ value: value, exchangeRate: token.exchange_rate, decimals: token.decimals, accuracy: 8, accuracyUsd: 2 });

  return (
    <Tr
      sx={{
        '&:hover [aria-label="Add token to wallet"]': {
          opacity: 1,
        },
      }}
    >
      <Td verticalAlign="middle">
        <TokenEntity
          token={ token }
          isLoading={ isLoading }
          noCopy
          jointSymbol
          fontWeight="700"
        />
      </Td>
      <Td verticalAlign="middle">
        <Flex alignItems="center" width="150px" justifyContent="space-between">
          <AddressEntity
            address={{ hash: token.address }}
            isLoading={ isLoading }
            truncation="constant"
            noIcon
          />
          <AddressAddToWallet token={ token } ml={ 4 } isLoading={ isLoading } opacity="0"/>
        </Flex>
      </Td>
      <Td isNumeric verticalAlign="middle">
        <Skeleton isLoaded={ !isLoading } display="inline-block">
          { token.exchange_rate && `$${ Number(token.exchange_rate).toLocaleString() }` }
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
