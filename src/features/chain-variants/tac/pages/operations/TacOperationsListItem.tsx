// SPDX-License-Identifier: LicenseRef-Blockscout

import { HStack } from '@chakra-ui/react';
import React from 'react';

import type * as tac from '@blockscout/tac-operation-lifecycle-types';

import TimeWithTooltip from 'src/shared/date-and-time/TimeWithTooltip';
import ListItemMobileGrid from 'src/shared/lists/ListItemMobileGrid';

import { Badge } from 'src/toolkit/chakra/badge';

import AddressEntityTacTon from '../../components/AddressEntityTacTon';
import TacOperationEntity from '../../components/TacOperationEntity';
import TacOperationStatus from '../../components/TacOperationStatus';

type Props = { item: tac.V2OperationBriefDetails; isLoading?: boolean };

const TacOperationsListItem = ({ item, isLoading }: Props) => {
  return (
    <ListItemMobileGrid.Container>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Operation</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TacOperationEntity
          id={ item.operation_id }
          status={ item.status }
          isLoading={ isLoading }
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Age</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TimeWithTooltip
          timestamp={ item.timestamp }
          isLoading={ isLoading }
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Status</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
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
      </ListItemMobileGrid.Value>

      { item.sender && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>Sender</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <AddressEntityTacTon
              address={{ hash: item.sender.address }}
              chainType={ item.sender.blockchain }
              isLoading={ isLoading }
            />
          </ListItemMobileGrid.Value>
        </>
      ) }

    </ListItemMobileGrid.Container>
  );
};

export default TacOperationsListItem;
