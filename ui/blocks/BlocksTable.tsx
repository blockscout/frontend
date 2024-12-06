import { Table, Tbody, Tr, Th } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import capitalize from 'lodash/capitalize';
import React from 'react';

import type { Block } from 'types/api/block';

import config from 'configs/app';
import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import getNetworkValidatorTitle from 'lib/networks/getNetworkValidatorTitle';
import { currencyUnits } from 'lib/units';
import BlocksTableItem from 'ui/blocks/BlocksTableItem';
import * as SocketNewItemsNotice from 'ui/shared/SocketNewItemsNotice';
import { default as Thead } from 'ui/shared/TheadSticky';

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

  const widthBase =
    (!config.UI.views.block.hiddenFields?.miner ? VALIDATOR_COL_WEIGHT : 0) +
    GAS_COL_WEIGHT +
    (!isRollup && !config.UI.views.block.hiddenFields?.total_reward ? REWARD_COL_WEIGHT : 0) +
    (!isRollup && !config.UI.views.block.hiddenFields?.burnt_fees ? FEES_COL_WEIGHT : 0);

  return (
    <AddressHighlightProvider>
      <Table minWidth="1040px" fontWeight={ 500 }>
        <Thead top={ top }>
          <Tr>
            <Th width="150px">Block</Th>
            <Th width="120px">Size, bytes</Th>
            { !config.UI.views.block.hiddenFields?.miner &&
            <Th width={ `${ VALIDATOR_COL_WEIGHT / widthBase * 100 }%` } minW="160px">{ capitalize(getNetworkValidatorTitle()) }</Th> }
            <Th width="64px" isNumeric>Txn</Th>
            <Th width={ `${ GAS_COL_WEIGHT / widthBase * 100 }%` }>Gas used</Th>
            { !isRollup && !config.UI.views.block.hiddenFields?.total_reward &&
              <Th width={ `${ REWARD_COL_WEIGHT / widthBase * 100 }%` }>Reward { currencyUnits.ether }</Th> }
            { !isRollup && !config.UI.views.block.hiddenFields?.burnt_fees &&
              <Th width={ `${ FEES_COL_WEIGHT / widthBase * 100 }%` }>Burnt fees { currencyUnits.ether }</Th> }
            { !isRollup && !config.UI.views.block.hiddenFields?.base_fee &&
              <Th width="150px" isNumeric>Base fee</Th> }
          </Tr>
        </Thead>
        <Tbody>
          { showSocketInfo && (
            <SocketNewItemsNotice.Desktop
              url={ window.location.href }
              alert={ socketInfoAlert }
              num={ socketInfoNum }
              type="block"
              isLoading={ isLoading }
            />
          ) }
          <AnimatePresence initial={ false }>
            { data.map((item, index) => (
              <BlocksTableItem
                key={ item.height + (isLoading ? `${ index }_${ page }` : '') }
                data={ item }
                enableTimeIncrement={ page === 1 && !isLoading }
                isLoading={ isLoading }
              />
            )) }
          </AnimatePresence>
        </Tbody>
      </Table>
    </AddressHighlightProvider>
  );
};

export default BlocksTable;
