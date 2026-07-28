// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { ClustersLeaderboardObject } from 'src/features/name-services/clusters/types/api';

import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import ClustersLeaderboardListItem from './ClustersLeaderboardListItem';

interface Props {
  data: Array<ClustersLeaderboardObject>;
  isLoading?: boolean;
  resetKey?: string;
}

const ClustersLeaderboardList = ({ data, isLoading, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: data, isEnabled: !isLoading, resetKey });

  return (
    <>
      <Box>
        { data.slice(0, renderedItemsNum).map((item, index) => (
          <ClustersLeaderboardListItem
            key={ `${ item.name }-${ index }${ isLoading ? '-loading' : '' }` }
            item={ item }
            isLoading={ isLoading }
          />
        )) }
      </Box>
      <Box ref={ cutRef } h={ 0 }/>
    </>
  );
};

export default React.memo(ClustersLeaderboardList);
