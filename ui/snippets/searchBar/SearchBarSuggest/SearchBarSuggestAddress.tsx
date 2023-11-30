import { Box, Text, Flex } from '@chakra-ui/react';
import React from 'react';

import type { SearchResultAddressOrContractOrUniversalProfile } from 'types/api/search';

import highlightText from 'lib/highlightText';
import * as AddressEntity from 'ui/shared/entities/address/AddressEntity';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';

import { formattedLuksoName } from '../../../shared/entities/address/IdenticonUniversalProfileQuery';

interface Props {
  data: SearchResultAddressOrContractOrUniversalProfile;
  isMobile: boolean | undefined;
  searchTerm: string;
}

const SearchBarSuggestAddress = ({ data, isMobile, searchTerm }: Props) => {
  const icon = (
    <AddressEntity.Icon
      address={{
        hash: data.address,
        is_contract: data.type === 'contract' || data.type === 'universal_profile',
        name: '',
        is_verified: data.is_smart_contract_verified,
        implementation_name: null,
      }}
    />
  );
  const name = data.name && (
    <Text
      variant="secondary"
      overflow="hidden"
      whiteSpace="nowrap"
      textOverflow="ellipsis"
    >
      <span dangerouslySetInnerHTML={{ __html: highlightText(data.type === 'universal_profile' ? data.address : data.name, searchTerm) }}/>
    </Text>
  );

  const dynamicTitle = data.type === 'universal_profile' ? formattedLuksoName(data.address, data.name) : data.address;
  const address = <HashStringShortenDynamic hash={ dynamicTitle } isTooltipDisabled/>;

  if (isMobile) {
    return (
      <>
        <Flex alignItems="center">
          { icon }
          <Box
            as="span"
            display="block"
            overflow="hidden"
            whiteSpace="nowrap"
            fontWeight={ 700 }
          >
            { address }
          </Box>
        </Flex>
        { name }
      </>
    );
  }

  return (
    <Flex alignItems="center">
      <Flex alignItems="center" w="450px" mr={ 2 }>
        { icon }
        <Box
          as="span"
          display="block"
          overflow="hidden"
          whiteSpace="nowrap"
          fontWeight={ 700 }
        >
          { address }
        </Box>
      </Flex>
      { name }
    </Flex>
  );
};

export default React.memo(SearchBarSuggestAddress);
