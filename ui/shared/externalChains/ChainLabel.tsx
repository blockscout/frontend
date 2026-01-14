import type { StackProps } from '@chakra-ui/react';
import { HStack } from '@chakra-ui/react';
import React from 'react';

import type { ExternalChain } from 'types/externalChains';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { TruncatedTextTooltip } from 'toolkit/components/truncation/TruncatedTextTooltip';

import ChainIcon from './ChainIcon';

interface Props extends StackProps {
  data: Omit<ExternalChain, 'explorer_url'> | undefined;
  isLoading?: boolean;
  fallback?: React.ReactNode;
}

const ChainLabel = ({ data, isLoading, fallback, ...rest }: Props) => {
  if (!data) {
    return fallback || null;
  }

  return (
    <HStack w="full" whiteSpace="nowrap" { ...rest }>
      <ChainIcon data={ data } isLoading={ isLoading } noTooltip/>
      <TruncatedTextTooltip label={ data.name }>
        <Skeleton loading={ isLoading } overflow="hidden" textOverflow="ellipsis">
          { data.name }
        </Skeleton>
      </TruncatedTextTooltip>
    </HStack>
  );
};

export default React.memo(ChainLabel);
