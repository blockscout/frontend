// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, chakra } from '@chakra-ui/react';
import React from 'react';

import type { SearchResultTacOperation } from 'client/features/chain-variants/tac/types/api';
import type { ItemsProps } from 'client/slices/search/components/search-bar/SearchBarSuggest/types';

import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import Time from 'ui/shared/time/Time';

import * as TacOperationEntity from './TacOperationEntity';
import TacOperationStatus from './TacOperationStatus';

const SearchBarSuggestTacOperation = ({ data, isMobile }: ItemsProps<SearchResultTacOperation>) => {
  const icon = <TacOperationEntity.Icon type={ data.tac_operation.type }/>;
  const hash = (
    <chakra.mark overflow="hidden" whiteSpace="nowrap" fontWeight={ 700 } mr={ 2 }>
      <HashStringShortenDynamic hash={ data.tac_operation.operation_id } noTooltip/>
    </chakra.mark>
  );
  const status = <TacOperationStatus status={ data.tac_operation.type }/>;

  if (isMobile) {
    return (
      <>
        <Flex alignItems="center">
          { icon }
          { hash }
          { status }
        </Flex>
        <Time timestamp={ data.tac_operation.timestamp } color="text.secondary" format="lll_s"/>
      </>
    );
  }

  return (
    <Flex columnGap={ 2 }>
      <Flex alignItems="center" minW={ 0 }>
        { icon }
        { hash }
        { status }
      </Flex>
      <Time timestamp={ data.tac_operation.timestamp } color="text.secondary" textAlign="end" flexShrink={ 0 } ml="auto" format="lll_s"/>
    </Flex>
  );
};

export default React.memo(SearchBarSuggestTacOperation);
