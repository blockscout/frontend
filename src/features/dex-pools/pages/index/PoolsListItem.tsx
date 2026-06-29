// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type * as contractsInfo from '@blockscout/contracts-info-types';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';

import PoolEntity from 'src/features/dex-pools/components/entity/PoolEntity';
import getPoolLinks from 'src/features/dex-pools/utils/get-pool-links';

import ListItemMobileGrid from 'src/shared/lists/ListItemMobileGrid';
import CopyToClipboard from 'src/shared/texts/CopyToClipboard';
import HashStringShorten from 'src/shared/texts/HashStringShorten';

import { Image } from 'src/toolkit/chakra/image';
import { Link } from 'src/toolkit/chakra/link';
import { Skeleton } from 'src/toolkit/chakra/skeleton';

interface Props {
  item: contractsInfo.Pool;
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
