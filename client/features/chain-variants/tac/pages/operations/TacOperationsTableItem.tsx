// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type * as tac from '@blockscout/tac-operation-lifecycle-types';

import { TableCell, TableRow } from 'toolkit/chakra/table';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';

import AddressEntityTacTon from '../../components/AddressEntityTacTon';
import TacOperationEntity from '../../components/TacOperationEntity';
import TacOperationStatus from '../../components/TacOperationStatus';

interface Props {
  item: tac.OperationBriefDetails;
  isLoading?: boolean;
}

const TacOperationsTableItem = ({ item, isLoading }: Props) => {
  return (
    <TableRow>
      <TableCell verticalAlign="middle">
        <TacOperationStatus status={ item.type } isLoading={ isLoading }/>
      </TableCell>
      <TableCell verticalAlign="middle">
        <TacOperationEntity
          id={ item.operation_id }
          type={ item.type }
          isLoading={ isLoading }
          truncation="constant_long"
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        <TimeWithTooltip
          timestamp={ item.timestamp }
          isLoading={ isLoading }
          color="text.secondary"
        />
      </TableCell>
      <TableCell verticalAlign="middle" pr={ 12 }>
        { item.sender ? (
          <AddressEntityTacTon
            address={{ hash: item.sender.address }}
            chainType={ item.sender.blockchain }
            truncation="constant"
            isLoading={ isLoading }
            w="fit-content"
          />
        ) : '-' }
      </TableCell>
    </TableRow>
  );
};

export default TacOperationsTableItem;
