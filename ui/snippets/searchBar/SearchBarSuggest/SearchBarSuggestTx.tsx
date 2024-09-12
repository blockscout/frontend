import { Text, Flex } from '@chakra-ui/react';
import React from 'react';

import type { SearchResultTx } from 'types/api/search';

// import dayjs from 'lib/date/dayjs';
import * as TxEntity from 'ui/shared/entities/tx/TxEntity';
// import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import IconSvg from 'ui/shared/IconSvg';
import { formatPubKey } from 'ui/storage/utils';

interface Props {
  data: SearchResultTx;
  isMobile: boolean | undefined;
  searchTerm: string;
  isFirst?: boolean;
}

const SearchBarSuggestTx = ({ data, isMobile, isFirst }: Props) => {
  const icon = <TxEntity.Icon/>;
  const hash = (
    // <chakra.mark overflow="hidden" whiteSpace="nowrap" fontWeight={ 700 }>
    //   <HashStringShortenDynamic hash={ formatPubKey(data.tx_hash, 8, 9) || '' } isTooltipDisabled/>
    // </chakra.mark>
    <Text color="#8A55FD">{ formatPubKey(data.tx_hash, 8, 9) || '' }</Text>
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
