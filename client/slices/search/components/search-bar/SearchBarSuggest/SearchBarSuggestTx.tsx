// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra, Text, Flex } from '@chakra-ui/react';
import React from 'react';

import type { ItemsProps } from './types';
import type * as multichain from 'client/features/multichain/types/client';
import type { SearchResultTx } from 'client/slices/search/types/api';

import * as TxEntity from 'client/slices/tx/components/entity/TxEntity';

import Time from 'client/shared/date-and-time/Time';
import HashStringShortenDynamic from 'client/shared/texts/HashStringShortenDynamic';

const SearchBarSuggestTx = ({ data, isMobile, chainInfo }: ItemsProps<SearchResultTx | multichain.QuickSearchResultTransaction>) => {
  const icon = <TxEntity.Icon chain={ chainInfo }/>;
  const hash = (
    <chakra.mark overflow="hidden" whiteSpace="nowrap" fontWeight={ 700 }>
      <HashStringShortenDynamic hash={ data.transaction_hash } noTooltip/>
    </chakra.mark>
  );
  const date = 'timestamp' in data && data.timestamp ? <Time timestamp={ data.timestamp } format="lll_s"/> : undefined;

  if (isMobile) {
    return (
      <>
        <Flex alignItems="center">
          { icon }
          { hash }
        </Flex>
        <Text color="text.secondary">{ date }</Text>
      </>
    );
  }

  return (
    <Flex columnGap={ 2 }>
      <Flex alignItems="center" minW={ 0 }>
        { icon }
        { hash }
      </Flex>
      <Text color="text.secondary" textAlign="end" flexShrink={ 0 } ml="auto">{ date }</Text>
    </Flex>
  );
};

export default React.memo(SearchBarSuggestTx);
