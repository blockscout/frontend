import { capitalize } from 'es-toolkit';
import React from 'react';

import type { Block } from 'types/api/block';

import config from 'configs/app';
import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import useInitialList from 'lib/hooks/useInitialList';
import getNetworkValidatorTitle from 'lib/networks/getNetworkValidatorTitle';
import { currencyUnits } from 'lib/units';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import BlocksTableItem from 'ui/blocks/BlocksTableItem';
import * as SocketNewItemsNotice from 'ui/shared/SocketNewItemsNotice';

interface Props {
  data: Array<Block>;
  isLoading?: boolean;
  top: number;
  page: number;
  socketInfoNum?: number;
  socketInfoAlert?: string;
  showSocketInfo?: boolean;
}

const VALIDATOR_COL_WEIGHT = 23;
const GAS_COL_WEIGHT = 33;
const REWARD_COL_WEIGHT = 22;
const FEES_COL_WEIGHT = 22;

const isRollup = config.features.rollup.isEnabled;

const BlocksTable = ({ data, isLoading, top, page, showSocketInfo, socketInfoNum, socketInfoAlert }: Props) => {
  const initialList = useInitialList({
    data: data ?? [],
    idFn: (item) => item.height,
    enabled: !isLoading,
  });

  const widthBase =
    (!config.UI.views.block.hiddenFields?.miner ? VALIDATOR_COL_WEIGHT : 0) +
    GAS_COL_WEIGHT +
    (!isRollup && !config.UI.views.block.hiddenFields?.total_reward ? REWARD_COL_WEIGHT : 0) +
    (!isRollup && !config.UI.views.block.hiddenFields?.burnt_fees ? FEES_COL_WEIGHT : 0);

  return (
    <AddressHighlightProvider>
      <TableRoot minWidth="1040px" fontWeight={ 500 }>
        <TableHeaderSticky top={ top }>
          <TableRow>
            <TableColumnHeader width="150px">Block</TableColumnHeader>
            <TableColumnHeader width="120px">Size, bytes</TableColumnHeader>
            { !config.UI.views.block.hiddenFields?.miner && (
              <TableColumnHeader width={ `${ VALIDATOR_COL_WEIGHT / widthBase * 100 }%` } minW="160px">
                { capitalize(getNetworkValidatorTitle()) }
              </TableColumnHeader>
            ) }
            <TableColumnHeader width="64px" isNumeric>Txn</TableColumnHeader>
            <TableColumnHeader width={ `${ GAS_COL_WEIGHT / widthBase * 100 }%` }>Gas used</TableColumnHeader>
            { !isRollup && !config.UI.views.block.hiddenFields?.total_reward &&
              <TableColumnHeader width={ `${ REWARD_COL_WEIGHT / widthBase * 100 }%` }>Reward { currencyUnits.ether }</TableColumnHeader> }
            { !isRollup && !config.UI.views.block.hiddenFields?.burnt_fees &&
              <TableColumnHeader width={ `${ FEES_COL_WEIGHT / widthBase * 100 }%` }>Burnt fees { currencyUnits.ether }</TableColumnHeader> }
            { !isRollup && !config.UI.views.block.hiddenFields?.base_fee &&
              <TableColumnHeader width="150px" isNumeric>Base fee</TableColumnHeader> }
          </TableRow>
        </TableHeaderSticky>
        <TableBody>
          { showSocketInfo && (
            <SocketNewItemsNotice.Desktop
              url={ window.location.href }
              alert={ socketInfoAlert }
              num={ socketInfoNum }
              type="block"
              isLoading={ isLoading }
            />
          ) }
          { data.map((item, index) => (
            <BlocksTableItem
              key={ item.height + (isLoading ? `${ index }_${ page }` : '') }
              data={ item }
              enableTimeIncrement={ page === 1 && !isLoading }
              isLoading={ isLoading }
              animation={ initialList.getAnimationProp(item) }
            />
          )) }
        </TableBody>
      </TableRoot>
    </AddressHighlightProvider>
  );
};

export default BlocksTable;
