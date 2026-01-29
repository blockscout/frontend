import { Box, HStack, VStack } from '@chakra-ui/react';
import React from 'react';

import type { ClusterChainConfig } from 'types/multichain';

import useApiQuery from 'lib/api/useApiQuery';
import useAddChainClick from 'lib/web3/useAddChainClick';
import { HOMEPAGE_STATS } from 'stubs/stats';
import { Heading } from 'toolkit/chakra/heading';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import ChainIcon from 'ui/shared/externalChains/ChainIcon';
import GasPrice from 'ui/shared/gas/GasPrice';
import IconSvg from 'ui/shared/IconSvg';
import RollupStageBadge from 'ui/snippets/navigation/RollupStageBadge';

import ChainLatestBlockInfo from './ChainLatestBlockInfo';

interface Props {
  data: ClusterChainConfig;
}

const ChainWidget = ({ data }: Props) => {
  const statsQuery = useApiQuery('general:stats', {
    chain: data,
    queryOptions: {
      placeholderData: HOMEPAGE_STATS,
    },
  });

  const handleAddToWalletClick = useAddChainClick({ source: 'Chain widget' });

  return (
    <Box
      // as the designer said, for the light theme "there is no gray color that suits well, so we use a custom one"
      bgColor={{ _light: 'rgba(246, 246, 248, 0.5)', _dark: 'whiteAlpha.50' }}
      borderRadius="xl"
      border="1px solid"
      borderColor={{ _light: 'blackAlpha.200', _dark: 'whiteAlpha.200' }}
      p={ 6 }
      flexBasis={{ base: '100%', lg: 'calc((100% - 3 * 12px) / 4)' }}
      textStyle="sm"
    >
      <HStack justifyContent="space-between">
        <ChainIcon data={ data } boxSize="30px"/>
        <HStack gap={ 2 }>
          <Tooltip content="Add to wallet">
            <Link
              onClick={ handleAddToWalletClick }
              p={ 1.5 }
              color="icon.secondary"
              _hover={{
                color: 'hover',
              }}
              bgColor={{ _light: 'blackAlpha.50', _dark: 'whiteAlpha.100' }}
              borderRadius="base"
            >
              <IconSvg name="wallet" boxSize={ 5 }/>
            </Link>
          </Tooltip>
          <Tooltip content="Open explorer">
            <Link
              href={ data.explorer_url }
              external
              noIcon
              color="icon.secondary"
              _hover={{
                color: 'hover',
              }}
              bgColor={{ _light: 'blackAlpha.50', _dark: 'whiteAlpha.100' }}
              borderRadius="base"
            >
              <IconSvg name="globe" boxSize={ 8 }/>
            </Link>
          </Tooltip>
        </HStack>
      </HStack>
      <Heading my={ 3 } textStyle="heading.md ">{ data.name }</Heading>
      <RollupStageBadge chainConfig={ data.app_config } mb={ 2.5 }/>
      <VStack gap={ 2 } alignItems="flex-start" fontWeight={ 500 }>
        <HStack gap={ 2 }>
          <Box color="text.secondary">Chain ID</Box>
          <Box>{ data.id }</Box>
          <CopyToClipboard text={ String(data.id) } ml={ 0 }/>
        </HStack>
        <ChainLatestBlockInfo chainData={ data }/>
        { statsQuery.data && statsQuery.data.gas_prices && data.app_config.features.gasTracker.isEnabled && (
          <HStack gap={ 2 }>
            <Box color="text.secondary">Gas price</Box>
            <Skeleton loading={ statsQuery.isPlaceholderData }>
              <GasPrice data={ statsQuery.data.gas_prices.average }/>
            </Skeleton>
          </HStack>
        ) }
      </VStack>
    </Box>
  );
};

export default React.memo(ChainWidget);
