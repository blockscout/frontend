// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra, Text, Flex } from '@chakra-ui/react';
import React from 'react';

import type { ItemsProps } from './types';
import type { schemas } from '@blockscout/api-types';
import type * as multichain from 'src/features/multichain/types/client';

import * as TxEntity from 'src/slices/tx/components/entity/TxEntity';

import Time from 'src/shared/date-and-time/Time';
import HashStringShortenDynamic from 'src/shared/texts/HashStringShortenDynamic';

const SearchBarSuggestTx = ({ data, isMobile, chainInfo }: ItemsProps<schemas['SearchResultTransaction'] | multichain.QuickSearchResultTransaction>) => {
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
