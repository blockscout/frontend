import { Skeleton } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { AddressCounters } from 'types/api/address';

interface Props {
  prop: keyof AddressCounters;
  query: UseQueryResult<AddressCounters>;
}

const AddressCounterItem = ({ prop, query }: Props) => {
  if (query.isLoading) {
    return <Skeleton h={ 5 } w="80px" borderRadius="full"/>;
  }

  const data = query.data?.[prop];

  if (query.isError || data === null || data === undefined) {
    return <span>no data</span>;
  }

  switch (prop) {
    case 'gas_usage_count':
      return <span>{ BigNumber(data).toFormat() }</span>;
    case 'transactions_count':
    case 'token_transfers_count':
    case 'validations_count':
      return <span>{ Number(data).toLocaleString() }</span>;
  }
};

export default React.memo(AddressCounterItem);
