import React from 'react';

import type { CeloEpochListItem } from 'types/api/epochs';

import config from 'configs/app';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import TimeFormatToggle from 'ui/shared/time/TimeFormatToggle';

import EpochsTableItem from './EpochsTableItem';

interface Props {
  items: Array<CeloEpochListItem>;
  l2MigrationBlock: number | undefined;
  isLoading?: boolean;
  top: number;
};

const EpochsTable = ({ items, l2MigrationBlock, isLoading, top }: Props) => {
  return (
    <TableRoot minW="1050px">
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader w="280px">
            Epoch
            <TimeFormatToggle/>
          </TableColumnHeader>
          <TableColumnHeader w="25%">Block range</TableColumnHeader>
          <TableColumnHeader w="25%" isNumeric>Community fund { config.chain.currency.symbol }</TableColumnHeader>
          <TableColumnHeader w="25%" isNumeric>Carbon offset fund { config.chain.currency.symbol }</TableColumnHeader>
          <TableColumnHeader w="25%" isNumeric>Total fund { config.chain.currency.symbol }</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { items.map((item, index) => {
          return (
            <EpochsTableItem
              key={ item.number + (isLoading ? String(index) : '') }
              item={ item }
              l2MigrationBlock={ l2MigrationBlock }
              isLoading={ isLoading }
            />
          );
        }) }
      </TableBody>
    </TableRoot>
  );
};

export default EpochsTable;
