import { Separator, Flex, VStack } from '@chakra-ui/react';
import React from 'react';

import { Badge } from 'toolkit/chakra/badge';
import { Skeleton } from 'toolkit/chakra/skeleton';

interface Props {
  methodId: string;
  methodCall: string;
  isLoading?: boolean;
  rightSlot?: React.ReactNode;
}

const Item = ({ label, children, isLoading }: { label: string; children: React.ReactNode; isLoading?: boolean }) => {
  return (
    <Flex
      w="100%"
      columnGap={ 5 }
      rowGap={ 2 }
      px={{ base: 0, lg: 4 }}
      flexDir={{ base: 'column', lg: 'row' }}
      alignItems={{ base: 'flex-start', lg: 'center' }}
    >
      <Skeleton fontWeight={ 600 } w={{ base: 'auto', lg: '80px' }} flexShrink={ 0 } loading={ isLoading }>
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
      separator={ <Separator/> }
      textStyle="sm"
      flexGrow={ 1 }
      w="100%"
    >
      <Flex columnGap={ 2 } w="100%">
        <Item label="Method id" isLoading={ isLoading }>
          <Badge loading={ isLoading }>{ methodId }</Badge>
        </Item>
        { rightSlot }
      </Flex>
      <Item label="Call" isLoading={ isLoading }>
        <Skeleton loading={ isLoading } whiteSpace="pre-wrap" flexGrow={ 1 }>{ methodCall }</Skeleton>
      </Item>
    </VStack>
  );
};

export default LogDecodedInputDataHeader;
