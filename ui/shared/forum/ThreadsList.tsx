import { Flex, useColorModeValue, Text, Icon, VStack, Popover, PopoverTrigger, PopoverContent, PopoverBody, Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { ForumThread } from 'lib/api/ylideApi/types';
import type { DomainAccount } from 'lib/contexts/ylide/types';

import bookmarkIconFilled from 'icons/bookmark_filled.svg';
import bookmarkIcon from 'icons/bookmark.svg';
import eyeIconFilled from 'icons/eye_filled.svg';
import eyeIcon from 'icons/eye.svg';
import ForumPersonalApi from 'lib/api/ylideApi/ForumPersonalApi';
import ForumTelegramApi from 'lib/api/ylideApi/ForumTelegramApi';
import { useYlide } from 'lib/contexts/ylide';

import AddressEntity from '../entities/address/AddressEntity';
import PopoverByAccount from './PopoverByAccount';
import TagsList from './TagsList';

interface ThreadsListEntryProps {
  link: { topic: string; thread: string };
  feedId: string;
  title: string;
  authorAddress: string;
  authorENS?: string;
  date: number;
  replies: number;
  lastReplyDate?: number | null;
  tags: Array<string>;
  bookmarked: Array<string> | null;
  watched: Array<string> | null;
  pinned?: boolean;
  onBookmark?: (topicId: string, address: string, enabled: boolean) => void;
  onWatch?: (topicId: string, address: string, enabled: boolean) => void;
}

export const ThreadsListEntry = ({
  feedId,
  link,
  title,
  authorAddress,
  authorENS,
  date,
  replies,
  lastReplyDate,
  tags,
  bookmarked,
  watched,
  pinned,
  onBookmark,
  onWatch,
}: ThreadsListEntryProps) => {
  const router = useRouter();
  const iconColor = useColorModeValue('gray.700', 'gray.300');
  const hoverIconColor = useColorModeValue('gray.900', 'gray.100');
  const bookmarkThread = ForumPersonalApi.useBookmarkThread();
  const watchThread = ForumPersonalApi.useWatchThread();
  const enablePushes = ForumTelegramApi.useGetLink();
  const { addressesWithPushes, accounts: { domainAccounts }, setAccountPushState } = useYlide();
  const [ pushPopoverVisible, setPushPopoverVisible ] = React.useState<boolean>(false);

  const handleClick = React.useCallback(() => {
    router.push({
      pathname: '/forum/[topic]/[thread]',
      query: link,
    });
  }, [ link, router ]);

  const isBookmarked = Boolean(bookmarked?.length);
  const isWatched = Boolean(watched?.length);

  const handleToggleWatch = React.useCallback(async(account: DomainAccount) => {
    if (!account.backendAuthKey) {
      return;
    }
    const enable = !watched?.includes(account.account.address.toLowerCase());
    await watchThread({
      token: account.backendAuthKey,
      id: feedId,
      enable,
    });
    onWatch?.(feedId, account.account.address.toLowerCase(), enable);
    if (!addressesWithPushes.includes(account.account.address.toLowerCase())) {
      setPushPopoverVisible(true);
    }
  }, [ watchThread, feedId, onWatch, watched, addressesWithPushes ]);

  const handleToggleBookmark = React.useCallback(async(account: DomainAccount) => {
    if (!account.backendAuthKey) {
      return;
    }
    const enable = !bookmarked?.includes(account.account.address.toLowerCase());
    await bookmarkThread({
      token: account.backendAuthKey,
      id: feedId,
      enable,
    });
    onBookmark?.(feedId, account.account.address.toLowerCase(), enable);
  }, [ bookmarkThread, feedId, onBookmark, bookmarked ]);

  const handleActivatePushes = React.useCallback(async(e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = await enablePushes(domainAccounts.map(d => d.account.address.toLowerCase()));
    window.open(url, '_blank');
    domainAccounts.forEach(account => {
      setAccountPushState(account.account.address.toLowerCase(), true);
    });
    setPushPopoverVisible(false);
  }, [ enablePushes, domainAccounts, setAccountPushState ]);

  const watchContent = (
    <PopoverByAccount
      onSelect={ handleToggleWatch }
      title="Select account to watch"
      marks={ watched }
    >
      <Icon
        as={ isWatched ? eyeIconFilled : eyeIcon }
        boxSize={ 5 }
        color={ iconColor }
        cursor="pointer"
        _hover={{ color: hoverIconColor }}
      />
    </PopoverByAccount>
  );

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
      <Flex flexDir={{ sm: 'row', base: 'column' }} alignItems={{ sm: 'center', base: 'stretch' }} justify="space-between" mb={ 4 }>
        <Text as="h3" color="inherit" fontSize={ 18 }>{ title }</Text>
        <Flex flexDir="row" mt={{ base: 2, sm: 0 }} gap={ 2 } maxW="120px">
          <AddressEntity address={{ hash: authorAddress, name: authorENS }} noCopy truncation="constant"/>
        </Flex>
      </Flex>
      <Flex
        flexDir={{ sm: 'row', base: 'column' }}
        alignItems={{ sm: 'center', base: 'stretch' }}
        justify="space-between"
        mb={{ sm: 6, base: 2 }}
        fontSize={ 14 }
      >
        <TagsList tags={ tags }/>
        <Flex>Created { new Date(date * 1000).toLocaleDateString() }</Flex>
      </Flex>
      <Flex flexDir={{ sm: 'row', base: 'column' }} alignItems={{ sm: 'center', base: 'stretch' }} justify="space-between">
        <Flex fontSize={ 14 }>
          <Text as="span" fontWeight="700">{ replies }</Text>&nbsp;replies
          { lastReplyDate && <Text as="span" opacity={ 0.8 }>&nbsp;last reply { new Date(lastReplyDate * 1000).toLocaleDateString() }</Text> }
        </Flex>
        <Flex mt={{ base: 4, sm: 0 }} flexDir="row" justifyContent={{ sm: 'flex-start', base: 'center' }} gap={ 2 }>
          <Popover isOpen={ pushPopoverVisible } placement="bottom-start">
            <PopoverTrigger>
              <Flex>
                { watchContent }
              </Flex>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverBody>
                <Flex flexDir="column" gap={ 4 }>
                  <Flex fontSize={ 16 } textAlign="center">Enable notifications on Telegram to get notified of new replies to this thread</Flex>
                  <Button onClick={ handleActivatePushes }>Enable notifications</Button>
                </Flex>
              </PopoverBody>
            </PopoverContent>
          </Popover>
          <PopoverByAccount
            onSelect={ handleToggleBookmark }
            title="Select account to bookmark"
            marks={ bookmarked }
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
  );
};

