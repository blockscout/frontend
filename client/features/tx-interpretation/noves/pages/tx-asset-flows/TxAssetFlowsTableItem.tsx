// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import NovesFromTo from 'client/features/tx-interpretation/noves/components/NovesFromTo';

import { TableRow, TableCell } from 'toolkit/chakra/table';

import NovesActionSnippet from '../../components/NovesActionSnippet';
import type { NovesFlowViewItem } from '../../utils/generateFlowViewData';

type Props = {
  isPlaceholderData: boolean;
  item: NovesFlowViewItem;
};

const TxAssetFlowsTableItem = (props: Props) => {

  return (
    <TableRow>
      <TableCell px={ 3 } py={ 5 } textStyle="sm" borderColor={{ _light: 'gray.200', _dark: 'whiteAlpha.200' }}>
        <NovesActionSnippet item={ props.item } isLoaded={ !props.isPlaceholderData }/>
      </TableCell>
      <TableCell px={ 3 } py="18px" textStyle="sm" borderColor={{ _light: 'gray.200', _dark: 'whiteAlpha.200' }}>
        <NovesFromTo item={ props.item } isLoaded={ !props.isPlaceholderData }/>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(TxAssetFlowsTableItem);
