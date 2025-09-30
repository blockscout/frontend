import React from 'react';

import type { AllowanceType } from '../lib/types';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import EmptySearchResult from 'ui/shared/EmptySearchResult';

import ApprovalsTableItem from './ApprovalsTableItem';

// type SortField = 'valueAtRisk' | 'timestamp' | null;
// type SortDirection = 'asc' | 'desc' | null;

type Props = {
  selectedChainId: number;
  approvals: Array<AllowanceType>;
  isLoading?: boolean;
  isAddressMatch?: boolean;
};

export default function ApprovalsTable({
  selectedChainId,
  approvals,
  isLoading,
  isAddressMatch,
}: Props) {
  // const [sortField, setSortField] = useState<SortField>('timestamp');
  // const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // const handleSort = (field: SortField) => {
  //   if (field === "timestamp") {
  //     if (sortField === "timestamp") {
  //       setSortDirection(sortDirection === "desc" ? "asc" : "desc");
  //     } else {
  //       setSortField("timestamp");
  //       setSortDirection("desc");
  //     }
  //   } else {
  //     if (sortField === "valueAtRisk") {
  //       if (sortDirection === "desc") {
  //         setSortDirection("asc");
  //       } else if (sortDirection === "asc") {
  //         setSortField("timestamp");
  //         setSortDirection("desc");
  //       }
  //     } else {
  //       setSortField("valueAtRisk");
  //       setSortDirection("desc");
  //     }
  //   }
  // };

  // const sortedApprovals = useMemo(() => {
  //   if (!sortField) return approvals;

  //   return [...approvals].sort((a, b) => {
  //     const aValue =
  //       sortField === 'valueAtRisk' ? a.valueAtRiskUsd || 0 : a.timestamp;
  //     const bValue =
  //       sortField === 'valueAtRisk' ? b.valueAtRiskUsd || 0 : b.timestamp;

  //     return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
  //   });
  // }, [approvals, sortField, sortDirection]);

  return (
    <>
      <TableRoot>
        <TableHeaderSticky top={ 136 }>
          <TableRow>
            <TableColumnHeader w="40%">Token</TableColumnHeader>
            <TableColumnHeader w="170px">Approved spender</TableColumnHeader>
            <TableColumnHeader w="30%" isNumeric>
              Approved amount
            </TableColumnHeader>
            <TableColumnHeader w="30%" isNumeric>
              Value at risk
            </TableColumnHeader>
            <TableColumnHeader w={ isAddressMatch ? '30px' : '50px' }/>
            <TableColumnHeader w="170px">
              Last updated
            </TableColumnHeader>
            { isAddressMatch && <TableColumnHeader w="95px" isNumeric/> }
          </TableRow>
        </TableHeaderSticky>
        <TableBody>
          { approvals.map((approval, index) => (
            <ApprovalsTableItem
              key={ index }
              selectedChainId={ selectedChainId }
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
