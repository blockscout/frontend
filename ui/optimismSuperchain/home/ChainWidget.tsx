import { Box, HStack, VStack } from '@chakra-ui/react';
import React from 'react';

import type { ChainConfig } from 'types/multichain';

import useApiQuery from 'lib/api/useApiQuery';
import { HOMEPAGE_STATS } from 'stubs/stats';
import { Heading } from 'toolkit/chakra/heading';
import { Image } from 'toolkit/chakra/image';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import GasPrice from 'ui/shared/gas/GasPrice';
import IconSvg from 'ui/shared/IconSvg';

import ChainLatestBlockInfo from './ChainLatestBlockInfo';

interface Props {
  data: ChainConfig;
}

const ChainWidget = ({ data }: Props) => {
  const statsQuery = useApiQuery('general:stats', {
    chainSlug: data.slug,
    queryOptions: {
      placeholderData: HOMEPAGE_STATS,
    },
  });

  return (
    <Box
      bgColor={{ _light: 'blackAlpha.50', _dark: 'whiteAlpha.50' }}
      borderRadius="xl"
      border="1px solid"
      borderColor={{ _light: 'gray.200', _dark: 'gray.900' }}
      p={ 4 }
      flexBasis="50%"
      textStyle="sm"
    >
      <HStack justifyContent="space-between">
        <Image src={ data.config.UI.navigation.icon.default } alt={ data.config.chain.name } boxSize="30px" borderRadius="full"/>
        <Link
          href={ data.config.app.baseUrl }
          target="_blank"
          p={ 1 }
          color="gray.500"
          _hover={{
            color: 'link.primary.hover',
          }}
          bgColor={{ _light: 'blackAlpha.50', _dark: 'whiteAlpha.50' }}
          borderRadius="base"
        >
          <IconSvg name="globe" boxSize={ 6 }/>
        </Link>
      </HStack>
      <Heading mt={ 3 } level="3">{ data.config.chain.name }</Heading>
      <VStack gap={ 2 } mt={ 3 } alignItems="flex-start">
        <HStack gap={ 2 }>
          <Box color="text.secondary">Chain ID</Box>
          <Box>{ data.config.chain.id }</Box>
          <CopyToClipboard text={ String(data.config.chain.id) } ml={ 0 }/>
        </HStack>
        <ChainLatestBlockInfo slug={ data.slug }/>
        { statsQuery.data && statsQuery.data.gas_prices && data.config.features.gasTracker.isEnabled && (
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
