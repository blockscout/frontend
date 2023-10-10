import { Flex, useColorModeValue, Icon, Link, Text } from '@chakra-ui/react';
import React from 'react';

import caretRight from 'icons/arrows/caret-right.svg';

const TopicsHighlight = ({ title, items }: { title: string; items: Array<{ id: string; title: string }>}) => {
  const iconColor = useColorModeValue('blackAlpha.900', 'whiteAlpha.900');
  const threadColor = useColorModeValue('blackAlpha.700', 'whiteAlpha.700');
  return (
    <Flex
      grow={ 1 }
      shrink={ 1 }
      flexDir="column"
      borderRadius={{ base: 'none', lg: 'base' }}
      border="1px solid"
      borderColor={ useColorModeValue('blackAlpha.100', 'whiteAlpha.200') }
      alignItems="stretch"
      padding={ 6 }
      gap={ 6 }
      minW={ 0 }

    >
      <Flex>{ title }</Flex>
      <Flex minW={ 0 } flexDir="column" gap={ 4 } maxW="100%" alignItems="stretch">
        { items.map((item) => (
          <Link
            href="/forum/test-topic"
            display="flex"
            key={ item.id }
            flexDir="row"
            color={ threadColor }
            _hover={{ color: 'link_hovered', textDecor: 'underline' }}
          >
            <Flex textDecor="inherit" height="1.5rem" marginRight={ 1 } grow={ 1 } shrink={ 1 } flexDir="row" position="relative">
              <Text
                whiteSpace="nowrap"
                color="inherit"
                textOverflow="ellipsis"
                maxW="100%"
                position="absolute"
                textDecor="inherit"
                overflow="hidden">{ item.title }</Text>
            </Flex>
            <Flex alignItems="center">
              <Icon as={ caretRight } boxSize={ 3 } color={ iconColor }/>
            </Flex>
          </Link>
        )) }
      </Flex>
    </Flex>
  );
};

export default TopicsHighlight;
