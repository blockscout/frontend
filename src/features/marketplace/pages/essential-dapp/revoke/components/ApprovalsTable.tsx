// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { AllowanceType } from '../types';
import type { EssentialDappsChainConfig } from 'src/features/marketplace/types/client';

import TimeFormatToggle from 'src/shared/date-and-time/TimeFormatToggle';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import ApprovalsTableItem from './ApprovalsTableItem';

type Props = {
  selectedChain: EssentialDappsChainConfig | undefined;
  approvals: Array<AllowanceType>;
  isLoading?: boolean;
  isAddressMatch?: boolean;
  hideApproval: (approval: AllowanceType) => void;
  tableHeaderTop: number;
};

export default function ApprovalsTable({
  selectedChain,
  approvals,
  isLoading,
  isAddressMatch,
  hideApproval,
  tableHeaderTop,
}: Props) {
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
        { approvals.map((approval, index) => (
          <ApprovalsTableItem
            key={ index }
            selectedChain={ selectedChain }
            approval={ approval }
            isLoading={ isLoading }
            isAddressMatch={ isAddressMatch }
            hideApproval={ hideApproval }
          />
        )) }
      </TableBody>
    </TableRoot>
  );
}
