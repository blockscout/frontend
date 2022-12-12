import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { Address } from 'types/api/address';

import AddressCoinBalanceChart from './coinBalance/AddressCoinBalanceChart';
import AddressCoinBalanceHistory from './coinBalance/AddressCoinBalanceHistory';

interface Props {
  addressQuery: UseQueryResult<Address>;
}

const AddressCoinBalance = ({ addressQuery }: Props) => {
  return (
    <>
      <AddressCoinBalanceChart/>
      <AddressCoinBalanceHistory addressQuery={ addressQuery }/>
    </>
  );
};

export default React.memo(AddressCoinBalance);
