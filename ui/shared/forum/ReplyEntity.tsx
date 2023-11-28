import { Flex, Icon, useColorModeValue, Text } from '@chakra-ui/react';
import { YMF } from '@ylide/sdk';
import React, { useCallback, useEffect } from 'react';

import type { ForumReply } from 'lib/api/ylideApi/types';

// import horizontalDotsIcon from 'icons/horizontal_dots.svg';
import replyIcon from 'icons/reply.svg';
import ago from 'lib/ago';
import ForumPublicApi from 'lib/api/ylideApi/ForumPublicApi';

import AddressEntity from '../entities/address/AddressEntity';

export interface ReplyEntityProps extends ForumReply {
  onReplyTo?: (reply: ForumReply) => void;
  type?: 'reply-form' | 'compact' | 'normal';
}

const ReplyEntity = (props: ReplyEntityProps) => {
  const { contentText, sender, createTimestamp, onReplyTo, type } = props;
  const iconColor = useColorModeValue('gray.700', 'gray.300');
  const dateColor = useColorModeValue('gray.600', 'gray.600');
  const backgroundColor = useColorModeValue('gray.100', 'gray.800');
  const getReply = ForumPublicApi.useGetReply();
  const [ replyToPost, setReplyToPost ] = React.useState<ForumReply | undefined>(undefined);

  const ymf = React.useMemo(() => YMF.fromYMFText(contentText), [ contentText ]);

  const replyToId = React.useMemo(() => {
    const firstChild = ymf.root.children[0];

    if (firstChild?.type === 'tag' && firstChild.tag === 'reply-to') {
      return firstChild.attributes.id || undefined;
    } else {
      return undefined;
    }
  }, [ ymf ]);

  useEffect(() => {
    setReplyToPost(undefined);
    (async() => {
      if (replyToId) {
        const replyToPost = await getReply(replyToId);
        setReplyToPost(replyToPost || undefined);
      }
    })();
  }, [ replyToId, getReply ]);

  const handleReplyToClick = React.useCallback(() => {
    if (onReplyTo) {
      onReplyTo(props);
    }
  }, [ props, onReplyTo ]);

  const compact = type === 'compact' || type === 'reply-form';
  const t = useCallback(<T, >(normal: T, compact: T, replyForm: T) => {
    if (type === 'normal') {
      return normal;
    } else
    if (type === 'compact') {
      return compact;
    } else {
      return replyForm;
    }
  }, [ type ]);

  return (
    <Flex
      flexDir="column"
      padding={ compact ? 3 : 6 }
      my={ t(0, 2, 0) }
      mb={ t(0, 4, 0) }
      pl={ t(6, 5, 5) }
      border={ compact ? '0' : '1px solid' }
      borderRadius={ compact ? 0 : 12 }
      borderLeft={ t(undefined, '2px solid', undefined) }
      borderColor={ useColorModeValue('blackAlpha.100', 'whiteAlpha.200') }
      flexGrow={ t(0, 0, 1) }
      backgroundColor={ compact ? backgroundColor : 'transparent' }
    >
      { type === 'reply-form' ? (
        <Flex fontWeight={ 500 } mb={ 3 }>Replying to:</Flex>
      ) : null }
      <Flex flexDir="row" justify="space-between" mb={ 2 }>
        <Flex flexDir="row" gap={ 2 } align="center">
          <Flex flexDir="row" gap={ 2 } maxW="120px">
            <AddressEntity address={{ hash: sender }} noCopy truncation="constant"/>
          </Flex>
          <Text as="span" color={ dateColor } fontSize={ 14 } title={ new Date(createTimestamp * 1000).toString() }>{ ago(createTimestamp * 1000) }</Text>
        </Flex>
        { !compact ? (
          <Flex flexDir="row" gap={ 2 }>
            <Icon
              as={ replyIcon }
              boxSize={ 5 }
              color={ iconColor }
              cursor="pointer"
              _hover={{ color: 'link_hovered' }}
              onClick={ handleReplyToClick }
            />
            { /* <Icon
              as={ horizontalDotsIcon }
              boxSize={ 5 }
              color={ iconColor }
              cursor="pointer"
              _hover={{ color: 'link_hovered' }}
        /> */ }
          </Flex>
        ) : null }
      </Flex>
      { replyToPost ? (
        <ReplyEntity type="compact" { ...replyToPost }/>
      ) : null }
      <Flex fontSize={ 14 }>{ ymf.toPlainText() }</Flex>
    </Flex>
  );
};

export default ReplyEntity;
