import { Box, Grid, Flex } from '@chakra-ui/react';
import React from 'react';

import type { SearchResultAspect } from 'types/api/search';

import AddressIcon from 'ui/shared/address/AddressIcon';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';

interface Props {
  data: SearchResultAspect;
  isMobile: boolean | undefined;
  searchTerm: string;
}

const SearchBarSuggestAspect = ({ data, isMobile, searchTerm }: Props) => {
  const shouldHighlightHash = data.aspect_hash.toLowerCase() === searchTerm.toLowerCase();
  const icon = <AddressIcon address={{ hash: data.aspect_hash, is_contract: false, implementation_name: null }} flexShrink={ 0 }/>;
  const address = <HashStringShortenDynamic hash={ data.aspect_hash } isTooltipDisabled/>;

  if (isMobile) {
    return (
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
        </Flex>
      </Grid>
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
      </Flex>
    </Flex>
  );
};

export default React.memo(SearchBarSuggestAspect);
