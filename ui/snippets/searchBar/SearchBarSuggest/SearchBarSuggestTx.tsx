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
  const icon = <Icon as={ txIcon } boxSize={ 6 } color="gray.500"/>;
  const hash = (
    <chakra.mark overflow="hidden" whiteSpace="nowrap" fontWeight={ 700 }>
      <HashStringShortenDynamic hash={ data.tx_hash } isTooltipDisabled/>
    </chakra.mark>
  );
  const date = dayjs(data.timestamp).format('llll');

  if (isMobile) {
    return (
      <>
        <Flex alignItems="center" justifyContent="space-between" gap={ 2 }>
          { icon }
          { hash }
        </Flex>
        <Text variant="secondary">{ date }</Text>
      </>
    );
  }

  return (
    <Grid templateColumns="24px minmax(auto, max-content) auto" gap={ 2 }>
      { icon }
      { hash }
      <Text variant="secondary" textAlign="end">{ date }</Text>
    </Grid>
  );
};

export default React.memo(SearchBarSuggestTx);
