import React from 'react';

import type { CrossChainBridgedTokensSortingValue, CrossChainBridgedTokensSortingField } from '../../types/api';
import type { StatsBridgedTokenRow } from '@blockscout/interchain-indexer-types';
import { BridgedTokensSort } from '@blockscout/interchain-indexer-types';

import config from 'configs/app';
import { TableBody, TableColumnHeader, TableColumnHeaderSortable, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import getNextSortValue from 'ui/shared/sort/getNextSortValue';

import { BRIDGED_TOKENS_SORT_SEQUENCE } from '../../utils/bridged-tokens-sort';
import BridgedTokensTableItem from './BridgedTokensTableItem';

interface Props {
  data: Array<StatsBridgedTokenRow>;
  isLoading?: boolean;
  sort: CrossChainBridgedTokensSortingValue;
  setSorting: ({ value }: { value: Array<string> }) => void;
  page: number;
  top?: number;
}

const BridgedTokensTable = ({ data, isLoading, sort, setSorting, page, top }: Props) => {

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
          const tokenCurrentChain = item.tokens.find((token) => String(token.chain_id) === config.chain.id);
          return (
            <BridgedTokensTableItem
              key={ String(tokenCurrentChain?.token_address) + (isLoading ? index : '') }
              data={ item }
              token={ tokenCurrentChain }
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
