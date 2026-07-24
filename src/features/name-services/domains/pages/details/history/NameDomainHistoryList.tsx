// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type * as bens from '@blockscout/bens-types';

import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import NameDomainHistoryListItem from './NameDomainHistoryListItem';

interface Props {
  items: Array<bens.DomainEvent>;
  domain: bens.DetailedDomain | undefined;
  isLoading?: boolean;
  resetKey?: string;
}

const NameDomainHistoryList = ({ items, domain, isLoading, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: items, isEnabled: !isLoading, resetKey });

  return (
    <Box>
      { items.slice(0, renderedItemsNum).map((item, index) => (
        <NameDomainHistoryListItem
          key={ index }
          event={ item }
          domain={ domain }
          isLoading={ isLoading }
        />
      )) }
      <Box ref={ cutRef } h={ 0 }/>
    </Box>
  );
};

export default React.memo(NameDomainHistoryList);
