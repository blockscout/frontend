// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type * as tac from '@blockscout/tac-operation-lifecycle-types';

import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';

import AddressEntityTacTon from '../../components/AddressEntityTacTon';
import TacOperationEntity from '../../components/TacOperationEntity';
import TacOperationStatus from '../../components/TacOperationStatus';

type Props = { item: tac.OperationBriefDetails; isLoading?: boolean };

const TacOperationsListItem = ({ item, isLoading }: Props) => {
  return (
    <ListItemMobileGrid.Container>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Operation</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TacOperationEntity
          id={ item.operation_id }
          type={ item.type }
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
        <TacOperationStatus status={ item.type } isLoading={ isLoading }/>
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
