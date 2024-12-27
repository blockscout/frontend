import { Flex, chakra } from '@chakra-ui/react';
import React from 'react';

import type { ItemsProps } from './types';
import type { SearchResultTx } from 'types/api/search';

// import dayjs from 'lib/date/dayjs';
import * as TxEntity from 'ui/shared/entities/tx/TxEntity';
// import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import IconSvg from 'ui/shared/IconSvg';

const SearchBarSuggestTx = ({ data, isMobile, isFirst }: ItemsProps<SearchResultTx>) => {
  const icon = <TxEntity.Icon/>;
  const hash = (
    <chakra.mark overflow="hidden" whiteSpace="nowrap" fontWeight={ 700 }>
      <HashStringShortenDynamic hash={ data.transaction_hash } isTooltipDisabled/>
    </chakra.mark>
  );
  // const date = dayjs(data.timestamp).format('llll');

  if (isMobile) {
    return (
      <>
        <Flex alignItems="center">
          { icon }
          { hash }
        </Flex>
        { /* <Text variant="secondary">{ date }</Text> */ }
      </>
    );
  }

  return (
    <Flex justifyContent="space-between">
      <Flex alignItems="center" minW={ 0 }>
        { icon }
        { hash }
      </Flex>
      { /* <Text variant="secondary" textAlign="end" flexShrink={ 0 } ml="auto">{ date }</Text> */ }
      {
        isFirst ? (
          <Flex justifyContent="end" alignItems="center">
            <IconSvg transform="rotate(-180deg)" float="right" w="24px" h="24px" mr="8px" name="arrows/east"/>
          </Flex>
        ) : null
      }
    </Flex>
  );
};

export default React.memo(SearchBarSuggestTx);
