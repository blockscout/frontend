// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type * as bens from '@blockscout/bens-types';

import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import NameDomainsListItem from './NameDomainsListItem';

interface Props {
  items: Array<bens.Domain>;
  isLoading?: boolean;
  resetKey?: string;
}

const NameDomainsList = ({ items, isLoading, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: items, isEnabled: !isLoading, resetKey });

  return (
    <>
      <Box>
        { items.slice(0, renderedItemsNum).map((item, index) => (
          <NameDomainsListItem
            key={ item.id + (isLoading ? index : '') }
            { ...item }
            isLoading={ Boolean(isLoading) }
          />
        )) }
      </Box>
      <Box ref={ cutRef } h={ 0 }/>
    </>
  );
};

export default React.memo(NameDomainsList);
