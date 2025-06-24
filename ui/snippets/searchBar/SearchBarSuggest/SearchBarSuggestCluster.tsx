import { Grid, Text, Flex, Box } from '@chakra-ui/react';
import React from 'react';

import type { ItemsProps } from './types';
import type { SearchResultCluster } from 'types/api/search';

import { toBech32Address } from 'lib/address/bech32';
import { isEvmAddress } from 'lib/clusters/detectInputType';
import highlightText from 'lib/highlightText';
import ClusterIcon from 'ui/shared/ClusterIcon';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import IconSvg from 'ui/shared/IconSvg';

const SearchBarSuggestCluster = ({ data, searchTerm, addressFormat }: ItemsProps<SearchResultCluster>) => {
  const hash = data.filecoin_robust_address || (addressFormat === 'bech32' ? toBech32Address(data.address_hash) : data.address_hash);
  const isClickable = isEvmAddress(data.address_hash);

  const clusterNameWithSlash = data.cluster_info.name + '/';
  const clusterNameFromSearch = searchTerm.replace(/\/$/, '');

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
      <span dangerouslySetInnerHTML={{ __html: highlightText(clusterNameWithSlash, clusterNameFromSearch) }}/>
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

  const isContractVerified = data.is_smart_contract_verified && (
    <IconSvg name="status/success" boxSize="14px" color="green.500" flexShrink={ 0 }/>
  );

  return (
    <Box { ...containerProps }>
      <Grid
        alignItems="center"
        gridTemplateColumns={{ base: '1fr', md: '228px minmax(auto, max-content) auto' }}
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
          { isContractVerified }
        </Flex>
        <Box display={{ base: 'none', md: 'block' }}/>
      </Grid>
    </Box>
  );
};

export default React.memo(SearchBarSuggestCluster);
