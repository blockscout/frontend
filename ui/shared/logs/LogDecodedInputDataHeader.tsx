import { Divider, Flex, Skeleton, VStack } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import React from 'react';

interface Props {
  methodId: string;
  methodCall: string;
  isLoading?: boolean;
}

const Item = ({ label, text, isLoading }: { label: string; text: string; isLoading?: boolean}) => {
  return (
    <Flex
      columnGap={ 5 }
      rowGap={ 2 }
      px={{ base: 0, lg: 4 }}
      flexDir={{ base: 'column', lg: 'row' }}
      alignItems="flex-start"
    >
      <Skeleton fontWeight={ 600 } w={{ base: 'auto', lg: '80px' }} flexShrink={ 0 } isLoaded={ !isLoading }>
        { label }
      </Skeleton >
      <Skeleton isLoaded={ !isLoading } whiteSpace="pre-wrap">{ text }</Skeleton>
    </Flex>
  );
};

const LogDecodedInputDataHeader = ({ methodId, methodCall, isLoading }: Props) => {
  const { t } = useTranslation('common');

  return (
    <VStack
      align="flex-start"
      divider={ <Divider/> }
      fontSize="sm"
      lineHeight={ 5 }
    >
      <Item label={ t('log_item.Method_id') } text={ methodId } isLoading={ isLoading }/>
      <Item label={ t('log_item.Call') } text={ methodCall } isLoading={ isLoading }/>
    </VStack>
  );
};

export default LogDecodedInputDataHeader;
