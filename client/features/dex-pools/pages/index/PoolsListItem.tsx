// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { Pool } from 'client/features/dex-pools/types/api';

import AddressEntity from 'client/slices/address/components/entity/AddressEntity';

import PoolEntity from 'client/features/dex-pools/components/entity/PoolEntity';
import getPoolLinks from 'client/features/dex-pools/utils/get-pool-links';

import ListItemMobileGrid from 'client/shared/lists/ListItemMobileGrid';
import CopyToClipboard from 'client/shared/text/CopyToClipboard';
import HashStringShorten from 'client/shared/text/HashStringShorten';

import { Image } from 'toolkit/chakra/image';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';

type Props = {
  item: Pool;
  isLoading?: boolean;
};

const PoolsListItem = ({ item, isLoading }: Props) => {
  const externalLinks = getPoolLinks(item);
  return (
    <ListItemMobileGrid.Container gridTemplateColumns="100px auto">

      <ListItemMobileGrid.Label isLoading={ isLoading }>Pool</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <PoolEntity pool={ item } fontWeight={ 700 } isLoading={ isLoading }/>
      </ListItemMobileGrid.Value>

      { item.is_contract && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>Contract</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <AddressEntity address={{ hash: item.pool_id }} noIcon link={{ variant: 'secondary' }} isLoading={ isLoading } truncation="constant_long"/>
          </ListItemMobileGrid.Value>
        </>
      ) }

      { !item.is_contract && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>Pool ID</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <HashStringShorten hash={ item.pool_id } type="long"/>
            <CopyToClipboard text={ item.pool_id }/>
          </ListItemMobileGrid.Value>
        </>
      ) }

      <ListItemMobileGrid.Label isLoading={ isLoading }>Liquidity</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton loading={ isLoading }>
          ${ Number(item.liquidity).toLocaleString(undefined, { maximumFractionDigits: 2, notation: 'compact' }) }
        </Skeleton>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>View in</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton loading={ isLoading }>
          { externalLinks.map((link) => (
            <Link external href={ link.url } key={ link.url } display="inline-flex">
              <Image src={ link.image } alt={ link.title } boxSize={ 5 } mr={ 2 }/>
              { link.title }
            </Link>
          )) }
        </Skeleton>
      </ListItemMobileGrid.Value>
    </ListItemMobileGrid.Container>
  );
};

export default PoolsListItem;
