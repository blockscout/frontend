import { Box, Text, Flex } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';

import type { SearchResultAddressOrContract } from 'types/api/search';

import highlightText from 'lib/highlightText';
import * as AddressEntity from 'ui/shared/entities/address/AddressEntity';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';

import { getUniversalProfile } from '../../../shared/entities/address/IdenticonUniversalProfileQuery';

interface Props {
  data: SearchResultAddressOrContract;
  isMobile: boolean | undefined;
  searchTerm: string;
}

const SearchBarSuggestAddress = ({ data, isMobile, searchTerm }: Props) => {
  const queryClient = useQueryClient();
  const [ type, setType ] = useState(data.type);
  useEffect(() => { // this causes a sort of loading state where the address suddenly switches to up name - needs fix?
    (async() => {
      const upData = await getUniversalProfile(data.address, queryClient);
      if (upData === undefined) {
        return;
      }
      if (upData.LSP3Profile !== undefined) {
        setType('contract'); // when the type is contract the icon will know that it needs to get UP profile picture
      }
    })();
  }, [ data, queryClient, setType ]);

  const shouldHighlightHash = data.address.toLowerCase() === searchTerm.toLowerCase();
  const icon = (
    <AddressEntity.Icon
      address={{ hash: data.address, is_contract: type === 'contract', name: '', is_verified: data.is_smart_contract_verified, implementation_name: null }}
    />
  );
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
  const address = <HashStringShortenDynamic hash={ data.address } isTooltipDisabled/>;

  if (isMobile) {
    return (
      <>
        <Flex alignItems="center">
          { icon }
          <Box
            as={ shouldHighlightHash ? 'mark' : 'span' }
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
          as={ shouldHighlightHash ? 'mark' : 'span' }
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
