// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type * as tac from '@blockscout/tac-operation-lifecycle-types';

import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import TacOperationsListItem from './TacOperationsListItem';

type Props = {
  items: Array<tac.OperationBriefDetails>;
  isLoading?: boolean;
  resetKey?: string;
};

const TacOperationsList = ({ items, isLoading, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: items, isEnabled: !isLoading, resetKey });

  return (
    <Box>
      { items.slice(0, renderedItemsNum).map((item, index) => (
        <TacOperationsListItem
          key={ String(item.operation_id) + (isLoading ? index : '') }
          isLoading={ isLoading }
          item={ item }
        />
      )) }
      <Box ref={ cutRef } h={ 0 }/>
    </Box>
  );
};

export default TacOperationsList;
