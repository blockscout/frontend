import { Skeleton, HStack } from '@chakra-ui/react';
import React from 'react';

import type { NodesPage, StakeValidatorInfo } from 'types/api/boolscan';

import useBoolRpcApi from 'lib/api/useBoolRpcApi';
import { formatAmount } from 'lib/utils/helpers';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';

import { tableColumns } from './data';

const NodesTableItemMobile = ({
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
    <ListItemMobile rowGap={ 3 }>
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

        const loaded = !(
          !isLoaded ||
            ([ 'totalStake', 'ownerStake', 'nominators' ].includes(col.id) &&
              rpcRes.isFetching)
        );
        return (
          <HStack key={ col.id } spacing={ 3 }>
            <Skeleton isLoaded={ isLoaded } fontSize="sm" fontWeight={ 500 }>
              { col.label }
            </Skeleton>
            <Skeleton
              isLoaded={ loaded }
              fontSize="sm"
              ml="auto"
              minW={ 10 }
              color="text_secondary"
            >
              <span>{ text }</span>
            </Skeleton>
          </HStack>
        );
      }) }
    </ListItemMobile>
  );
};

export default NodesTableItemMobile;
