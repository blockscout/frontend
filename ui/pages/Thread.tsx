import { Flex, Icon, useColorModeValue, Text, HStack, chakra } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import type { ForumThread } from 'lib/api/ylideApi/types';
import type { RepliesSorting } from 'types/api/forum';

// import attachmentIcon from 'icons/attachment.svg';
import bookmarkIconFilled from 'icons/bookmark_filled.svg';
import bookmarkIcon from 'icons/bookmark.svg';
import eyeIconFilled from 'icons/eye_filled.svg';
import eyeIcon from 'icons/eye.svg';
import ago from 'lib/ago';
import ForumPublicApi from 'lib/api/ylideApi/ForumPublicApi';
import { useYlide } from 'lib/contexts/ylide';
import getQueryParamString from 'lib/router/getQueryParamString';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import ChatsAccountsBar from 'ui/shared/forum/ChatsAccountsBar';
import Editor from 'ui/shared/forum/Editor';
import TagsList from 'ui/shared/forum/TagsList';
import ThreadReplies from 'ui/shared/forum/ThreadReplies';
import PageTitle from 'ui/shared/Page/PageTitle';

export type RepliesSortingField = RepliesSorting['sort'];
export type RepliesSortingValue = `${ RepliesSortingField }-${ RepliesSorting['order'] }`;

const ContentContainer = chakra(({ children }: { children: React.ReactNode }) => {
  return (
    <Flex flexDir="column" marginX={{ base: 0, sm: -12 }} paddingX={{ base: 0, sm: 12 }}>
      { children }
    </Flex>
  );
});

const ThreadPageContent = () => {
  const router = useRouter();
  const { accounts: { initialized } } = useYlide();
  const threadString = getQueryParamString(router.query.thread);
  // const topicString = getQueryParamString(router.query.topic);

  const [ thread, setThread ] = React.useState<ForumThread | undefined>();
  const getThread = ForumPublicApi.useGetThread(threadString);

  const replyCount = Number(thread?.replyCount || '1') - 1;

  useEffect(() => {
    if (!initialized) {
      return;
    }
    getThread().then(setThread);
  }, [ getThread, initialized ]);

  const iconColor = useColorModeValue('gray.700', 'gray.300');
  const hoverIconColor = useColorModeValue('gray.900', 'gray.100');
  const borderColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.200');

  const isWatched = false;
  const isBookmarked = false;

  return (
    <Flex position="relative" flexDir="column">
      <HStack align="center" justify="space-between" mb={ 6 }>
        <PageTitle
          mb={ 0 }
          backLink={ thread ? { url: `/forum/${ thread.topicSlug }`, label: `Back to topic` } : undefined }
          title={ thread?.title || '' }
          isLoading={ !thread }
          justifyContent="space-between"
        />
        <ChatsAccountsBar compact/>
      </HStack>
      <ContentContainer mb={ 6 } borderBottom="1px solid" borderColor={ borderColor }>
        <Flex flexDir="row" maxW="900px" mb={ 8 } justify="space-between">
          <Flex flexDir="row" gap={ 2 }>
            <Flex flexDir="row" gap={ 2 } maxW="120px">
              <AddressEntity isLoading={ !thread } address={{ hash: thread?.creatorAddress || '' }} noCopy truncation="constant"/>
            </Flex>
            <Flex title={ thread ? new Date(thread.createTimestamp * 1000).toString() : '' }>{ thread ? ago(thread.createTimestamp * 1000) : '' }</Flex>
          </Flex>
          <Flex align="center" flexDir="row" gap={ 4 }>
            <Flex><Text as="span" fontWeight="700">{ replyCount }</Text>&nbsp;{ replyCount === 1 ? 'reply' : 'replies' }</Flex>
            <Flex align="center" flexDir="row" gap={ 2 }>
              <Icon
                as={ isWatched ? eyeIconFilled : eyeIcon }
                boxSize={ 5 }
                color={ iconColor }
                cursor="pointer"
                _hover={{ color: hoverIconColor }}
              />
              <Icon
                as={ isBookmarked ? bookmarkIconFilled : bookmarkIcon }
                boxSize={ 5 }
                color={ iconColor }
                cursor="pointer"
                _hover={{ color: hoverIconColor }}
              />
            </Flex>
          </Flex>
        </Flex>
        <Flex flexDir="column" maxW="900px" gap={ 6 }>
          { thread?.description && (
            <Editor
              value={ thread.description }
            />
          ) }
          <TagsList mb={ 6 } tags={ thread?.tags || [] }/>
        </Flex>
      </ContentContainer>
      { thread && (<ThreadReplies thread={ thread }/>) }
    </Flex>
  );
};

export default ThreadPageContent;
