import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { AddressTokenBalance } from 'types/api/address';

import getCurrencyValue from 'lib/getCurrencyValue';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
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
    <TableRow role="group" >
      <TableCell verticalAlign="middle">
        <TokenEntity
          token={ token }
          isLoading={ isLoading }
          noCopy
          jointSymbol
          fontWeight="700"
        />
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
        <Skeleton loading={ isLoading } display="inline-block">
          { token.exchange_rate && `$${ Number(token.exchange_rate).toLocaleString() }` }
        </Skeleton>
      </TableCell>
      <TableCell isNumeric verticalAlign="middle">
        <Skeleton loading={ isLoading } display="inline">
          { tokenQuantity }
        </Skeleton>
      </TableCell>
      <TableCell isNumeric verticalAlign="middle">
        <Skeleton loading={ isLoading } display="inline">
          { tokenValue && `$${ tokenValue }` }
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(ERC20TokensTableItem);
