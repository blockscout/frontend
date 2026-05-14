// SPDX-License-Identifier: LicenseRef-Blockscout

import { Grid, Text, Flex, Box } from '@chakra-ui/react';
import React from 'react';

import type { SearchResultCluster } from 'client/features/name-services/clusters/types/api';
import type { ItemsProps } from 'client/slices/search/components/search-bar/SearchBarSuggest/types';

import { toBech32Address } from 'client/slices/address/utils/bech32';
import { isEvmAddress } from 'client/slices/address/utils/is-evm-address';

import highlightText from 'client/shared/text/highlight-text';

import ClusterIcon from 'ui/shared/ClusterIcon';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';

const SearchBarSuggestCluster = ({ data, searchTerm, addressFormat }: ItemsProps<SearchResultCluster>) => {
  const hash = data.filecoin_robust_address || (addressFormat === 'bech32' ? toBech32Address(data.address_hash) : data.address_hash);
  const isClickable = isEvmAddress(data.address_hash);

  const shouldShowTrailingSlash = searchTerm.trim().endsWith('/');
  const displayName = shouldShowTrailingSlash ? data.cluster_info.name + '/' : data.cluster_info.name;
  const searchTermForHighlight = searchTerm.replace(/\/$/, '');

  const containerProps = {
    opacity: isClickable ? 1 : 0.6,
  };

  const icon = <ClusterIcon clusterName={ data.cluster_info.name }/>;

  const name = (
    <Text
      fontWeight={ 700 }
      overflow="hidden"
      whiteSpace="nowrap"
      textOverflow="ellipsis"
    >
      <span dangerouslySetInnerHTML={{ __html: highlightText(displayName, searchTermForHighlight) }}/>
    </Text>
  );

  const address = (
    <Text
      overflow="hidden"
      whiteSpace="nowrap"
      color="text.secondary"
    >
      <HashStringShortenDynamic hash={ hash } noTooltip/>
    </Text>
  );

  return (
    <Box { ...containerProps }>
      <Grid
        alignItems="center"
        gridTemplateColumns={{ base: '1fr', md: '228px 1fr' }}
        gap={ 2 }
      >
        <Flex alignItems="center">
          { icon }
          { name }
        </Flex>
        <Flex
          alignItems="center"
          overflow="hidden"
          gap={ 1 }
          mt={{ base: 0, md: 0 }}
        >
          { address }
        </Flex>
      </Grid>
    </Box>
  );
};

export default React.memo(SearchBarSuggestCluster);
