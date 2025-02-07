import { Image } from '@chakra-ui/react';
import React from 'react';

import type { Pool } from 'types/api/pools';

import getPoolLinks from 'lib/pools/getPoolLinks';
import Skeleton from 'ui/shared/chakra/Skeleton';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import PoolEntity from 'ui/shared/entities/pool/PoolEntity';
import LinkExternal from 'ui/shared/links/LinkExternal';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';

type Props = {
  item: Pool;
  isLoading?: boolean;
};

const UserOpsListItem = ({ item, isLoading }: Props) => {
  const externalLinks = getPoolLinks(item);
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

      <ListItemMobileGrid.Label isLoading={ isLoading }>Liquidity</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton isLoaded={ !isLoading }>
          ${ Number(item.liquidity).toLocaleString(undefined, { maximumFractionDigits: 2, notation: 'compact' }) }
        </Skeleton>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>View in</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton isLoaded={ !isLoading }>
          { externalLinks.map((link) => (
            <LinkExternal href={ link.url } key={ link.url } display="inline-flex">
              <Image src={ link.image } alt={ link.title } boxSize={ 5 } mr={ 2 }/>
              { link.title }
            </LinkExternal>
          )) }
        </Skeleton>
      </ListItemMobileGrid.Value>
    </ListItemMobileGrid.Container>
  );
};

export default UserOpsListItem;
