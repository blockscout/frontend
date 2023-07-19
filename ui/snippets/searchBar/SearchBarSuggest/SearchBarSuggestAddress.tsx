import { Box, Text, Flex, Icon } from '@chakra-ui/react';
import React from 'react';

import type { SearchResultAddressOrContract } from 'types/api/search';

import iconSuccess from 'icons/status/success.svg';
import highlightText from 'lib/highlightText';
import AddressIcon from 'ui/shared/address/AddressIcon';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';

interface Props {
  data: SearchResultAddressOrContract;
  isMobile: boolean | undefined;
  searchTerm: string;
}

const SearchBarSuggestAddress = ({ data, isMobile, searchTerm }: Props) => {
  const shouldHighlightHash = data.address.toLowerCase() === searchTerm.toLowerCase();

  if (isMobile) {
    return (
      <>
        <Flex alignItems="center" justifyContent="space-between">
          <AddressIcon
            address={{ hash: data.address, is_contract: data.type === 'contract', implementation_name: null }}
            mr={ 2 }
            flexShrink={ 0 }

          />
          <Box
            as={ shouldHighlightHash ? 'mark' : 'span' }
            display="block"
            overflow="hidden"
            whiteSpace="nowrap"
            fontWeight={ 700 }
            flexGrow={ 1 }

          >
            <HashStringShortenDynamic hash={ data.address } isTooltipDisabled/>
          </Box>
          { data.is_smart_contract_verified && <Icon as={ iconSuccess } color="green.500" ml={ 2 }/> }
        </Flex>
        { data.name && (
          <Text
            variant="secondary"
            overflow="hidden"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
            flexGrow={ 1 }
          >
            <span dangerouslySetInnerHTML={{ __html: highlightText(data.name, searchTerm) }}/>
          </Text>
        ) }
      </>
    );
  }

  return (
    <Flex alignItems="center">
      <AddressIcon
        address={{ hash: data.address, is_contract: data.type === 'contract', implementation_name: null }}
        mr={ 2 }
        flexShrink={ 0 }

      />
      <Flex alignItems="center" w="420px">
        <Box
          as={ shouldHighlightHash ? 'mark' : 'span' }
          display="block"
          overflow="hidden"
          whiteSpace="nowrap"
          fontWeight={ 700 }
        >
          <HashStringShortenDynamic hash={ data.address } isTooltipDisabled/>
        </Box>
        { data.is_smart_contract_verified && <Icon as={ iconSuccess } color="green.500" ml={ 2 }/> }
      </Flex>
      { data.name && (
        <Text
          variant="secondary"
          overflow="hidden"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
          flexGrow={ 0 }
          ml={ 6 }
        >
          <span dangerouslySetInnerHTML={{ __html: highlightText(data.name, searchTerm) }}/>
        </Text>
      ) }
    </Flex>
  );
};

export default React.memo(SearchBarSuggestAddress);
