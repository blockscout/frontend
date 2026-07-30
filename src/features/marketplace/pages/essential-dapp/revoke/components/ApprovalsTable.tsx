// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { AllowanceType } from '../types';
import type { EssentialDappsChainConfig } from 'src/features/marketplace/types/client';

import TimeFormatToggle from 'src/shared/date-and-time/TimeFormatToggle';
import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import ApprovalsTableItem from './ApprovalsTableItem';

type Props = {
  selectedChain: EssentialDappsChainConfig | undefined;
  approvals: Array<AllowanceType>;
  isLoading?: boolean;
  isAddressMatch?: boolean;
  hideApproval: (approval: AllowanceType) => void;
  tableHeaderTop: number;
  resetKey?: string;
};

export default function ApprovalsTable({
  selectedChain,
  approvals,
  isLoading,
  isAddressMatch,
  hideApproval,
  tableHeaderTop,
  resetKey,
}: Props) {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: approvals, isEnabled: !isLoading, resetKey });

  return (
    <TableRoot>
      <TableHeaderSticky top={ tableHeaderTop }>
        <TableRow>
          <TableColumnHeader w="30%">Token</TableColumnHeader>
          <TableColumnHeader w="15%">Approved spender</TableColumnHeader>
          <TableColumnHeader w="20%" isNumeric>
            Approved amount
          </TableColumnHeader>
          <TableColumnHeader w="17%" isNumeric>
            Value at risk
          </TableColumnHeader>
          <TableColumnHeader w={ isAddressMatch ? '30px' : '50px' }/>
          <TableColumnHeader w="18%">
            Last updated
            <TimeFormatToggle/>
          </TableColumnHeader>
          { isAddressMatch && <TableColumnHeader w="95px" isNumeric/> }
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { approvals.slice(0, renderedItemsNum).map((approval, index) => (
          <ApprovalsTableItem
            key={ index }
            selectedChain={ selectedChain }
            approval={ approval }
            isLoading={ isLoading }
            isAddressMatch={ isAddressMatch }
            hideApproval={ hideApproval }
          />
        )) }
        <TableRow ref={ cutRef }/>
      </TableBody>
    </TableRoot>
  );
}
