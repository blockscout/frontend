// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { StatsChainRow } from '@blockscout/interchain-indexer-types';

import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import IcttUsersListItem from './IcttUsersListItem';

interface Props {
  data: Array<StatsChainRow>;
  isLoading?: boolean;
  resetKey?: string;
}

const IcttUsersList = ({ data, isLoading, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: data, isEnabled: !isLoading, resetKey });

  return (
    <Box>
      { data.slice(0, renderedItemsNum).map((item, index) => (
        <IcttUsersListItem
          key={ String(item.id) + (isLoading ? index : '') }
          data={ item }
          isLoading={ isLoading }
        />
      )) }
      <Box ref={ cutRef } h={ 0 }/>
    </Box>
  );
};

export default React.memo(IcttUsersList);
