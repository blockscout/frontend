import { Box, Heading, Text } from '@chakra-ui/react';
import React from 'react';

import IconSvg from 'ui/shared/IconSvg';

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
      <IconSvg
        name="empty_search_result"
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
