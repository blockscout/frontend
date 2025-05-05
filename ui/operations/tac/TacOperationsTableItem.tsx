import React from 'react';

import type * as tac from '@blockscout/tac-operation-lifecycle-types';

import { TableCell, TableRow } from 'toolkit/chakra/table';
import OperationEntity from 'ui/shared/entities/operation/OperationEntity';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';

interface Props {
  item: tac.OperationBriefDetails;
  isLoading?: boolean;
}

const TacOperationsTableItem = ({ item, isLoading }: Props) => {
  return (
    <TableRow>
      <TableCell verticalAlign="middle">
        <OperationEntity
          id={ item.operation_id }
          isLoading={ isLoading }
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        <TimeAgoWithTooltip
          timestamp={ item.timestamp }
          isLoading={ isLoading }
          color="text.secondary"
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        { item.type }
      </TableCell>
      <TableCell verticalAlign="middle" pr={ 12 }>
        { item.sender }
      </TableCell>
    </TableRow>
  );
};

export default TacOperationsTableItem;
