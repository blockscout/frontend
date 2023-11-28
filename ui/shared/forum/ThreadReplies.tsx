import {
  Flex, Icon, useColorModeValue, Text, HStack, Textarea, Spinner, chakra,
} from '@chakra-ui/react';
import { EVMNetwork, EVM_CHAINS, EVM_NAMES } from '@ylide/ethereum';
import { YMF } from '@ylide/sdk';
import React, { useCallback, useEffect } from 'react';

import type { ForumReply, ForumThread } from 'lib/api/ylideApi/types';
import type { DomainAccount } from 'lib/contexts/ylide/types';
import type { RepliesSorting } from 'types/api/forum';

// import attachmentIcon from 'icons/attachment.svg';
import crossIcon from 'icons/cross.svg';
import sendIcon from 'icons/send.svg';
import ForumPublicApi from 'lib/api/ylideApi/ForumPublicApi';
import { useYlide } from 'lib/contexts/ylide';
import PopoverCompactSorting from 'ui/shared/forum/PopoverCompactSorting';
import RepliesList from 'ui/shared/forum/RepliesList';
import ReplyEntity from 'ui/shared/forum/ReplyEntity';
import SelectAccountDropdown from 'ui/shared/forum/SelectAccountDropdown';
import SelectBlockchainDropdown from 'ui/shared/forum/SelectBlockchainDropdown';
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

