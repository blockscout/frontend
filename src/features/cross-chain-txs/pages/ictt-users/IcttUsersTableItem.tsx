// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { StatsChainRow } from '@blockscout/interchain-indexer-types';

import ChainSnippetList from 'src/shared/external-chains/ChainSnippetList';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'src/toolkit/chakra/table';

interface Props {
  data: StatsChainRow;
  isLoading?: boolean;
}

const IcttUsersTableItem = ({ data, isLoading }: Props) => {

  const chainInfo = React.useMemo(() => {
    return {
      name: data.name,
      id: String(data.id),
      logo: data.logo,
      explorer_url: data.explorer_url,
    };
  }, [ data.name, data.id, data.logo, data.explorer_url ]);

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
