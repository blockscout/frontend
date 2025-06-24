import { Flex, Grid, chakra } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { ClustersByAddressResponse } from 'types/api/clusters';

import { route } from 'nextjs-routes';

import type { ResourceError } from 'lib/api/resources';
import { Button } from 'toolkit/chakra/button';
import { Link } from 'toolkit/chakra/link';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from 'toolkit/chakra/popover';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
import ClustersEntity from 'ui/shared/entities/clusters/ClustersEntity';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  query: UseQueryResult<ClustersByAddressResponse, ResourceError<unknown>>;
  addressHash: string;
}

interface ClustersGridProps {
  data: ClustersByAddressResponse['result']['data'];
}

const ClustersGrid = ({ data }: ClustersGridProps) => {
  const itemsToShow = data.slice(0, 10);
  const numberOfRows = Math.min(itemsToShow.length, 5);

  return (
    <Grid templateRows={ `repeat(${ numberOfRows }, auto)` } autoFlow="column" gap={ 4 } mt={ 2 }>
      { itemsToShow.map((cluster) => (
        <Flex key={ cluster.name } alignItems="center">
          <ClustersEntity clusterName={ cluster.name } fontWeight={ 600 } noCopy/>
        </Flex>
      )) }
    </Grid>
  );
};

const AddressClusters = ({ query, addressHash }: Props) => {
  const { data, isPending, isError } = query;

  if (isError) {
    return null;
  }

  if (isPending) {
    return <Skeleton loading h={ 8 } w={{ base: '50px', xl: '120px' }} borderRadius="base"/>;
  }

  if (!data?.result?.data || data.result.data.length === 0) {
    return null;
  }

  const ownedClusters = data.result.data.filter((cluster) =>
    cluster.owner && cluster.owner.toLowerCase() === addressHash.toLowerCase(),
  );

  if (ownedClusters.length === 0) {
    return null;
  }

  const totalRecords = ownedClusters.length > 40 ? '40+' : ownedClusters.length;

  return (
    <PopoverRoot>
      <Tooltip content="List of clusters registered to this address" disableOnMobile>
        <div>
          <PopoverTrigger>
            <Button
              size="sm"
              variant="dropdown"
              aria-label="Address clusters"
              fontWeight={ 500 }
              flexShrink={ 0 }
              columnGap={ 1 }
              role="group"
            >
              <IconSvg name="clusters" boxSize={ 5 } fill="currentColor"/>
              <chakra.span hideBelow="xl">{ totalRecords } Cluster{ ownedClusters.length > 1 ? 's' : '' }</chakra.span>
              <chakra.span hideFrom="xl">{ totalRecords }</chakra.span>
            </Button>
          </PopoverTrigger>
        </div>
      </Tooltip>
      <PopoverContent w={{ lg: '500px' }}>
        <PopoverBody textStyle="sm" display="flex" flexDir="column" rowGap={ 5 } alignItems="flex-start">
          <div>
            <chakra.span color="text.secondary" textStyle="xs">Attached to this address</chakra.span>
            <ClustersGrid data={ ownedClusters }/>
          </div>
          { ownedClusters.length > 10 && (
            <Link
              href={ route({ pathname: '/clusters', query: { q: addressHash } }) }
            >
              <span>More results</span>
              <chakra.span color="text.secondary"> ({ totalRecords })</chakra.span>
            </Link>
          ) }
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default AddressClusters;
