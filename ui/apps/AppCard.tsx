import { Box, Heading, Icon, Image, Link, LinkBox, LinkOverlay, Text, useColorModeValue } from '@chakra-ui/react';
import type { MouseEvent } from 'react';
import React, { useCallback } from 'react';

import type { AppItemPreview } from 'types/client/apps';

import northEastIcon from 'icons/arrows/north-east.svg';

interface Props extends AppItemPreview {
  onInfoClick: (id: string) => void;
}

const AppCard = ({ id, title, logo, shortDescription, categories, onInfoClick }: Props) => {
  const categoriesLabel = categories.map(c => c.name).join(', ');

  const handleInfoClick = useCallback((event: MouseEvent) => {
    event.preventDefault();
    onInfoClick(id);
  }, [ onInfoClick, id ]);

  return (
    <LinkBox
      borderRadius="md"
      height="100%"
      padding={{ base: 3, sm: '20px' }}
      boxShadow={ `0 0 0 1px ${ useColorModeValue('var(--chakra-colors-gray-200)', 'var(--chakra-colors-gray-600)') }` }
    >
      <Box
        display={{ base: 'grid', sm: 'block' }}
        gridTemplateColumns={{ base: '64px 1fr', sm: '1fr' }}
        gridTemplateRows={{ base: '20px 20px auto', sm: 'none' }}
        gridRowGap={{ base: 2, sm: 'none' }}
        gridColumnGap={{ base: 4, sm: 'none' }}
        height="100%"
      >
        <Box
          gridRow={{ base: '1 / 4', sm: 'auto' }}
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
          gridColumn={{ base: 2, sm: 'auto' }}
          as="h3"
          marginBottom={ 2 }
          fontSize={{ base: 'sm', sm: 'lg' }}
          fontWeight="semibold"
        >
          <LinkOverlay
            href="#"
            _hover={{
              textDecoration: 'underline',
            }}
          >
            { title }
          </LinkOverlay>
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

        <Box
          position="absolute"
          right={{ base: 3, sm: '20px' }}
          bottom={{ base: 3, sm: '20px' }}
          paddingTop={ 1 }
          paddingLeft={ 8 }
          bgGradient={ `linear(to-r, transparent, ${ useColorModeValue('white', 'black') } 20%)` }
        >
          <Link
            fontSize={{ base: 'xs', sm: 'sm' }}
            display="flex"
            alignItems="center"
            paddingRight={{ sm: 2 }}
            maxW="100%"
            overflow="hidden"
            href="#"
            onClick={ handleInfoClick }
          >
            More

            <Icon
              as={ northEastIcon }
              marginLeft={ 1 }
            />
          </Link>
        </Box>
      </Box>
    </LinkBox>
  );
};

export default React.memo(AppCard);
