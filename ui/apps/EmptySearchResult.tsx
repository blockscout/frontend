import { Box, Heading, Icon, Text } from '@chakra-ui/react';
import React from 'react';

import emptyIcon from 'icons/empty_search_result.svg';

interface Props {
  text: string;
}

const EmptySearchResult = ({ text }: Props) => {
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
        { text }
      </Text>
    </Box>
  );
};

export default EmptySearchResult;
