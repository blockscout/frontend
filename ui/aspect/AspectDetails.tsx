import { Box, Grid, Skeleton } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { AspectDetail as TAspectDetail } from 'types/api/aspect';

import type { ResourceError } from 'lib/api/resources';
import getQueryParamString from 'lib/router/getQueryParamString';
import AddressHeadingInfo from 'ui/shared/AddressHeadingInfo';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

import AddressLink from '../shared/address/AddressLink';
import DetailsInfoItem from '../shared/DetailsInfoItem';

interface Props {
  aspectQuery: UseQueryResult<TAspectDetail, ResourceError>;
  scrollRef?: React.RefObject<HTMLDivElement>;
}

const AspectDetails = ({ aspectQuery }: Props) => {
  const router = useRouter();

  const addressHash = getQueryParamString(router.query.hash);

  const errorData = React.useMemo(() => ({
    hash: addressHash || '',
    bound_address_count: 0,
    deployed_tx: '',
    join_points: [],
    properties: {},
    versions: [],
  }), [ addressHash ]);

  const lastVersion = React.useMemo(() => {
    if (aspectQuery.data?.versions.length) {
      return aspectQuery.data.versions[aspectQuery.data.versions.length - 1].version;
    }
  }, [ aspectQuery.data?.versions ]);

  const is404Error = aspectQuery.isError && 'status' in aspectQuery.error && aspectQuery.error.status === 404;
  const is422Error = aspectQuery.isError && 'status' in aspectQuery.error && aspectQuery.error.status === 422;

  if (aspectQuery.isError && is422Error) {
    throw Error('Address fetch error', { cause: aspectQuery.error as unknown as Error });
  }

  if (aspectQuery.isError && !is404Error) {
    return <DataFetchAlert/>;
  }

  const data = aspectQuery.isError ? errorData : aspectQuery.data;

  if (!data) {
    return null;
  }

  const loading = aspectQuery.isPlaceholderData;
  return (
    <Box>
      <AddressHeadingInfo aspect={ data } isLoading={ loading } isLinkDisabled/>
      <Grid
        mt={ 8 }
        columnGap={ 8 }
        rowGap={{ base: 1, lg: 3 }}
        templateColumns={{ base: 'minmax(0, 1fr)', lg: 'auto minmax(0, 1fr)' }} overflow="hidden"
      >
        <DetailsInfoItem
          title="Version"
          hint="Latest version of this Aspect"
          isLoading={ loading }
        >
          <Skeleton isLoaded={ !loading }>{ lastVersion }</Skeleton>

        </DetailsInfoItem>
        <DetailsInfoItem
          title="Deployed"
          hint="Deployment transaction hash of this Aspect"
          isLoading={ loading }
        >
          <AddressLink
            hash={ aspectQuery.data?.deployed_tx }
            type="transaction"
            fontWeight="700"
            isLoading={ loading }
          />
        </DetailsInfoItem>
        <DetailsInfoItem
          title="Join Points"
          hint="Enabled join points of this Aspect, containing verify tx, pre tx execution, post tx execution, pre contract call and post contract call"
          isLoading={ loading }
        >
          <Skeleton isLoaded={ !loading }>{ aspectQuery.data?.join_points.join(' ') }</Skeleton>
        </DetailsInfoItem>
        <DetailsInfoItem
          title="Bound Addresses"
          hint="Number of accounts those are bound with this Aspect"
          isLoading={ loading }
        >
          <Skeleton isLoaded={ !loading }>{ aspectQuery.data?.bound_address_count }</Skeleton>
        </DetailsInfoItem>
      </Grid>
    </Box>
  );
};

export default React.memo(AspectDetails);
