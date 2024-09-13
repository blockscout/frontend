import { Divider, Flex, Skeleton, VStack } from '@chakra-ui/react';
import React from 'react';

import Tag from 'ui/shared/chakra/Tag';

interface Props {
  methodId: string;
  methodCall: string;
  isLoading?: boolean;
  rightSlot?: React.ReactNode;
}

const Item = ({ label, children, isLoading }: { label: string; children: React.ReactNode; isLoading?: boolean}) => {
  return (
    <Flex
      w="100%"
      columnGap={ 5 }
      rowGap={ 2 }
      px={{ base: 0, lg: 4 }}
      flexDir={{ base: 'column', lg: 'row' }}
      alignItems={{ base: 'flex-start', lg: 'center' }}
    >
      <Skeleton fontWeight={ 600 } w={{ base: 'auto', lg: '80px' }} flexShrink={ 0 } isLoaded={ !isLoading }>
        { label }
      </Skeleton >
      { children }
    </Flex>
  );
};

const LogDecodedInputDataHeader = ({ methodId, methodCall, isLoading, rightSlot }: Props) => {
  return (
    <VStack
      align="flex-start"
      divider={ <Divider/> }
      fontSize="sm"
      lineHeight={ 5 }
      flexGrow={ 1 }
      w="100%"
    >
      <Flex columnGap={ 2 } w="100%">
        <Item label="Method id" isLoading={ isLoading }>
          <Tag isLoading={ isLoading }>{ methodId }</Tag>
        </Item>
        { rightSlot }
      </Flex>
      <Item label="Call" isLoading={ isLoading }>
        <Skeleton isLoaded={ !isLoading } whiteSpace="pre-wrap" w="100%">{ methodCall }</Skeleton>
      </Item>
    </VStack>
  );
};

export default LogDecodedInputDataHeader;
