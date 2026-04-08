import React from 'react';

import type { StatsChainRow } from '@blockscout/interchain-indexer-types';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import ChainSnippetList from 'ui/shared/externalChains/ChainSnippetList';

interface Props {
  data: StatsChainRow;
  isLoading?: boolean;
}

const IcttUsersTableItem = ({ data, isLoading }: Props) => {

  const chainInfo = React.useMemo(() => {
    return {
      name: data.name,
      id: String(data.chain_id),
      logo: data.icon_url,
      explorer_url: data.explorer_url,
    };
  }, [ data.name, data.chain_id, data.icon_url, data.explorer_url ]);

  return (
    <TableRow>
      <TableCell>
        <ChainSnippetList data={ chainInfo } isLoading={ isLoading }/>
      </TableCell>
      <TableCell isNumeric>
        <Skeleton loading={ isLoading } w="fit-content" ml="auto">
          <span>
            { data.unique_transfer_users_count }
          </span>
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(IcttUsersTableItem);
