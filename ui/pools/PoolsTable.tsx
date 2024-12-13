import { Table, Tbody, Th, Tr, Flex, Tooltip } from '@chakra-ui/react';
import React from 'react';

import type { Pool } from 'types/api/pools';

import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import IconSvg from 'ui/shared/IconSvg';
import { default as Thead } from 'ui/shared/TheadSticky';

import PoolsTableItem from './PoolsTableItem';

type Props = {
  items: Array<Pool>;
  page: number;
  isLoading?: boolean;
  top?: number;
};

const PoolsTable = ({ items, page, isLoading, top }: Props) => {
  return (
    <Table>
      <Thead top={ top ?? ACTION_BAR_HEIGHT_DESKTOP }>
        <Tr>
          <Th width="70%">Pool</Th>
          <Th width="30%">DEX </Th>
          <Th width="120px" isNumeric>
            <Flex align="center">
              FDV
              <Tooltip
                label="Fully Diluted Valuation: theoretical market cap if all tokens were in circulation"
                placement="bottom"
              >
                <IconSvg name="info" boxSize={ 5 } ml={ 1 } color="text_secondary"/>
              </Tooltip>
            </Flex>
          </Th>
          <Th width="120px" isNumeric>Market cap</Th>
          <Th width="120px" isNumeric>Liquidity</Th>
        </Tr>
      </Thead>
      <Tbody>
        { items.map((item, index) => (
          <PoolsTableItem key={ item.contract_address + (isLoading ? index : '') } item={ item } index={ index } page={ page } isLoading={ isLoading }/>
        )) }
      </Tbody>
    </Table>
  );
};

export default PoolsTable;
