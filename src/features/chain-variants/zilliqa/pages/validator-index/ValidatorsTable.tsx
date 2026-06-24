// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import config from 'src/config';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import ValidatorsTableItem from './ValidatorsTableItem';

interface Props {
  data: Array<schemas['ZilliqaStaker']>;
  isLoading?: boolean;
  top?: number;
}

const ValidatorsTable = ({ data, isLoading, top }: Props) => {
  return (
    <TableRoot>
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader width="50%">BLS public key</TableColumnHeader>
          <TableColumnHeader width="15%">Index</TableColumnHeader>
          <TableColumnHeader width="35%" isNumeric>
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
