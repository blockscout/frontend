// SPDX-License-Identifier: LicenseRef-Blockscout

import { HStack } from '@chakra-ui/react';
import { BigNumber } from 'bignumber.js';
import React from 'react';

import type { HotContract } from 'client/features/hot-contracts/types/api';

import AddressEntity from 'client/slices/address/components/entity/AddressEntity';
import { Reputation } from 'client/slices/token/components/entity/TokenEntity';

import { TableCell, TableRow } from 'toolkit/chakra/table';
import { TruncatedText } from 'toolkit/components/truncation/TruncatedText';
import EntityTags from 'ui/shared/EntityTags/EntityTags';
import NativeCoinValue from 'ui/shared/value/NativeCoinValue';

interface Props {
  isLoading?: boolean;
  data: HotContract;
  exchangeRate: string | null;
};

const HotContractsTableItem = ({
  isLoading,
  data,
  exchangeRate,
}: Props) => {
  const protocolTags = data?.contract_address?.metadata?.tags?.filter(tag => tag.tagType === 'protocol');

  return (
    <TableRow>
      <TableCell>
        <HStack>
          <AddressEntity
            address={ data.contract_address }
            isLoading={ isLoading }
          />
          <Reputation value={ data.contract_address.reputation ?? null } ml={ 0 }/>
        </HStack>
        { protocolTags && protocolTags.length > 0 && (
          <EntityTags
            isLoading={ isLoading }
            tags={ protocolTags }
            mt="10px"
            noColors
          />
        ) }
      </TableCell>
      <TableCell isNumeric>
        <TruncatedText text={ Number(data.transactions_count).toLocaleString() } loading={ isLoading } maxW="100%"/>
      </TableCell>
      <TableCell isNumeric>
        <TruncatedText text={ BigNumber(data.total_gas_used || 0).toFormat() } loading={ isLoading } maxW="100%"/>
      </TableCell>
      <TableCell isNumeric>
        <NativeCoinValue
          amount={ data.balance }
          loading={ isLoading }
          exchangeRate={ exchangeRate }
          layout="vertical"
          rowGap="10px"
        />
      </TableCell>
    </TableRow>
  );
};

export default HotContractsTableItem;
