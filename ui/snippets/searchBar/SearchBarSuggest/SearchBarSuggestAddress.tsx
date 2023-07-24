import { Box, Text, Grid, Flex, Icon } from '@chakra-ui/react';
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
  const icon = <AddressIcon address={{ hash: data.address, is_contract: data.type === 'contract', implementation_name: null }} flexShrink={ 0 }/>;
  const name = data.name && (
    <Text
      variant="secondary"
      overflow="hidden"
      whiteSpace="nowrap"
      textOverflow="ellipsis"
    >
      <span dangerouslySetInnerHTML={{ __html: highlightText(data.name, searchTerm) }}/>
    </Text>
  );
  const isContractVerified = data.is_smart_contract_verified && <Icon as={ iconSuccess } color="green.500" ml={ 1 }/>;
  const address = <HashStringShortenDynamic hash={ data.address } isTooltipDisabled/>;

  if (isMobile) {
    return (
      <>
        <Grid templateColumns="24px 1fr" gap={ 2 }>
          { icon }
          <Flex alignItems="center" overflow="hidden">
            <Box
              as={ shouldHighlightHash ? 'mark' : 'span' }
              display="block"
              overflow="hidden"
              whiteSpace="nowrap"
              fontWeight={ 700 }
            >
              { address }
            </Box>
            { isContractVerified }
          </Flex>
        </Grid>
        { name }
      </>
    );
  }

  return (
    <Flex alignItems="center" gap={ 2 }>
      { icon }
      <Flex alignItems="center" w="450px" overflow="hidden">
        <Box
          as={ shouldHighlightHash ? 'mark' : 'span' }
          display="block"
          overflow="hidden"
          whiteSpace="nowrap"
          fontWeight={ 700 }
        >
          { address }
        </Box>
        { isContractVerified }
      </Flex>
      { name }
    </Flex>
  );
};

export default React.memo(SearchBarSuggestAddress);
