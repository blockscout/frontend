import { Flex, useColorModeValue, Text, Icon, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { ForumThread } from 'lib/api/ylideApi/types';

import bookmarkIconFilled from 'icons/bookmark_filled.svg';
import bookmarkIcon from 'icons/bookmark.svg';
import eyeIconFilled from 'icons/eye_filled.svg';
import eyeIcon from 'icons/eye.svg';

import AddressEntity from '../entities/address/AddressEntity';
import TagsList from './TagsList';

// export interface TheadDescriptor {
//   id: string;
//   thread: string;
//   title: string;
//   authorAddress: string;
//   authorENS?: string;
//   date: number;
//   replies: number;
//   lastReplyDate?: number;
//   tags: Array<string>;
//   isBookmarked: boolean;
//   isWatched: boolean;
// }

interface ThreadsListEntryProps {
  link: { topic: string; thread: string };
  title: string;
  authorAddress: string;
  authorENS?: string;
  date: number;
  replies: number;
  lastReplyDate?: number | null;
  tags: Array<string>;
  isBookmarked: boolean;
  isWatched: boolean;
  pinned?: boolean;
}

export const ThreadsListEntry = ({
  link,
  title,
  authorAddress,
  authorENS,
  date,
  replies,
  lastReplyDate,
  tags,
  isBookmarked,
  isWatched,
  pinned,
}: ThreadsListEntryProps) => {
  const router = useRouter();
  const iconColor = useColorModeValue('gray.700', 'gray.300');
  const hoverIconColor = useColorModeValue('gray.900', 'gray.100');

  const handleClick = React.useCallback(() => {
    router.push({
      pathname: '/forum/[topic]/[thread]',
      query: link,
    });
  }, [ link, router ]);

  return (
    <Flex
      flexDir="column"
      padding={ 6 }
      border={ pinned ? undefined : '1px solid' }
      borderBottom={ pinned ? '1px solid' : undefined }
      borderRadius={ pinned ? 0 : 12 }
      cursor="pointer"
      onClick={ handleClick }
      _last={{ borderBottom: pinned ? 'none' : undefined }}
      borderColor={ useColorModeValue('blackAlpha.100', 'whiteAlpha.200') }
      color={ useColorModeValue('blackAlpha.800', 'whiteAlpha.800') }
      _hover={{
        color: useColorModeValue('black', 'white'),
      }}
    >
      <Flex flexDir="row" justify="space-between" mb={ 4 }>
        <Text as="h3" color="inherit" fontSize={ 18 }>{ title }</Text>
        <Flex flexDir="row" gap={ 2 } maxW="120px">
          <AddressEntity address={{ hash: authorAddress, name: authorENS }} noCopy truncation="constant"/>
        </Flex>
      </Flex>
      <Flex flexDir="row" justify="space-between" mb={ 6 } fontSize={ 14 }>
        <TagsList tags={ tags }/>
        <Flex>Created { new Date(date * 1000).toLocaleDateString() }</Flex>
      </Flex>
      <Flex flexDir="row" justify="space-between">
        <Flex fontSize={ 14 }>
          <Text as="span" fontWeight="700">{ replies }</Text>&nbsp;replies
          { lastReplyDate && <Text as="span" opacity={ 0.8 }>&nbsp;last reply { new Date(lastReplyDate * 1000).toLocaleDateString() }</Text> }
        </Flex>
        <Flex flexDir="row" gap={ 2 }>
          <Icon as={ isWatched ? eyeIconFilled : eyeIcon } boxSize={ 5 } color={ iconColor } cursor="pointer" _hover={{ color: hoverIconColor }}/>
          <Icon as={ isBookmarked ? bookmarkIconFilled : bookmarkIcon } boxSize={ 5 } color={ iconColor } cursor="pointer" _hover={{ color: hoverIconColor }}/>
        </Flex>
      </Flex>

    </Flex>
  );
};

const ThreadsList = ({ topic, threads, pinned }: { topic: string; threads: Array<ForumThread>; pinned?: boolean }) => {
  const pinnedBG = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');
  return (
    <VStack mb={ 6 } background={ pinned ? pinnedBG : undefined } marginX={ pinned ? -12 : 0 } paddingX={ pinned ? 12 : 0 } align="stretch" spacing={ 4 }>
      { threads.map((item) => (
        <ThreadsListEntry
          link={{ topic, thread: item.slug }} //  item.thread
          pinned={ pinned }
          key={ item.id }
          title={ item.title }
          authorAddress={ item.creatorAddress }
          authorENS={ undefined }
          date={ item.createTimestamp }
          replies={ Number(item.replyCount) - 1 }
          lastReplyDate={ item.updateTimestamp }
          tags={ item.tags }
          isBookmarked={ false } // item.isBookmarked }
          isWatched={ false } // item.isWatched }
        />
      )) }
    </VStack>
  );
};

export default ThreadsList;
