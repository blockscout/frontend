import React from 'react';

import type { AllowanceType } from '../lib/types';
import type { ChainConfig } from 'types/multichain';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import EmptySearchResult from 'ui/shared/EmptySearchResult';

import ApprovalsTableItem from './ApprovalsTableItem';

type Props = {
  selectedChain: ChainConfig | undefined;
  approvals: Array<AllowanceType>;
  isLoading?: boolean;
  isAddressMatch?: boolean;
};

export default function ApprovalsTable({
  selectedChain,
  approvals,
  isLoading,
  isAddressMatch,
}: Props) {
  return (
    <>
      <TableRoot>
        <TableHeaderSticky top={ 136 }>
          <TableRow>
            <TableColumnHeader w="30%">Token</TableColumnHeader>
            <TableColumnHeader w="15%">Approved spender</TableColumnHeader>
            <TableColumnHeader w="20%" isNumeric>
              Approved amount
            </TableColumnHeader>
            <TableColumnHeader w="20%" isNumeric>
              Value at risk
            </TableColumnHeader>
            <TableColumnHeader w={ isAddressMatch ? '30px' : '50px' }/>
            <TableColumnHeader w="15%">
              Last updated
            </TableColumnHeader>
            { isAddressMatch && <TableColumnHeader w="95px" isNumeric/> }
          </TableRow>
        </TableHeaderSticky>
        <TableBody>
          { approvals.map((approval, index) => (
            <ApprovalsTableItem
              key={ index }
              selectedChain={ selectedChain }
              approval={ approval }
              isLoading={ isLoading }
              isAddressMatch={ isAddressMatch }
            />
          )) }
        </TableBody>
      </TableRoot>
      { !isLoading && !approvals.length && (
        <EmptySearchResult text="No approvals found"/>
      ) }
    </>
  );
}
