// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { CrossChainBridgedTokensSortingValue, CrossChainBridgedTokensSortingField } from '../../types/api';
import type { ChainInfo, StatsBridgedTokenRow } from '@blockscout/interchain-indexer-types';
import { BridgedTokensSort } from '@blockscout/interchain-indexer-types';

import config from 'src/config';
import getNextSortValue from 'src/shared/sort/get-next-sort-value';

import { TableBody, TableColumnHeader, TableColumnHeaderSortable, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import { BRIDGED_TOKENS_SORT_SEQUENCE } from '../../utils/bridged-tokens-sort';
import BridgedTokensTableItem from './BridgedTokensTableItem';

interface Props {
  data: Array<StatsBridgedTokenRow>;
  isLoading?: boolean;
  sort: CrossChainBridgedTokensSortingValue;
  setSorting: ({ value }: { value: Array<string> }) => void;
  page: number;
  top?: number;
  chains?: Array<ChainInfo>;
}

const BridgedTokensTable = ({ data, isLoading, sort, setSorting, page, top, chains }: Props) => {

  const onSortToggle = React.useCallback((field: CrossChainBridgedTokensSortingField) => {
    const value = getNextSortValue<CrossChainBridgedTokensSortingField, CrossChainBridgedTokensSortingValue>(BRIDGED_TOKENS_SORT_SEQUENCE, field)(sort);
    setSorting({ value: [ value ] });
  }, [ sort, setSorting ]);

  return (
    <TableRoot minW="1100px">
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader>Token</TableColumnHeader>
          <TableColumnHeaderSortable
            isNumeric
            sortField={ BridgedTokensSort.INPUT_TRANSFERS_COUNT }
            sortValue={ sort }
            onSortToggle={ onSortToggle }
            disabled={ isLoading }
          >
            In transfers
          </TableColumnHeaderSortable>
          <TableColumnHeaderSortable
            isNumeric
            sortField={ BridgedTokensSort.OUTPUT_TRANSFERS_COUNT }
            sortValue={ sort }
            onSortToggle={ onSortToggle }
            disabled={ isLoading }
          >
            Out transfers
          </TableColumnHeaderSortable>
          <TableColumnHeaderSortable
            isNumeric
            sortField={ BridgedTokensSort.TOTAL_TRANSFERS_COUNT }
            sortValue={ sort }
            onSortToggle={ onSortToggle }
            disabled={ isLoading }
          >
            Total transfers
          </TableColumnHeaderSortable>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { data.map((item, index) => {
          const tokenInfo = item.tokens.find((token) => String(token.chain_id) === config.chain.id) ||
            item.tokens.find((token) => String(token.chain_id) !== config.chain.id);
          const chainInfo = chains?.find((chain) => chain.id === tokenInfo?.chain_id);

          return (
            <BridgedTokensTableItem
              key={ String(tokenInfo?.token_address) + (isLoading ? index : '') }
              data={ item }
              tokenInfo={ tokenInfo }
              chainInfo={ chainInfo }
              index={ index }
              isLoading={ isLoading }
              page={ page }
            />
          );
        }) }
      </TableBody>
    </TableRoot>
  );
};

export default React.memo(BridgedTokensTable);
