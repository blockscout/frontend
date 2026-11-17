// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { SearchResultCellsProps } from './types';

import * as TacOperationEntity from 'src/features/chain-variants/tac/components/TacOperationEntity';
import TacOperationStatus from 'src/features/chain-variants/tac/components/TacOperationStatus';

import Time from 'src/shared/date-and-time/Time';

import { Badge } from 'src/toolkit/chakra/badge';
import { TableCell } from 'src/toolkit/chakra/table';

const SearchResultTacOperationCells = ({ data, isLoading, onLinkClick }: SearchResultCellsProps<'tac_operation'>) => {
  return (
    <>
      <TableCell colSpan={ 2 } fontSize="sm">
        <TacOperationEntity.Container>
          <TacOperationEntity.Icon status={ data.tac_operation.status } isLoading={ isLoading }/>
          <TacOperationEntity.Link
            isLoading={ isLoading }
            id={ data.tac_operation.operation_id }
            onClick={ onLinkClick }
          >
            <TacOperationEntity.Content
              asProp="mark"
              id={ data.tac_operation.operation_id }
              textStyle="sm"
              fontWeight={ 700 }
              mr={ 2 }
            />
          </TacOperationEntity.Link>
          <TacOperationStatus
            status={ data.tac_operation.status }
            type={ data.tac_operation.type }
            errorReason={ data.tac_operation.error_reason }
            isRollback={ data.tac_operation.rollback }
            isLoading={ isLoading }
          />
          { data.tac_operation.rollback && <Badge loading={ isLoading }>Rollback</Badge> }
        </TacOperationEntity.Container>
      </TableCell>
      <TableCell fontSize="sm" verticalAlign="middle" isNumeric>
        <Time timestamp={ data.tac_operation.timestamp } color="text.secondary" format="lll_s"/>
      </TableCell>
    </>
  );
};

export default React.memo(SearchResultTacOperationCells);
