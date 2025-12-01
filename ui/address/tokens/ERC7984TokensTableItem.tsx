import { Flex, HStack } from '@chakra-ui/react';
import React from 'react';

import type { AddressTokenBalance } from 'types/api/address';

import config from 'configs/app';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import AddressAddToWallet from 'ui/shared/address/AddressAddToWallet';
import NativeTokenTag from 'ui/shared/celo/NativeTokenTag';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';

type Props = AddressTokenBalance & { isLoading: boolean };

const celoFeature = config.features.celo;

const ERC7984TokensTableItem = ({
  token,
  isLoading,
}: Props) => {

  const isNativeToken = celoFeature.isEnabled && token.address_hash.toLowerCase() === celoFeature.nativeTokenAddress?.toLowerCase();

  return (
    <TableRow role="group" >
      <TableCell verticalAlign="middle">
        <HStack gap={ 2 }>
          <TokenEntity
            token={ token }
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
          •••••
        </Skeleton>
      </TableCell>
      <TableCell isNumeric verticalAlign="middle">
        <Skeleton loading={ isLoading } display="inline" color={ isNativeToken ? 'text.secondary' : undefined }>
          •••••
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(ERC7984TokensTableItem);
