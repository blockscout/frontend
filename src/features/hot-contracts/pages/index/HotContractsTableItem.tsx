// SPDX-License-Identifier: LicenseRef-Blockscout

import { HStack } from '@chakra-ui/react';
import { BigNumber } from 'bignumber.js';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';
import { Reputation } from 'src/slices/token/components/entity/TokenEntity';

import MetadataTags from 'src/features/address-metadata/components/tag/MetadataTags';
import { getVisibleProtocolTags } from 'src/features/address-metadata/utils/get-visible-protocol-tags';

import NativeCoinValue from 'src/shared/values/entity/NativeCoinValue';

import { TableCell, TableRow } from 'src/toolkit/chakra/table';
import { Truncate } from 'src/toolkit/components/truncation/Truncate';

interface Props {
  isLoading?: boolean;
  data: schemas['HotContract'];
  exchangeRate: string | null;
};

const HotContractsTableItem = ({
  isLoading,
  data,
  exchangeRate,
}: Props) => {
  const protocolTags = getVisibleProtocolTags(data?.contract_address?.metadata?.tags);

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
        { protocolTags.length > 0 && (
          <MetadataTags
            isLoading={ isLoading }
            tags={ protocolTags }
            mt="10px"
            noColors
          />
        ) }
      </TableCell>
      <TableCell isNumeric>
        <Truncate value={ Number(data.transactions_count).toLocaleString() } type="end" loading={ isLoading } maxW="100%"/>
      </TableCell>
      <TableCell isNumeric>
        <Truncate value={ BigNumber(data.total_gas_used || 0).toFormat() } type="end" loading={ isLoading } maxW="100%"/>
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
