import { Box, Image, Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { AppItemPreview } from '~/types/client/apps';

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

        <Text
          as="h3"
          marginBottom={ 2 }
          fontSize={{ base: 'sm', sm: 'sm' }}
          fontWeight="semibold"
        >
          { title }
        </Text>

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
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 4,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          overflow="hidden"
        >
          { shortDescription }
        </Text>
      </Box>
    </Box>
  );
};

export default AppCard;
