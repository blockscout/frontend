import { HStack, VStack } from '@chakra-ui/react';
import React from 'react';

import type { ClusterChainConfig } from 'types/multichain';

import { Skeleton } from 'toolkit/chakra/skeleton';
import ChainIcon from 'ui/shared/externalChains/ChainIcon';

import { formatPercentage } from './utils';

interface Props {
  chain: ClusterChainConfig;
  loading: boolean;
  selected: boolean;
  noneSelected: boolean;
}

const OpSuperchainAddressPortfolioCard = ({ chain, loading, selected, noneSelected }: Props) => {

  return (
    <HStack
      p={ 3 }
      borderRadius="base"
      border="1px solid"
      borderColor={ selected ? 'transparent' : 'border.divider' }
      textStyle="xs"
      w="full"
      bgColor={ selected ? 'selected.control.bg' : 'transparent' }
      opacity={ !selected && !noneSelected ? 0.5 : 1 }
      _hover={{
        borderColor: 'hover',
        opacity: 1,
      }}
    >
      <ChainIcon data={ chain } boxSize="30px" isLoading={ loading } noTooltip/>
      <VStack alignItems="flex-start" gap={ 1 }>
        <Skeleton loading={ loading } color="text.secondary">
          <span>{ chain.name }</span>
        </Skeleton>
        <HStack gap={ 1 }>
          <Skeleton loading={ loading }>
            <span>$123,456.78</span>
          </Skeleton>
          <Skeleton loading={ loading } color="text.secondary">
            <span>{ formatPercentage(0.1234) }</span>
          </Skeleton>
        </HStack>
      </VStack>
    </HStack>
  );
};

export default React.memo(OpSuperchainAddressPortfolioCard);
