import { Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { Pool } from 'types/api/pools';

import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import PoolEntity from 'ui/shared/entities/pool/PoolEntity';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';

type Props = {
  item: Pool;
  isLoading?: boolean;
};

const UserOpsListItem = ({ item, isLoading }: Props) => {
  return (
    <ListItemMobileGrid.Container gridTemplateColumns="100px auto">

      <ListItemMobileGrid.Label isLoading={ isLoading }>Pool</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <PoolEntity pool={ item } fontWeight={ 700 } isLoading={ isLoading }/>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Contract</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <AddressEntity address={{ hash: item.contract_address }} noIcon isLoading={ isLoading }/>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>FDV</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton isLoaded={ !isLoading }>
          ${ Number(item.fully_diluted_valuation_usd).toLocaleString(undefined, { maximumFractionDigits: 2, notation: 'compact' }) }
        </Skeleton>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Market cap</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton isLoaded={ !isLoading }>
          ${ Number(item.market_cap_usd).toLocaleString(undefined, { maximumFractionDigits: 2, notation: 'compact' }) }
        </Skeleton>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Liquidity</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton isLoaded={ !isLoading }>
          ${ Number(item.liquidity).toLocaleString(undefined, { maximumFractionDigits: 2, notation: 'compact' }) }
        </Skeleton>
      </ListItemMobileGrid.Value>
    </ListItemMobileGrid.Container>
  );
};

export default UserOpsListItem;
