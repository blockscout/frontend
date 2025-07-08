import { Box, chakra, VStack } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import multichainConfig from 'configs/multichain';
import { Button } from 'toolkit/chakra/button';
import { Link } from 'toolkit/chakra/link';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from 'toolkit/chakra/popover';
import IconSvg from 'ui/shared/IconSvg';

import ChainIcon from './ChainIcon';

interface Props {
  addressHash: string;
}

const ClusterChainsPopover = ({ addressHash }: Props) => {

  const chains = multichainConfig()?.chains;

  if (!chains || chains.length === 0) {
    return null;
  }

  return (
    <PopoverRoot>
      <Box>
        <PopoverTrigger>
          <Button
            size="sm"
            variant="dropdown"
            aria-label="This address is on cluster chains"
            px={ 2 }
            fontWeight={ 500 }
            flexShrink={ 0 }
            columnGap={ 1 }
          >
            <IconSvg name="pie_chart" boxSize={ 5 }/>
            { chains.length } Chain{ chains.length > 1 ? 's' : '' }
          </Button>
        </PopoverTrigger>
      </Box>
      <PopoverContent w="auto">
        <PopoverBody >
          <chakra.span color="text.secondary" textStyle="xs">This address is on cluster chains</chakra.span>
          <VStack gap={ 2 } mt={ 1 } alignItems="flex-start">
            { chains.map((chain) => (
              <Link
                key={ chain.slug }
                href={ chain.config.app.baseUrl + route({ pathname: '/address/[hash]', query: { hash: addressHash } }) }
                external
                display="flex"
                alignItems="center"
                py="7px"
              >
                <ChainIcon data={ chain } mr={ 2 }/>
                { chain.config.chain.name }
              </Link>
            )) }
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default React.memo(ClusterChainsPopover);
