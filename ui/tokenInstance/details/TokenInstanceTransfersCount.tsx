import { Skeleton } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import useApiQuery from 'lib/api/useApiQuery';
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import LinkInternal from 'ui/shared/LinkInternal';

interface Props {
  hash: string;
  id: string;
  onClick: () => void;
}

const TokenInstanceTransfersCount = ({ hash, id, onClick }: Props) => {
  const transfersCountQuery = useApiQuery('token_instance_transfers_count', {
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
    <DetailsInfoItem
      title="Transfers"
      hint="Number of transfer for the token instance"
      isLoading={ transfersCountQuery.isPlaceholderData }
    >
      <Skeleton isLoaded={ !transfersCountQuery.isPlaceholderData } display="inline-block">
        <LinkInternal
          href={ url }
          onClick={ transfersCountQuery.data.transfers_count > 0 ? onClick : undefined }
        >
          { transfersCountQuery.data.transfers_count.toLocaleString() }
        </LinkInternal>
      </Skeleton>
    </DetailsInfoItem>
  );
};

export default TokenInstanceTransfersCount;
