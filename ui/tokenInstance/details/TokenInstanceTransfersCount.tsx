import { route } from 'nextjs-routes';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import LinkInternal from 'ui/shared/LinkInternal';
import DetailsSkeletonRow from 'ui/shared/skeletons/DetailsSkeletonRow';

interface Props {
  hash: string;
  id: string;
  onClick: () => void;
}

const TokenInstanceTransfersCount = ({ hash, id, onClick }: Props) => {
  const transfersCountQuery = useApiQuery('token_instance_transfers_count', {
    pathParams: { hash, id },
  });

  if (transfersCountQuery.isError) {
    return null;
  }

  if (transfersCountQuery.isLoading) {
    return <DetailsSkeletonRow w="30%"/>;
  }

  if (!transfersCountQuery.data.transfers_count) {
    return null;
  }

  const url = transfersCountQuery.data.transfers_count > 0 ?
    route({ pathname: '/token/[hash]/instance/[id]', query: { hash, id, tab: 'token_transfers' } }) :
    undefined;

  return (
    <DetailsInfoItem
      title="Transfers"
      hint="Number of transfer for the token instance"
    >
      <LinkInternal
        href={ url }
        onClick={ transfersCountQuery.data.transfers_count > 0 ? onClick : undefined }
      >
        { transfersCountQuery.data.transfers_count }
      </LinkInternal>
    </DetailsInfoItem>
  );
};

export default TokenInstanceTransfersCount;
