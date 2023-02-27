import {
  Table,
  Tbody,
  Tr,
  Th,
} from '@chakra-ui/react';
import capitalize from 'lodash/capitalize';
import React from 'react';

import type { TxStateChanges } from 'types/api/txStateChanges';

import appConfig from 'configs/app/config';
import getNetworkValidatorTitle from 'lib/networks/getNetworkValidatorTitle';
import { default as Thead } from 'ui/shared/TheadSticky';
import TxStateTableItem from 'ui/tx/state/TxStateTableItem';

interface Props {
  data: TxStateChanges;
}

const TxStateTable = ({ data }: Props) => {
  return (
    <Table variant="simple" minWidth="950px" size="sm" w="auto" mt={ 6 }>
      <Thead top={ 0 }>
        <Tr>
          <Th width="92px">Storage</Th>
          <Th width="146px">Address</Th>
          <Th width="120px">{ capitalize(getNetworkValidatorTitle()) }</Th>
          <Th width="33%" isNumeric>{ `Before ${ appConfig.network.currency.symbol }` }</Th>
          <Th width="33%" isNumeric>{ `After ${ appConfig.network.currency.symbol }` }</Th>
          <Th width="33%" isNumeric>{ `State difference ${ appConfig.network.currency.symbol }` }</Th>
        </Tr>
      </Thead>
      <Tbody>
        { data.map((item, index) => <TxStateTableItem data={ item } key={ index }/>) }
      </Tbody>
    </Table>
  );
};

export default TxStateTable;
