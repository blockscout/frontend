import { Flex, VStack, useColorModeValue, Text, Icon, Popover, PopoverContent, PopoverTrigger, PopoverBody, Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';

import type { ForumTopic } from 'lib/api/ylideApi/types';
import type { DomainAccount } from 'lib/contexts/ylide/types';

import bookmarkIconFilled from 'icons/bookmark_filled.svg';
import bookmarkIcon from 'icons/bookmark.svg';
import eyeIconFilled from 'icons/eye_filled.svg';
import eyeIcon from 'icons/eye.svg';
import ForumPersonalApi from 'lib/api/ylideApi/ForumPersonalApi';
import ForumTelegramApi from 'lib/api/ylideApi/ForumTelegramApi';
import { useYlide } from 'lib/contexts/ylide';

import PopoverByAccount from './PopoverByAccount';

const TopicEntity = ({ id, title, description, slug, threadsCount, bookmarked, watched, onBookmark, onWatch }: ForumTopic & {
  onBookmark?: (topicId: string, address: string, enabled: boolean) => void;
  onWatch?: (topicId: string, address: string, enabled: boolean) => void;
}) => {
  const router = useRouter();
  const bookmarkTopic = ForumPersonalApi.useBookmarkTopic();
  const watchTopic = ForumPersonalApi.useWatchTopic();
  const enablePushes = ForumTelegramApi.useGetLink();
  const { addressesWithPushes, accounts: { domainAccounts }, setAccountPushState } = useYlide();
  const [ pushPopoverVisible, setPushPopoverVisible ] = React.useState<boolean>(false);

  const isBookmarked = Boolean(bookmarked?.length);
  const isWatched = Boolean(watched?.length);

  const iconColor = useColorModeValue('gray.700', 'gray.300');
  const hoverIconColor = useColorModeValue('gray.900', 'gray.100');

  const handleClick = useCallback(() => {
    router.push({ pathname: '/forum/[topic]', query: { topic: slug } });
  }, [ slug, router ]);

  const handleToggleWatch = useCallback(async(account: DomainAccount) => {
    if (!account.backendAuthKey) {
      return;
    }
    const enable = !watched?.includes(account.account.address.toLowerCase());
    await watchTopic({
      token: account.backendAuthKey,
      id: id,
      enable,
    });
    onWatch?.(id, account.account.address.toLowerCase(), enable);
    if (!addressesWithPushes.includes(account.account.address.toLowerCase())) {
      setPushPopoverVisible(true);
    }
  }, [ watchTopic, id, onWatch, watched, addressesWithPushes ]);

  const handleToggleBookmark = useCallback(async(account: DomainAccount) => {
    if (!account.backendAuthKey) {
      return;
    }
    const enable = !bookmarked?.includes(account.account.address.toLowerCase());
    await bookmarkTopic({
      token: account.backendAuthKey,
      id: id,
      enable,
    });
    onBookmark?.(id, account.account.address.toLowerCase(), enable);
  }, [ bookmarkTopic, id, onBookmark, bookmarked ]);

  const handleActivatePushes = useCallback(async(e: React.MouseEvent) => {
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
      <Flex fontSize={ 14 } mb={ 6 }>{ description }</Flex>
      <Flex><Text as="span" fontWeight="700">{ threadsCount }</Text>&nbsp;threads</Flex>
    </Flex>
  );
};

interface Props {
  topics: Array<ForumTopic>;
  onBookmark?: (topicId: string, address: string, enabled: boolean) => void;
  onWatch?: (topicId: string, address: string, enabled: boolean) => void;
}

const TopicsList = ({ topics, onBookmark, onWatch }: Props) => {
  return (
    <VStack align="stretch" spacing={ 4 }>
      { topics.map((item) => (
        <TopicEntity
          key={ item.id }
          onBookmark={ onBookmark }
          onWatch={ onWatch }
          id={ item.id }
          title={ item.title }
          description={ item.description }
          threadsCount={ item.threadsCount }
          bookmarked={ item.bookmarked }
          watched={ item.watched }
          adminOnly={ item.adminOnly }
          creatorAddress={ item.creatorAddress }
          slug={ item.slug }
        />
      )) }
    </VStack>
  );
};

export default TopicsList;
