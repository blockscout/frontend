import { Flex, VStack, useColorModeValue, Text, Icon } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';

import type { ForumTopic } from 'lib/api/ylideApi/types';

import bookmarkIconFilled from 'icons/bookmark_filled.svg';
import bookmarkIcon from 'icons/bookmark.svg';
import eyeIconFilled from 'icons/eye_filled.svg';
import eyeIcon from 'icons/eye.svg';

const TopicEntity = ({ title, description, slug, threadsCount }: ForumTopic) => {
  const router = useRouter();

  const isBookmarked = false;
  const isWatched = false;

  const iconColor = useColorModeValue('gray.700', 'gray.300');
  const hoverIconColor = useColorModeValue('gray.900', 'gray.100');

  const handleClick = useCallback(() => {
    router.push({ pathname: '/forum/[topic]', query: { topic: slug } });
  }, [ slug, router ]);

  return (
    <Flex
      cursor="pointer"
      flexDir="column"
      padding={ 6 }
      border="1px solid"
      borderRadius={ 12 }
      borderColor={ useColorModeValue('blackAlpha.100', 'whiteAlpha.200') }
      color={ useColorModeValue('blackAlpha.800', 'whiteAlpha.800') }
      _hover={{
        borderColor: useColorModeValue('blackAlpha.200', 'whiteAlpha.300'),
        color: useColorModeValue('blackAlpha.900', 'whiteAlpha.900'),
      }}
      onClick={ handleClick }
    >
      <Flex flexDir="row" justify="space-between" mb={ 2 }>
        <Text as="h3" color="inherit" fontSize={ 18 }>{ title }</Text>
        <Flex flexDir="row" gap={ 2 }>
          <Icon as={ isWatched ? eyeIconFilled : eyeIcon } boxSize={ 5 } color={ iconColor } cursor="pointer" _hover={{ color: hoverIconColor }}/>
          <Icon as={ isBookmarked ? bookmarkIconFilled : bookmarkIcon } boxSize={ 5 } color={ iconColor } cursor="pointer" _hover={{ color: hoverIconColor }}/>
        </Flex>
      </Flex>
      <Flex fontSize={ 14 } mb={ 6 }>{ description }</Flex>
      <Flex><Text as="span" fontWeight="700">{ threadsCount }</Text>&nbsp;threads</Flex>
    </Flex>
  );
};

interface Props {
  topics: Array<ForumTopic>;
}

const TopicsList = ({ topics }: Props) => {
  return (
    <VStack align="stretch" spacing={ 4 }>
      { topics.map((item) => (
        <TopicEntity
          key={ item.id }
          id={ item.id }
          // topic="topic" //  item.topic
          title={ item.title }
          description={ item.description }
          threadsCount={ item.threadsCount }
          // isBookmarked={ item.isBookmarked }
          // isWatched={ item.isWatched }
          adminOnly={ item.adminOnly }
          creatorAddress={ item.creatorAddress }
          slug={ item.slug }
        />
      )) }
    </VStack>
  );
};

export default TopicsList;