const ThreadReplies = ({ thread, skipThreadBody = false }: { thread: ForumThread; skipThreadBody?: boolean }) => {
  const { accounts: { initialized, domainAccounts }, broadcastMessage } = useYlide();
  const [ sorting, setSorting ] = React.useState<RepliesSortingValue>('time-desc');

  const [ repliedReloadTick, setRepliesReloadTick ] = React.useState(0);
  const [ repliesLoading, setRepliesLoading ] = React.useState(false);
  const [ replies, setReplies ] = React.useState<Array<ForumReply>>([]);
  const [ replyTo, setReplyTo ] = React.useState<ForumReply | undefined>();
  const [ sending, setSending ] = React.useState(false);
  const [ replyText, setReplyText ] = React.useState<string>('');
  const [ account, setAccount ] = React.useState<DomainAccount | undefined>(domainAccounts[0]);
  const [ blockchain, setBlockchain ] = React.useState<string>('GNOSIS');
  const getReplies = ForumPublicApi.useGetReplies();
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const replyCount = !skipThreadBody ? Number(thread?.replyCount || '0') : (Number(thread?.replyCount || '1') - 1);
  const allRepliesLoaded = replies.length === (!skipThreadBody ? replyCount : (replyCount + 1));

  useEffect(() => {
    if (!account && domainAccounts.length) {
      setAccount(domainAccounts[0]);
    } else
    if (account && domainAccounts.findIndex(d => d.account.address === account.account.address) === -1) {
      setAccount(undefined);
    }
  }, [ account, domainAccounts ]);

  const handleAccountChange = useCallback((newAccount: DomainAccount | undefined) => {
    setAccount(newAccount);
  }, []);

  const handleBlockchainChange = useCallback((newBlockchain: string) => {
    setBlockchain(newBlockchain);
    if (account) {
      const networkByName = (name: string) =>
        Object.values(EVMNetwork).filter(t => !isNaN(Number(t))).find(t => EVM_NAMES[Number(t) as EVMNetwork] === name) as EVMNetwork;
      const network = networkByName(newBlockchain);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      account.wallet.onNetworkSwitchRequest('', undefined, network, EVM_CHAINS[network]);
    }
  }, [ account ]);

  useEffect(() => {
    if (!initialized || !thread) {
      return;
    }
    // sorting
    const sort: [string, 'ASC' | 'DESC'] = sorting === 'time-asc' ? [ 'createTimestamp', 'ASC' ] : [ 'createTimestamp', 'DESC' ];
    if (repliedReloadTick < 0) {
      return;
    }
    setRepliesLoading(true);
    getReplies(thread.feedId, sort).then(result => {
      setReplies(result);
      setRepliesLoading(false);
      setSending(false);
      setReplyText('');
      setReplyTo(undefined);
    });
  }, [ getReplies, thread, initialized, sorting, repliedReloadTick ]);

  const handleSend = useCallback(async() => {
    if (!thread || !account) {
      return;
    }
    setSending(true);
    try {
      const ymfContent = YMF.fromPlainText(replyText);
      if (replyTo) {
        ymfContent.root.children.unshift({
          parent: ymfContent.root,
          type: 'tag',
          tag: 'reply-to',
          attributes: {
            id: replyTo.id,
          },
          singular: true,
          children: [],
        });
      }
      await broadcastMessage(account, thread.feedId, 'Reply', ymfContent, blockchain);
      setTimeout(() => setRepliesReloadTick(tick => tick + 1), 1000);
      setSending(false);
    } catch (e) {
      setSending(false);
    }
  }, [ thread, account, replyText, replyTo, broadcastMessage, blockchain ]);

  const repliesColor = useColorModeValue('gray.400', 'gray.600');
  const borderColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.200');

  const handleReplyTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReplyText(e.target.value);
  }, []);

  const sortings: Array<{ key: RepliesSortingValue; title: string }> = [
    { key: 'time-asc', title: 'Sort by old first' },
    { key: 'time-desc', title: 'Sort by new first' },
  ];

  const transformSortingValue = useCallback((value: RepliesSortingValue) => {
    return value === 'time-asc' ? 'old first' : 'new first';
  }, [ ]);

  let filteredReplies = replies;
  if (skipThreadBody) {
    filteredReplies = (sorting === 'time-asc' ? replies.slice(1) : replies.slice(0, -1)).filter(t => t.contentText !== thread.description);
  }

  const handleReplyTo = useCallback((reply: ForumReply) => {
    setReplyTo(reply);
    textareaRef.current?.scrollIntoView({ behavior: 'smooth' });
    textareaRef.current?.focus();
  }, [ ]);

  const handleDiscardReplyTo = useCallback(() => {
    setReplyTo(undefined);
  }, [ ]);

  return (
    <Flex position="relative" flexDir="column">
      <ContentContainer mb={ 6 } borderBottom="1px solid" borderColor={ borderColor }>
        <Flex flexDir="column" maxW="900px">
          <HStack align="center" justify="space-between">
            <PageTitle
              isLoading={ !thread }
              afterTitle={ <Text as="span" fontSize={ 32 } ml={ 2 } color={ repliesColor }>{ replyCount }</Text> }
              title="Replies"
              justifyContent="space-between"
            />
            <PopoverCompactSorting
              items={ sortings }
              instantSelect={ true }
              onChange={ setSorting }
              value={ sorting }
              valueTransform={ transformSortingValue }
            />
          </HStack>
          { repliesLoading ? (
            <Spinner/>
          ) : (
            <RepliesList onReplyTo={ handleReplyTo } replies={ allRepliesLoaded ? filteredReplies : replies }/>
          ) }
        </Flex>
      </ContentContainer>
      <ContentContainer mb={ 6 }>
        <Flex maxW="900px" overflow="hidden" flexDir="column" border="1px solid" borderRadius={ 12 } borderColor={ borderColor }>
          { replyTo && (
            <Flex flexDir="row" borderBottom="1px solid" borderColor={ borderColor }>
              <ReplyEntity { ...replyTo } type="reply-form"/>
              <Flex flexDir="row" align="center" px={ 3 }>
                <Icon
                  as={ crossIcon }
                  boxSize={ 6 }
                  cursor="pointer"
                  _hover={{ color: 'link_hovered' }}
                  onClick={ handleDiscardReplyTo }
                />
              </Flex>
            </Flex>
          ) }
          <Flex flexDir="row" padding={ 6 } align="center" borderBottom="1px solid" borderColor={ useColorModeValue('blackAlpha.100', 'whiteAlpha.200') }>
            <Textarea
              border="0"
              flexDir="row"
              flexGrow={ 1 }
              value={ replyText }
              placeholder="Type text here..."
              onChange={ handleReplyTextChange }
              ref={ textareaRef }
            />
            { /* <Flex flexDir="row" align="center">
<Icon
as={ attachmentIcon }
boxSize={ 6 }
cursor="pointer"
_hover={{ color: 'link_hovered' }}
/>
</Flex> */ }
          </Flex>

          <Flex flexDir="row" justify="flex-start" padding={ 6 }>
            <Flex
              flexDir={{ base: 'column', sm: 'row' }}
              justify="space-between"
              mr={ 6 }
              flexGrow={ 1 }
              gap={{ base: 3, sm: 0 }}
            >
              <SelectAccountDropdown
                value={ account }
                onChange={ handleAccountChange }
              />
              <SelectBlockchainDropdown
                account={ account }
                value={ blockchain }
                onChange={ handleBlockchainChange }
              />
            </Flex>
            <Flex flexDir="row" align="center">
              { sending ? (
                <Spinner/>
              ) : (
                <Icon
                  as={ sendIcon }
                  boxSize={ 6 }
                  cursor="pointer"
                  _hover={{ color: 'link_hovered' }}
                  onClick={ handleSend }
                />
              ) }
            </Flex>
          </Flex>
        </Flex>
      </ContentContainer>
    </Flex>
  );
};

export default ThreadReplies;
