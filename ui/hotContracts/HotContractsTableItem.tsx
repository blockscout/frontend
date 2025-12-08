import { HStack } from '@chakra-ui/react';
import { BigNumber } from 'bignumber.js';
import React from 'react';

import type { HotContract } from 'types/api/contracts';

import { TableCell, TableRow } from 'toolkit/chakra/table';
import { TruncatedText } from 'toolkit/components/truncation/TruncatedText';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import { Reputation } from 'ui/shared/entities/token/TokenEntity';
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
      <TableCell verticalAlign="middle">
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
          />
        ) }
      </TableCell>
      <TableCell isNumeric verticalAlign="middle">
        <TruncatedText text={ Number(data.transactions_count).toLocaleString() } loading={ isLoading } maxW="100%"/>
      </TableCell>
      <TableCell isNumeric verticalAlign="middle">
        <TruncatedText text={ BigNumber(data.total_gas_used || 0).toFormat() } loading={ isLoading } maxW="100%"/>
      </TableCell>
      <TableCell isNumeric verticalAlign="middle">
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
