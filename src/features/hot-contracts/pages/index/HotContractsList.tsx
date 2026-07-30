// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import HotContractsListItem from './HotContractsListItem';

interface Props {
  items: Array<schemas['HotContract']>;
  isLoading?: boolean;
  exchangeRate: string | null;
  resetKey?: string;
}

const HotContractsList = ({ items, isLoading, exchangeRate, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: items, isEnabled: !isLoading, resetKey });

  return (
    <>
      <Box>
        { items.slice(0, renderedItemsNum).map((item, index) => (
          <HotContractsListItem
            key={ item.contract_address.hash + (isLoading ? index : '') }
            isLoading={ isLoading }
            data={ item }
            exchangeRate={ exchangeRate }
          />
        )) }
      </Box>
      <Box ref={ cutRef } h={ 0 }/>
    </>
  );
};

export default React.memo(HotContractsList);
