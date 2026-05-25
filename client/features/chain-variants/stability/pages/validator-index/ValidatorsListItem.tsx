// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { ValidatorStability } from 'client/features/chain-variants/stability/types/api';

import AddressEntity from 'client/slices/address/components/entity/AddressEntity';

import ValidatorStatus from 'client/features/chain-variants/stability/components/ValidatorStabilityStatus';

import ListItemMobileGrid from 'client/shared/lists/ListItemMobileGrid';

import { Skeleton } from 'toolkit/chakra/skeleton';

interface Props {
  data: ValidatorStability;
  isLoading?: boolean;
}

const ValidatorsListItem = ({ data, isLoading }: Props) => {

  return (
    <ListItemMobileGrid.Container>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Address</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <AddressEntity
          isLoading={ isLoading }
          address={ data.address }
          truncation="constant"
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Status</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <ValidatorStatus state={ data.state } isLoading={ isLoading }/>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Blocks</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton loading={ isLoading }>
          { data.blocks_validated_count.toLocaleString() }
        </Skeleton>
      </ListItemMobileGrid.Value>
    </ListItemMobileGrid.Container>
  );
};

export default React.memo(ValidatorsListItem);
