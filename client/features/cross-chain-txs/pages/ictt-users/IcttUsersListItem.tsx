import { Grid } from '@chakra-ui/react';
import React from 'react';

import type { StatsChainRow } from '@blockscout/interchain-indexer-types';

import { Skeleton } from 'toolkit/chakra/skeleton';
import ChainSnippetList from 'ui/shared/externalChains/ChainSnippetList';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';

interface Props {
  data: StatsChainRow;
  isLoading?: boolean;
}

const IcttUsersListItem = ({ data, isLoading }: Props) => {
  const chainInfo = React.useMemo(() => {
    return {
      name: data.name,
      id: String(data.id),
      logo: data.logo,
      explorer_url: data.explorer_url,
    };
  }, [ data.name, data.id, data.logo, data.explorer_url ]);

  return (
    <ListItemMobile rowGap={ 3 } py={ 4 } fontSize="sm" alignItems="stretch">
      <ChainSnippetList data={ chainInfo } isLoading={ isLoading }/>
      <Grid gridTemplateColumns="200px 1fr" columnGap={ 2 } rowGap={ 3 }>
        <Skeleton loading={ isLoading } fontWeight={ 500 }>
          <span>Number of unique ICTT users</span>
        </Skeleton>
        <Skeleton loading={ isLoading }>
          <span>{ data.unique_transfer_users_count }</span>
        </Skeleton>
      </Grid>
    </ListItemMobile>
  );
};

export default React.memo(IcttUsersListItem);
