import { HStack, VStack } from '@chakra-ui/react';
import type BigNumber from 'bignumber.js';
import React from 'react';

import type { ClusterChainConfig } from 'types/multichain';

import { Skeleton } from 'toolkit/chakra/skeleton';
import ChainIcon from 'ui/shared/externalChains/ChainIcon';
import SimpleValue from 'ui/shared/value/SimpleValue';
import { DEFAULT_ACCURACY_USD } from 'ui/shared/value/utils';

import { formatPercentage } from './utils';

interface Props {
  chain: ClusterChainConfig;
  value: BigNumber;
  share?: number;
  loading: boolean;
  selected: boolean;
  noneSelected: boolean;
}

const OpSuperchainAddressPortfolioCard = ({ chain, value, share, loading, selected, noneSelected }: Props) => {

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
          <SimpleValue value={ value } prefix="$" loading={ loading } noTooltip accuracy={ DEFAULT_ACCURACY_USD }/>
          { share !== undefined && (
            <Skeleton loading={ loading } color="text.secondary">
              <span>{ formatPercentage(share) }</span>
            </Skeleton>
          ) }
        </HStack>
      </VStack>
    </HStack>
  );
};

export default React.memo(OpSuperchainAddressPortfolioCard);
