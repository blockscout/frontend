import { Table, Tbody, Tr, Th } from '@chakra-ui/react';
import React from 'react';

import type { ValidatorsZilliqaItem } from 'types/api/validators';

import config from 'configs/app';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import { default as Thead } from 'ui/shared/TheadSticky';

import ValidatorsTableItem from './ValidatorsTableItem';

interface Props {
  data: Array<ValidatorsZilliqaItem>;
  isLoading?: boolean;
}

const ValidatorsTable = ({ data, isLoading }: Props) => {
  return (
    <Table>
      <Thead top={ ACTION_BAR_HEIGHT_DESKTOP }>
        <Tr>
          <Th width="50%">BLS public key</Th>
          <Th width="25%">Index</Th>
          <Th width="25%" isNumeric>
            Staked { config.chain.currency.symbol }
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        { data.map((item, index) => (
          <ValidatorsTableItem
            key={ item.bls_public_key + (isLoading ? index : '') }
            data={ item }
            isLoading={ isLoading }/>
        )) }
      </Tbody>
    </Table>
  );
};

export default React.memo(ValidatorsTable);
