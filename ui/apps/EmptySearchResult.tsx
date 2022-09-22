import { Box, Heading, Icon, Text } from '@chakra-ui/react';
import React from 'react';

import emptyIcon from 'icons/empty_search_result.svg';
import { apos } from 'lib/html-entities';

const EmptySearchResult = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Icon
        as={ emptyIcon }
        boxSize={ 60 }
        display="block"
      />

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
        Couldn{ apos }t find an app that matches your filter query.
      </Text>
    </Box>
  );
};

export default EmptySearchResult;