const ThreadsList = ({
  threads,
  pinned,
  onBookmark,
  onWatch,
}: {
  threads: Array<ForumThread>;
  pinned?: boolean;
  onBookmark?: (topicId: string, address: string, enabled: boolean) => void;
  onWatch?: (topicId: string, address: string, enabled: boolean) => void;
}) => {
  const pinnedBG = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');
  return (
    <VStack mb={ 6 } background={ pinned ? pinnedBG : undefined } marginX={ pinned ? -12 : 0 } paddingX={ pinned ? 12 : 0 } align="stretch" spacing={ 4 }>
      { threads.map((item) => (
        <ThreadsListEntry
          link={{ topic: item.topicSlug, thread: item.slug }} //  item.thread
          feedId={ item.feedId }
          pinned={ pinned }
          key={ item.feedId }
          title={ item.title }
          authorAddress={ item.creatorAddress }
          authorENS={ undefined }
          date={ item.createTimestamp }
          replies={ Number(item.replyCount) - 1 }
          lastReplyDate={ item.updateTimestamp }
          tags={ item.tags }
          bookmarked={ item.bookmarked }
          watched={ item.watched }
          onBookmark={ onBookmark }
          onWatch={ onWatch }
        />
      )) }
    </VStack>
  );
};

export default ThreadsList;
