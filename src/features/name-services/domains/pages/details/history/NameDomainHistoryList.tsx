// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type * as bens from '@blockscout/bens-types';

import NameDomainHistoryListItem from './NameDomainHistoryListItem';

interface Props {
  items: Array<bens.DomainEvent>;
  domain: bens.DetailedDomain | undefined;
  isLoading?: boolean;
}

const NameDomainHistoryList = ({ items, domain, isLoading }: Props) => {
  return (
    <Box>
      { items.map((item, index) => (
        <NameDomainHistoryListItem
          key={ index }
          event={ item }
          domain={ domain }
          isLoading={ isLoading }
        />
      )) }
    </Box>
  );
};

export default React.memo(NameDomainHistoryList);
