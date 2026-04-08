import type { StackProps } from '@chakra-ui/react';
import { HStack } from '@chakra-ui/react';
import React from 'react';

import type { ExternalChain } from 'types/externalChains';

import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TruncatedText } from 'toolkit/components/truncation/TruncatedText';

import CopyToClipboard from '../CopyToClipboard';
import ChainIcon from './ChainIcon';

interface Props extends StackProps {
  data: ExternalChain;
  isLoading?: boolean;
}

const ChainSnippetList = ({ data, isLoading, ...rest }: Props) => {
  return (
    <HStack gap={ 3 } justifyContent={{ base: 'space-between', lg: 'flex-start' }} { ...rest }>
      <HStack maxW={{ base: '50%', lg: '100%' }}>
        <ChainIcon data={ data } isLoading={ isLoading }/>
        { data.explorer_url ? (
          <Link
            href={ data?.explorer_url }
            fontWeight={ 700 }
            external
            loading={ isLoading }
            maxW="calc(100% - 28px)"
          >
            <TruncatedText text={ data?.name ?? 'Unknown chain' } loading={ isLoading }/>
          </Link>
        ) : (
          <Skeleton loading={ isLoading } fontWeight={ 700 } maxW="calc(100% - 28px)"><span>{ data?.name ?? 'Unknown chain' }</span></Skeleton>
        ) }
      </HStack>
      <HStack gap={ 0 } flexShrink={ 0 }>
        <Skeleton loading={ isLoading } color="text.secondary" fontWeight={ 500 }><span>{ data.id }</span></Skeleton>
        <CopyToClipboard text={ data.id } isLoading={ isLoading }/>
      </HStack>
    </HStack>
  );
};

export default React.memo(ChainSnippetList);
