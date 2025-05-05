import React from 'react';

import type * as tac from '@blockscout/tac-operation-lifecycle-types';

import OperationEntity from 'ui/shared/entities/operation/OperationEntity';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';

type Props = { item: tac.OperationBriefDetails; isLoading?: boolean };

const TacOperationsListItem = ({ item, isLoading }: Props) => {
  return (
    <ListItemMobileGrid.Container>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Operation</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <OperationEntity
          hash={ item.operation_id }
          isLoading={ isLoading }
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Age</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TimeAgoWithTooltip
          timestamp={ item.timestamp }
          isLoading={ isLoading }
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Status</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        { item.type }
      </ListItemMobileGrid.Value>

      { item.sender && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>Sender</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            { item.sender }
          </ListItemMobileGrid.Value>
        </>
      ) }

    </ListItemMobileGrid.Container>
  );
};

export default TacOperationsListItem;
