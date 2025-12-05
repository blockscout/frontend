import { HStack } from '@chakra-ui/react';
import React from 'react';

import type { HotContract } from 'types/api/contracts';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import { Reputation } from 'ui/shared/entities/token/TokenEntity';
import EntityTags from 'ui/shared/EntityTags/EntityTags';

interface Props {
  isLoading?: boolean;
  data: HotContract;
};

const HotContractsTableItem = ({
  isLoading,
  data,
}: Props) => {
  const protocolTags = data?.contract_address?.metadata?.tags.filter(tag => tag.tagType === 'protocol');

  return (
    <TableRow>
      <TableCell>
        <HStack>
          <AddressEntity
            address={ data.contract_address }
            isLoading={ isLoading }
          />
          <Reputation value={ data.contract_address.reputation ?? null }/>
        </HStack>
        { protocolTags && protocolTags.length > 0 && (
          <EntityTags
            isLoading={ isLoading }
            tags={ protocolTags }
            mt="10px"
          />
        ) }
      </TableCell>
      <TableCell isNumeric>
        <Skeleton loading={ isLoading } display="inline-block">
          <span>{ data.transactions_count }</span>
        </Skeleton>
      </TableCell>
      <TableCell isNumeric>
        <Skeleton loading={ isLoading } display="inline-block">
          <span>{ data.total_gas_used }</span>
        </Skeleton>
      </TableCell>
      <TableCell isNumeric>
        <Skeleton loading={ isLoading } display="inline-block">
          <span>{ data.balance }</span>
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default HotContractsTableItem;
