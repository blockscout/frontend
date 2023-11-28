import { Flex, Icon, useColorModeValue, Text, HStack, chakra } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import type { ForumThread } from 'lib/api/ylideApi/types';
import type { DomainAccount } from 'lib/contexts/ylide/types';
import type { RepliesSorting } from 'types/api/forum';

// import attachmentIcon from 'icons/attachment.svg';
import bookmarkIconFilled from 'icons/bookmark_filled.svg';
import bookmarkIcon from 'icons/bookmark.svg';
import eyeIconFilled from 'icons/eye_filled.svg';
import eyeIcon from 'icons/eye.svg';
import ago from 'lib/ago';
import ForumPersonalApi from 'lib/api/ylideApi/ForumPersonalApi';
import ForumPublicApi from 'lib/api/ylideApi/ForumPublicApi';
import { useYlide } from 'lib/contexts/ylide';
import getQueryParamString from 'lib/router/getQueryParamString';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import ChatsAccountsBar from 'ui/shared/forum/ChatsAccountsBar';
import Editor from 'ui/shared/forum/Editor';
import PopoverByAccount from 'ui/shared/forum/PopoverByAccount';
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
  const bookmarkThread = ForumPersonalApi.useBookmarkThread();
  const watchThread = ForumPersonalApi.useWatchThread();

  const [ thread, setThread ] = React.useState<ForumThread | undefined>();
  const getThread = ForumPublicApi.useGetThread(threadString);

  const replyCount = Number(thread?.replyCount || '1') - 1;

  const isBookmarked = Boolean(thread?.bookmarked?.length);
  const isWatched = Boolean(thread?.watched?.length);

  const handleToggleWatch = React.useCallback(async(account: DomainAccount) => {
    if (!account.backendAuthKey || !thread) {
      return;
    }
    const enable = !thread.watched?.includes(account.account.address.toLowerCase());
    await watchThread({
      token: account.backendAuthKey,
      id: thread.feedId,
      enable,
    });
    setThread(prev => {
      if (!prev) {
        return prev;
      }
      let newWatched;
      if (enable) {
        newWatched = [ ...prev?.watched || [], account.account.address.toLowerCase() ];
      } else {
        newWatched = prev.watched ? prev.watched.filter(b => b !== account.account.address.toLowerCase()) : prev.watched;
      }
      return {
        ...prev,
        watched: newWatched,
      };
    });
  }, [ thread, watchThread ]);

  const handleToggleBookmark = React.useCallback(async(account: DomainAccount) => {
    if (!account.backendAuthKey || !thread) {
      return;
    }
    const enable = !thread.bookmarked?.includes(account.account.address.toLowerCase());
    await bookmarkThread({
      token: account.backendAuthKey,
      id: thread.feedId,
      enable,
    });
    setThread(prev => {
      if (!prev) {
        return prev;
      }
      let newBookmarked;
      if (enable) {
        newBookmarked = [ ...prev?.bookmarked || [], account.account.address.toLowerCase() ];
      } else {
        newBookmarked = prev.bookmarked ? prev.bookmarked.filter(b => b !== account.account.address.toLowerCase()) : prev.bookmarked;
      }
      return {
        ...prev,
        bookmarked: newBookmarked,
      };
    });
  }, [ bookmarkThread, thread ]);

  useEffect(() => {
    if (!initialized) {
      return;
    }
    getThread().then(setThread);
  }, [ getThread, initialized ]);

  const iconColor = useColorModeValue('gray.700', 'gray.300');
  const hoverIconColor = useColorModeValue('gray.900', 'gray.100');
  const borderColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.200');

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
        <ChatsAccountsBar/>
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
              <PopoverByAccount
                onSelect={ handleToggleWatch }
                title="Select account to watch"
                marks={ thread?.watched || [] }
              >
                <Icon
                  as={ isWatched ? eyeIconFilled : eyeIcon }
                  boxSize={ 5 }
                  color={ iconColor }
                  cursor="pointer"
                  _hover={{ color: hoverIconColor }}
                />
              </PopoverByAccount>
              <PopoverByAccount
                onSelect={ handleToggleBookmark }
                title="Select account to bookmark"
                marks={ thread?.bookmarked || [] }
              >
                <Icon
                  as={ isBookmarked ? bookmarkIconFilled : bookmarkIcon }
                  boxSize={ 5 }
                  color={ iconColor }
                  cursor="pointer"
                  _hover={{ color: hoverIconColor }}
                />
              </PopoverByAccount>
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
      { thread && (<ThreadReplies thread={ thread } skipThreadBody={ true }/>) }
    </Flex>
  );
};

export default ThreadPageContent;
