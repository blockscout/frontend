// SPDX-License-Identifier: LicenseRef-Blockscout

import { route } from 'nextjs-routes';
import React from 'react';

import useApiQuery from 'src/api/hooks/useApiQuery';

import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';

import { Link } from 'src/toolkit/chakra/link';
import { Skeleton } from 'src/toolkit/chakra/skeleton';

interface Props {
  hash: string;
  id: string;
}

const TokenInstanceTransfersCount = ({ hash, id }: Props) => {
  const transfersCountQuery = useApiQuery('core:token_instance_transfers_count', {
    pathParams: { hash, id },
    queryOptions: {
      enabled: Boolean(hash && id),
      placeholderData: {
        transfers_count: 420,
      },
    },
  });

  if (transfersCountQuery.isError) {
    return null;
  }

  if (!transfersCountQuery.data?.transfers_count) {
    return null;
  }

  const url = transfersCountQuery.data.transfers_count > 0 ?
    route({ pathname: '/token/[hash]/instance/[id]', query: { hash, id, tab: 'token_transfers' } }) :
    undefined;

  return (
    <>
      <DetailedInfo.ItemLabel
        hint="Number of transfer for the token instance"
        isLoading={ transfersCountQuery.isPlaceholderData }
      >
        Transfers
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton loading={ transfersCountQuery.isPlaceholderData } display="inline-block">
          <Link href={ url }>
            { transfersCountQuery.data.transfers_count.toLocaleString() }
          </Link>
        </Skeleton>
      </DetailedInfo.ItemValue>
    </>
  );
};

export default TokenInstanceTransfersCount;
