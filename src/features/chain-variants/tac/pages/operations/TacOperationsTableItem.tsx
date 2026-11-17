// SPDX-License-Identifier: LicenseRef-Blockscout

import { HStack } from '@chakra-ui/react';
import React from 'react';

import type * as tac from '@blockscout/tac-operation-lifecycle-types';

import TimeWithTooltip from 'src/shared/date-and-time/TimeWithTooltip';

import { Badge } from 'src/toolkit/chakra/badge';
import { TableCell, TableRow } from 'src/toolkit/chakra/table';

import AddressEntityTacTon from '../../components/AddressEntityTacTon';
import TacOperationEntity from '../../components/TacOperationEntity';
import TacOperationStatus from '../../components/TacOperationStatus';

interface Props {
  item: tac.V2OperationBriefDetails;
  isLoading?: boolean;
}

const TacOperationsTableItem = ({ item, isLoading }: Props) => {
  return (
    <TableRow>
      <TableCell verticalAlign="middle">
        <HStack gap={ 1 } flexWrap="wrap">
          <TacOperationStatus
            status={ item.status }
            type={ item.type }
            errorReason={ item.error_reason }
            isLoading={ isLoading }
            isRollback={ item.rollback }
          />
          { item.rollback && <Badge loading={ isLoading }>Rollback</Badge> }
        </HStack>
      </TableCell>
      <TableCell verticalAlign="middle">
        <TacOperationEntity
          id={ item.operation_id }
          status={ item.status }
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
