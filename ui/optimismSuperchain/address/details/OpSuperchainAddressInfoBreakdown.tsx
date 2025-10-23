import { Box, HStack, VStack } from '@chakra-ui/react';
import React from 'react';

import type { ClusterChainConfig } from 'types/multichain';

import multichainConfig from 'configs/multichain';
import type { LinkProps } from 'toolkit/chakra/link';
import { Link } from 'toolkit/chakra/link';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from 'toolkit/chakra/popover';
import ChainIcon from 'ui/shared/externalChains/ChainIcon';

interface Props<T> extends Omit<LinkProps, 'children'> {
  data: Record<string, T> | undefined;
  children: (data: [ ClusterChainConfig, T ]) => React.ReactNode;
}

const OpSuperchainAddressInfoBreakdown = <T,>({ data, children, ...rest }: Props<T>) => {
  const chains = multichainConfig()?.chains;

  if (!data || Object.keys(data).length === 0) {
    return null;
  }

  return (
    <PopoverRoot>
      <PopoverTrigger>
        <Link
          variant="secondary"
          textStyle="sm"
          textDecorationLine="underline"
          textDecorationStyle="dashed"
          { ...rest }
        >
          By chain
        </Link>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverBody display="flex" flexDirection="column" rowGap={ 3 }>
          { Object.entries(data).map(([ chainId, chainInfo ]) => {

            const chain = chains?.find((chain) => chain.id === chainId);

            if (!chain) {
              return null;
            }

            return (
              <VStack key={ chainId } alignItems="flex-start">
                <HStack>
                  <ChainIcon data={ chain }/>
                  <span>{ chain.name }</span>
                </HStack>
                <Box color="text.secondary" ml={ 7 }>
                  { children([ chain, chainInfo ]) }
                </Box>
              </VStack>
            );
          }) }
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default React.memo(OpSuperchainAddressInfoBreakdown) as typeof OpSuperchainAddressInfoBreakdown;
