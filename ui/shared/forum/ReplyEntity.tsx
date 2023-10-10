import { Flex, Icon, useColorModeValue, Text } from '@chakra-ui/react';
import React from 'react';

import type { ForumReply } from 'lib/api/ylideApi/types';

import horizontalDotsIcon from 'icons/horizontal_dots.svg';
import replyIcon from 'icons/reply.svg';
import ago from 'lib/ago';

import AddressEntity from '../entities/address/AddressEntity';

export type ReplyEntityProps = ForumReply

const ReplyEntity = ({ contentText, sender, createTimestamp }: ReplyEntityProps) => {
  const iconColor = useColorModeValue('gray.700', 'gray.300');
  const dateColor = useColorModeValue('gray.600', 'gray.600');
  return (
    <Flex flexDir="column" padding={ 6 } border="1px solid" borderRadius={ 12 } borderColor={ useColorModeValue('blackAlpha.100', 'whiteAlpha.200') }>
      <Flex flexDir="row" justify="space-between" mb={ 2 }>
        <Flex flexDir="row" gap={ 2 } align="center">
          <Flex flexDir="row" gap={ 2 } maxW="120px">
            <AddressEntity address={{ hash: sender }} noCopy truncation="constant"/>
          </Flex>
          <Text as="span" color={ dateColor } fontSize={ 14 } title={ new Date(createTimestamp * 1000).toString() }>{ ago(createTimestamp * 1000) }</Text>
        </Flex>
        <Flex flexDir="row" gap={ 2 }>
          <Icon as={ replyIcon } boxSize={ 5 } color={ iconColor } cursor="pointer" _hover={{ color: 'link_hovered' }}/>
          <Icon as={ horizontalDotsIcon } boxSize={ 5 } color={ iconColor } cursor="pointer" _hover={{ color: 'link_hovered' }}/>
        </Flex>
      </Flex>
      <Flex fontSize={ 14 }>{ contentText }</Flex>
    </Flex>
  );
};

export default ReplyEntity;
