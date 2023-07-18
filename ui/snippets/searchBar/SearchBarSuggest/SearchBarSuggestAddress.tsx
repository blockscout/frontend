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
          { data.name && (
            <Text
              fontWeight={ 700 }
              overflow="hidden"
              whiteSpace="nowrap"
              textOverflow="ellipsis"
              flexGrow={ 1 }
            >
              <span dangerouslySetInnerHTML={{ __html: highlightText(data.name, searchTerm) }}/>
            </Text>
          ) }
          { !data.name && (
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
          ) }
          { !data.name && data.is_smart_contract_verified && <Icon as={ iconSuccess } color="green.500" ml={ 2 }/> }
        </Flex>
        { data.name && (
          <Flex alignItems="center" justifyContent="space-between">
            <Text
              as={ shouldHighlightHash ? 'mark' : 'span' }
              overflow="hidden"
              whiteSpace="nowrap"
              variant="secondary"
              flexGrow={ 1 }
            >
              <HashStringShortenDynamic hash={ data.address } isTooltipDisabled/>
            </Text>
            { data.is_smart_contract_verified && <Icon as={ iconSuccess } color="green.500" ml={ 2 }/> }
          </Flex>
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
      { data.name && (
        <>
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
            as={ shouldHighlightHash ? 'mark' : 'span' }
            overflow="hidden"
            whiteSpace="nowrap"
            variant="secondary"
            ml={ 2 }
          >
            <HashStringShortenDynamic hash={ data.address } isTooltipDisabled/>
          </Text>
          { data.is_smart_contract_verified && <Icon as={ iconSuccess } color="green.500" ml={ 2 }/> }
        </>
      ) }
      { !data.name && (
        <>
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
        </>
      ) }
    </Flex>
  );
};

export default React.memo(SearchBarSuggestAddress);
