import { Text, Flex, Icon } from '@chakra-ui/react';
import React from 'react';

import type { SearchResultLabel } from 'types/api/search';

import labelIcon from 'icons/publictags.svg';
import iconSuccess from 'icons/status/success.svg';
import highlightText from 'lib/highlightText';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';

interface Props {
  data: SearchResultLabel;
  isMobile: boolean | undefined;
  searchTerm: string;
}

const SearchBarSuggestLabel = ({ data, isMobile, searchTerm }: Props) => {
  if (isMobile) {
    return (
      <>
        <Flex alignItems="center" overflow="hidden">
          <Icon as={ labelIcon } boxSize={ 6 } mr={ 2 } color="gray.500"/>
          <Text
            fontWeight={ 700 }
            overflow="hidden"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
            flexGrow={ 1 }
          >
            <span dangerouslySetInnerHTML={{ __html: highlightText(data.name, searchTerm) }}/>
          </Text>
        </Flex>
        <Flex alignItems="center" justifyContent="space-between" overflow="hidden">
          <Text overflow="hidden" whiteSpace="nowrap" variant="secondary">
            <HashStringShortenDynamic hash={ data.address } isTooltipDisabled/>
          </Text>
          { data.is_smart_contract_verified && <Icon as={ iconSuccess } color="green.500" ml={ 2 }/> }
        </Flex>
      </>
    );
  }

  return (
    <Flex alignItems="center">
      <Icon as={ labelIcon } boxSize={ 6 } mr={ 2 } color="gray.500"/>
      <Text
        fontWeight={ 700 }
        overflow="hidden"
        whiteSpace="nowrap"
        textOverflow="ellipsis"
        flexGrow={ 0 }
        w="200px"
      >
        <span dangerouslySetInnerHTML={{ __html: highlightText(data.name, searchTerm) }}/>
      </Text>
      <Text
        overflow="hidden"
        whiteSpace="nowrap"
        variant="secondary"
        ml={ 2 }
      >
        <HashStringShortenDynamic hash={ data.address } isTooltipDisabled/>
      </Text>
      { data.is_smart_contract_verified && <Icon as={ iconSuccess } color="green.500" ml={ 2 }/> }
    </Flex>
  );
};

export default React.memo(SearchBarSuggestLabel);
