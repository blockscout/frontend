import { Box, Icon } from '@chakra-ui/react';
import React from 'react';

// This icon doesn't work properly when it is in the sprite
// Probably because of radial gradient
// eslint-disable-next-line no-restricted-imports
import emptySearchResultIcon from 'icons/empty_search_result.svg';
import { Heading } from 'toolkit/chakra/heading';

interface Props {
  text: string | React.JSX.Element;
}

const EmptySearchResult = ({ text }: Props) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      mt="50px"
    >
      <Icon
        as={ emptySearchResultIcon }
        w={{ base: '160px', sm: '240px' }}
        h="auto"
        mb={{ base: 4, sm: 6 }}
      />

      <Heading level="3" mb={ 2 }>
        No results
      </Heading>

      <Box fontSize={{ base: 'sm', sm: 'md' }} textAlign="center">
        { text }
      </Box>
    </Box>
  );
};

export default EmptySearchResult;
