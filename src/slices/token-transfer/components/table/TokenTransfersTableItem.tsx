// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { TokenTransferColumn } from '../../types/client';
import type { ClusterChainConfig } from 'src/features/multichain/types/client';

import ChainIcon from 'src/shared/external-chains/ChainIcon';

import { TableCell, TableRow } from 'src/toolkit/chakra/table';

import type { Props as CellProps } from './TokenTransferCellByColumn';
import TokenTransferCellByColumn from './TokenTransferCellByColumn';

interface Props extends Omit<CellProps, 'column' | 'chainConfig'> {
  readonly columns: ReadonlyArray<TokenTransferColumn>;
  readonly chainData: ClusterChainConfig | undefined;
}

const TokenTransfersTableItem = ({ columns, chainData, ...rest }: Props) => {
  return (
    <TableRow>
      { chainData && (
        <TableCell>
          <ChainIcon data={ chainData } isLoading={ rest.isLoading }/>
        </TableCell>
      ) }
      { columns.map((column) => (
        <TableCell key={ column.id } isNumeric={ column.isNumeric } verticalAlign="middle">
          <TokenTransferCellByColumn
            column={ column.id }
            chainConfig={ chainData?.app_config }
            { ...rest }
          />
        </TableCell>
      )) }
    </TableRow>
  );
};

export default React.memo(TokenTransfersTableItem);
