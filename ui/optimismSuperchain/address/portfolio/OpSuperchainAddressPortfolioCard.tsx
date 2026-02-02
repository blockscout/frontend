import { HStack, VStack } from '@chakra-ui/react';
import type BigNumber from 'bignumber.js';
import { clamp } from 'es-toolkit';
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
  totalNum?: number;
  onClick?: (chainId: string) => void;
}

const OpSuperchainAddressPortfolioCard = ({ chain, value, share, loading, selected, noneSelected, totalNum, onClick }: Props) => {

  const columnNum = clamp(totalNum || 0, 3, 5);

  const handleClick = React.useCallback(() => {
    onClick?.(chain.id);
  }, [ chain.id, onClick ]);

  return (
    <HStack
      p={ 3 }
      flexBasis={{
        base: (totalNum || 0) > 1 ? 'calc((100% - 8px) / 2)' : '100%',
        lg: `calc((100% - ${ (columnNum - 1) * 8 }px) / ${ columnNum })`,
      }}
      borderRadius="base"
      border="1px solid"
      borderColor={ selected ? 'transparent' : 'border.divider' }
      textStyle="xs"
      w="full"
      bgColor={ selected ? 'selected.control.bg' : 'transparent' }
      opacity={ !selected && !noneSelected ? 0.5 : 1 }
      _hover={ onClick ? {
        borderColor: 'hover',
        opacity: 1,
      } : undefined }
      cursor={ onClick ? 'pointer' : 'default' }
      onClick={ handleClick }
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
