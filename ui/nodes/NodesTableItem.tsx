import { Tr, Td, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { NodesPage, StakeValidatorInfo } from 'types/api/boolscan';

import useBoolRpcApi from 'lib/api/useBoolRpcApi';
import { formatAmount } from 'lib/utils/helpers';

import { tableColumns } from './data';

const NodesTableItem = ({
  isLoaded,
  data,
  index,
}: {
  isLoaded: boolean;
  data: NodesPage['items'][0];
  index: number;
}) => {
  const rpcRes = useBoolRpcApi('staking_validatorInfo', {
    queryParams: [ [ data.validatorAddress ] ],
  });

  const validatorInfo = React.useMemo<StakeValidatorInfo | undefined>(() => {
    return rpcRes.data?.[0];
  }, [ rpcRes.data ]);

  return (
    <Tr>
      { tableColumns.map((col) => {
        let text = col.render?.(data, index);

        if (validatorInfo) {
          if (col.id === 'totalStake') {
            text = formatAmount(validatorInfo.total_staking);
          } else if (col.id === 'ownerStake') {
            text = formatAmount(validatorInfo.owner_staking);
          } else if (col.id === 'nominators') {
            text = validatorInfo.nominators;
          }
        }

        const loaded =
            !(!isLoaded ||
            ([ 'totalStake', 'ownerStake', 'nominators' ].includes(col.id) &&
              rpcRes.isFetching));

        return (
          <Td key={ col.id } width={ col.width } textAlign={ col.textAlgin }>
            <Skeleton
              isLoaded={ loaded }
              display="inline-block"
              minW={ 10 }
              lineHeight="24px"
            >
              { text }
            </Skeleton>
          </Td>
        );
      }) }
    </Tr>
  );
};

export default NodesTableItem;
