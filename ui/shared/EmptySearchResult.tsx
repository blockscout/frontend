import { Box, Heading, Text, Icon } from '@chakra-ui/react';
import React from 'react';

// This icon doesn't work properly when it is in the sprite
// Probably because of radial gradient
// eslint-disable-next-line no-restricted-imports
import emptySearchResultIcon from 'icons/empty_search_result.svg';

interface Props {
  text: string | JSX.Element;
}

const EmptySearchResult = ({ text }: Props) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Icon as={ emptySearchResultIcon } boxSize={ 60 }/>

      <Heading
        as="h3"
        marginBottom={ 2 }
        fontSize={{ base: '2xl', sm: '3xl' }}
        fontWeight="semibold"
      >
        No results
      </Heading>

      <Text
        fontSize={{ base: 'sm' }}
        variant="secondary"
        align="center"
      >
        { text }
      </Text>
    </Box>
  );
};

export default EmptySearchResult;
