// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { TokenTransferColumn } from '../../types/client';
import type { ClusterChainConfig } from 'src/features/multichain/types/client';

import ChainIcon from 'src/shared/external-chains/ChainIcon';

import { GridTableCell, GridTableRow } from 'src/toolkit/chakra/grid-table';

import type { Props as CellProps } from './TokenTransferCellByColumn';
import TokenTransferCellByColumn from './TokenTransferCellByColumn';

interface Props extends Omit<CellProps, 'column' | 'chainConfig'> {
  readonly columns: ReadonlyArray<TokenTransferColumn>;
  readonly chainData: ClusterChainConfig | undefined;
}

const TokenTransfersTableItem = ({ columns, chainData, ...rest }: Props) => {
  const columnIndexOffset = chainData ? 1 : 0;

  return (
    <GridTableRow>
      { chainData && (
        <GridTableCell columnIndex={ 0 }>
          <ChainIcon data={ chainData } isLoading={ rest.isLoading }/>
        </GridTableCell>
      ) }
      { columns.map((column, index) => (
        <GridTableCell key={ column.id } columnIndex={ index + columnIndexOffset }>
          <TokenTransferCellByColumn
            column={ column.id }
            chainConfig={ chainData?.app_config }
            { ...rest }
          />
        </GridTableCell>
      )) }
    </GridTableRow>
  );
};

export default React.memo(TokenTransfersTableItem);
