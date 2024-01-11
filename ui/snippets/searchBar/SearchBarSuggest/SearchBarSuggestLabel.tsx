import { Grid, Text, Flex } from '@chakra-ui/react';
import React from 'react';

import type { SearchResultLabel } from 'types/api/search';

import highlightText from 'lib/highlightText';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  data: SearchResultLabel;
  isMobile: boolean | undefined;
  searchTerm: string;
}

const SearchBarSuggestLabel = ({ data, isMobile, searchTerm }: Props) => {
  const icon = <IconSvg name="publictags_slim" boxSize={ 5 } color="gray.500"/>;

  const name = (
    <Text
      fontWeight={ 700 }
      overflow="hidden"
      whiteSpace="nowrap"
      textOverflow="ellipsis"
    >
      <span dangerouslySetInnerHTML={{ __html: highlightText(data.name, searchTerm) }}/>
    </Text>
  );

  const address = (
    <Text
      overflow="hidden"
      whiteSpace="nowrap"
      variant="secondary"
    >
      <HashStringShortenDynamic hash={ data.address } isTooltipDisabled/>
    </Text>
  );

  const isContractVerified = data.is_smart_contract_verified && <IconSvg name="status/success" boxSize="14px" color="green.500" flexShrink={ 0 }/>;

  if (isMobile) {
    return (
      <>
        <Flex alignItems="center" overflow="hidden" gap={ 2 }>
          { icon }
          { name }
        </Flex>
        <Flex alignItems="center" overflow="hidden" gap={ 1 }>
          { address }
          { isContractVerified }
        </Flex>
      </>
    );
  }

  return (
    <Grid alignItems="center" gridTemplateColumns="228px max-content 24px" gap={ 2 }>
      <Flex alignItems="center" gap={ 2 }>
        { icon }
        { name }
      </Flex>
      <Flex alignItems="center" overflow="hidden" gap={ 1 }>
        { address }
        { isContractVerified }
      </Flex>
    </Grid>
  );
};

export default React.memo(SearchBarSuggestLabel);
