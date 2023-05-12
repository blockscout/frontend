import { Table, Tbody, Tr, Th } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import capitalize from 'lodash/capitalize';
import React from 'react';

import type { Block } from 'types/api/block';

import appConfig from 'configs/app/config';
import getNetworkValidatorTitle from 'lib/networks/getNetworkValidatorTitle';
import BlocksTableItem from 'ui/blocks/BlocksTableItem';
import { default as Thead } from 'ui/shared/TheadSticky';

interface Props {
  data: Array<Block>;
  isLoading?: boolean;
  top: number;
  page: number;
}

const BlocksTable = ({ data, isLoading, top, page }: Props) => {

  return (
    <Table variant="simple" minWidth="1040px" size="md" fontWeight={ 500 }>
      <Thead top={ top }>
        <Tr>
          <Th width="125px">Block</Th>
          <Th width="120px">Size, bytes</Th>
          <Th width={ appConfig.L2.isL2Network ? '37%' : '21%' } minW="144px">{ capitalize(getNetworkValidatorTitle()) }</Th>
          <Th width="64px" isNumeric>Txn</Th>
          <Th width={ appConfig.L2.isL2Network ? '63%' : '35%' }>Gas used</Th>
          { !appConfig.L2.isL2Network && <Th width="22%">Reward { appConfig.network.currency.symbol }</Th> }
          { !appConfig.L2.isL2Network && <Th width="22%">Burnt fees { appConfig.network.currency.symbol }</Th> }
        </Tr>
      </Thead>
      <Tbody>
        <AnimatePresence initial={ false }>
          { data.map((item, index) => (
            <BlocksTableItem
              key={ item.height + (isLoading ? String(index) : '') }
              data={ item }
              enableTimeIncrement={ page === 1 && !isLoading }
              isLoading={ isLoading }
            />
          )) }
        </AnimatePresence>
      </Tbody>
    </Table>
  );
};

export default BlocksTable;
