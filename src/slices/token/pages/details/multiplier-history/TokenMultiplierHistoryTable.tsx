// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import { getUiMultiplierChangeStatuses } from 'src/slices/token/utils/ui-multiplier';

import TimeFormatToggle from 'src/shared/date-and-time/TimeFormatToggle';
import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import { TableBody, TableColumnHeader, TableContainerScrollable, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import TokenMultiplierHistoryTableItem from './TokenMultiplierHistoryTableItem';

interface Props {
  data: Array<schemas['TokenUIMultiplierChange']>;
  page: number;
  top?: number;
  isLoading?: boolean;
  resetKey?: string;
}

const TokenMultiplierHistoryTable = ({ data, page, top, isLoading, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: data, isEnabled: !isLoading, resetKey });
  const statuses = React.useMemo(() => getUiMultiplierChangeStatuses(data, page), [ data, page ]);

  return (
    <>
      <TableContainerScrollable>
        <TableRoot minW="1000px">
          <TableHeaderSticky top={ top }>
            <TableRow>
              <TableColumnHeader width="20%">Txn hash</TableColumnHeader>
              <TableColumnHeader width="16%">
                Timestamp
                <TimeFormatToggle/>
              </TableColumnHeader>
              <TableColumnHeader width="14%">Block</TableColumnHeader>
              <TableColumnHeader width="18%">Multiplier</TableColumnHeader>
              <TableColumnHeader width="20%">
                Activation date
                <TimeFormatToggle/>
              </TableColumnHeader>
              <TableColumnHeader width="12%">Status</TableColumnHeader>
            </TableRow>
          </TableHeaderSticky>
          <TableBody>
            { data.slice(0, renderedItemsNum).map((item, index) => (
              <TokenMultiplierHistoryTableItem
                key={ `${ item.block_number }-${ item.log_index }` + (isLoading ? String(index) : '') }
                data={ item }
                status={ statuses[index] }
                page={ page }
                isLoading={ isLoading }
              />
            )) }
          </TableBody>
        </TableRoot>
      </TableContainerScrollable>
      <Box ref={ cutRef } h={ 0 }/>
    </>
  );
};

export default React.memo(TokenMultiplierHistoryTable);
