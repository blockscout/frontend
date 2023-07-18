import { chakra, Grid, Text, Flex, Icon } from '@chakra-ui/react';
import React from 'react';

import type { SearchResultTx } from 'types/api/search';

import txIcon from 'icons/transactions.svg';
import dayjs from 'lib/date/dayjs';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';

interface Props {
  data: SearchResultTx;
  isMobile: boolean | undefined;
  searchTerm: string;
}

const SearchBarSuggestTx = ({ data, isMobile }: Props) => {
  if (isMobile) {
    return (
      <>
        <Flex alignItems="center" justifyContent="space-between">
          <Icon as={ txIcon } boxSize={ 6 } mr={ 2 } color="gray.500"/>
          <chakra.mark overflow="hidden" whiteSpace="nowrap" fontWeight={ 700 }>
            <HashStringShortenDynamic hash={ data.tx_hash } isTooltipDisabled/>
          </chakra.mark>
        </Flex>
        <Text variant="secondary">{ dayjs(data.timestamp).format('llll') }</Text>
      </>
    );
  }

  return (
    <Grid templateColumns="24px 1fr auto" gap={ 2 }>
      <Icon as={ txIcon } boxSize={ 6 } color="gray.500"/>
      <chakra.mark overflow="hidden" whiteSpace="nowrap" display="block" fontWeight={ 700 } width="fit-content">
        <HashStringShortenDynamic hash={ data.tx_hash } isTooltipDisabled/>
      </chakra.mark>
      <Text variant="secondary">{ dayjs(data.timestamp).format('llll') }</Text>
    </Grid>
  );
};

export default React.memo(SearchBarSuggestTx);
