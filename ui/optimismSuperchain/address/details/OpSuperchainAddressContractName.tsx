import { Box, HStack } from '@chakra-ui/react';
import React from 'react';

import type * as multichain from '@blockscout/multichain-aggregator-types';

import { route } from 'nextjs-routes';

import multichainConfig from 'configs/multichain';
import { Link } from 'toolkit/chakra/link';
import { PopoverRoot, PopoverTrigger, PopoverContent, PopoverBody } from 'toolkit/chakra/popover';
import ChainIcon from 'ui/optimismSuperchain/components/ChainIcon';

interface Props {
  data: multichain.GetAddressResponse | undefined;
  isLoading: boolean;
}

const OpSuperchainAddressContractName = ({ data, isLoading }: Props) => {
  if (!data?.chain_infos) {
    return null;
  }

  const chains = multichainConfig()?.chains;

  return (
    <PopoverRoot>
      <PopoverTrigger>
        <Link
          variant="secondary"
          textStyle="sm"
          textDecorationLine="underline"
          textDecorationStyle="dashed"
          loading={ isLoading }
        >
          By chain
        </Link>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverBody display="flex" flexDirection="column" rowGap={ 3 }>
          { Object.entries(data.chain_infos).map(([ chainId ]) => {

            const chain = chains?.find((chain) => chain.config.chain.id === chainId);

            if (!chain || !data.chain_infos[chainId].is_contract) {
              return null;
            }

            return (
              <Link
                key={ chainId }
                href={ route({ pathname: '/address/[hash]', query: { hash: data.hash, tab: 'contract', 'chain-slug': chain.slug } }) }
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
              >
                <HStack>
                  <ChainIcon data={ chain }/>
                  <span>{ chain.config.chain.name }</span>
                </HStack>
                <Box color="text.secondary" ml={ 7 }>{ data.chain_infos[chainId].contract_name ?? 'Non-verified contract' }</Box>
              </Link>
            );
          }) }
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default React.memo(OpSuperchainAddressContractName);
