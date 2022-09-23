import { Box, Heading, Image, Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { AppItemPreview } from 'types/client/apps';

const AppCard = ({ title, logo, shortDescription, categories }: AppItemPreview) => {
  const categoriesLabel = categories.map(c => c.name).join(', ');

  return (
    <Box
      borderRadius={{ base: 'none', sm: 'md' }}
      height="100%"
      padding={{ base: '16px', sm: '20px' }}
      boxShadow={ `0 0 0 1px ${ useColorModeValue('var(--chakra-colors-gray-200)', 'var(--chakra-colors-gray-600)') }` }
    >
      <Box overflow="hidden" height="100%">
        <Box
          marginBottom={ 4 }
          w={{ base: '64px', sm: '96px' }}
          h={{ base: '64px', sm: '96px' }}
        >
          <Image
            src={ logo }
            alt={ `${ title } app icon` }
          />
        </Box>

        <Heading
          as="h3"
          marginBottom={ 2 }
          fontSize={{ base: 'sm', sm: 'lg' }}
          fontWeight="semibold"
        >
          { title }
        </Heading>

        <Text
          marginBottom={ 2 }
          variant="secondary"
          fontSize="xs"
        >
          { categoriesLabel }
        </Text>

        <Text
          fontSize={{ base: 'xs', sm: 'sm' }}
          lineHeight="20px"
          noOfLines={ 4 }
        >
          { shortDescription }
        </Text>
      </Box>
    </Box>
  );
};

export default AppCard;
