// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra, Flex } from '@chakra-ui/react';
import React from 'react';

import type { SearchResultUserOp } from 'src/features/user-ops/types/api';
import type { ItemsProps } from 'src/slices/search/components/search-bar/SearchBarSuggest/types';

import * as UserOpEntity from 'src/features/user-ops/components/entity/UserOpEntity';

import Time from 'src/shared/date-and-time/Time';
import HashStringShortenDynamic from 'src/shared/texts/HashStringShortenDynamic';

const SearchBarSuggestUserOp = ({ data, isMobile }: ItemsProps<SearchResultUserOp>) => {
  const icon = <UserOpEntity.Icon/>;
  const hash = (
    <chakra.mark overflow="hidden" whiteSpace="nowrap" fontWeight={ 700 }>
      <HashStringShortenDynamic hash={ data.user_operation_hash } noTooltip/>
    </chakra.mark>
  );

  if (isMobile) {
    return (
      <>
        <Flex alignItems="center">
          { icon }
          { hash }
        </Flex>
        <Time timestamp={ data.timestamp } color="text.secondary" format="lll_s"/>
      </>
    );
  }

  return (
    <Flex columnGap={ 2 }>
      <Flex alignItems="center" minW={ 0 }>
        { icon }
        { hash }
      </Flex>
      <Time timestamp={ data.timestamp } color="text.secondary" textAlign="end" flexShrink={ 0 } ml="auto" format="lll_s"/>
    </Flex>
  );
};

export default React.memo(SearchBarSuggestUserOp);
