import React from 'react';

import type { ValidatorsZilliqaItem } from 'types/api/validators';

import config from 'configs/app';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';

import ValidatorsTableItem from './ValidatorsTableItem';

interface Props {
  data: Array<ValidatorsZilliqaItem>;
  isLoading?: boolean;
}

const ValidatorsTable = ({ data, isLoading }: Props) => {
  return (
    <TableRoot>
      <TableHeaderSticky top={ ACTION_BAR_HEIGHT_DESKTOP }>
        <TableRow>
          <TableColumnHeader width="50%">BLS public key</TableColumnHeader>
          <TableColumnHeader width="25%">Index</TableColumnHeader>
          <TableColumnHeader width="25%" isNumeric>
            Staked { config.chain.currency.symbol }
          </TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { data.map((item, index) => (
          <ValidatorsTableItem
            key={ item.bls_public_key + (isLoading ? index : '') }
            data={ item }
            isLoading={ isLoading }/>
        )) }
      </TableBody>
    </TableRoot>
  );
};

export default React.memo(ValidatorsTable);
