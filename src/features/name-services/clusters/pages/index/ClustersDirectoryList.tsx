// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { ClustersDirectoryObject } from 'src/features/name-services/clusters/types/api';

import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import ClustersDirectoryListItem from './ClustersDirectoryListItem';

interface Props {
  data: Array<ClustersDirectoryObject>;
  isLoading?: boolean;
  isClusterDetailsLoading?: boolean;
  resetKey?: string;
}

const ClustersDirectoryList = ({ data, isLoading, isClusterDetailsLoading, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: data, isEnabled: !isLoading, resetKey });

  return (
    <>
      <Box>
        { data.slice(0, renderedItemsNum).map((item, index) => (
          <ClustersDirectoryListItem
            key={ `${ item.name }-${ index }${ isLoading ? '-loading' : '' }` }
            item={ item }
            isLoading={ isLoading }
            isClusterDetailsLoading={ isClusterDetailsLoading }
          />
        )) }
      </Box>
      <Box ref={ cutRef } h={ 0 }/>
    </>
  );
};

export default React.memo(ClustersDirectoryList);
