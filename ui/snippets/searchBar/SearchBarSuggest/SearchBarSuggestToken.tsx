import { Grid, Text, Flex } from '@chakra-ui/react';
import React from 'react';

import type { ItemsProps } from './types';
import type { SearchResultToken } from 'types/api/search';

import { toBech32Address } from 'lib/address/bech32';
import highlightText from 'lib/highlightText';
import ContractCertifiedLabel from 'ui/shared/ContractCertifiedLabel';
import * as TokenEntity from 'ui/shared/entities/token/TokenEntity';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import IconSvg from 'ui/shared/IconSvg';

const SearchBarSuggestToken = ({ data, isMobile, searchTerm, addressFormat }: ItemsProps<SearchResultToken>) => {
  const icon = <TokenEntity.Icon token={{ ...data, type: data.token_type }}/>;
  const verifiedIcon = <IconSvg name="certified" boxSize={ 4 } color="green.500" ml={ 1 } flexShrink={ 0 }/>;
  const certifiedIcon = <ContractCertifiedLabel iconSize={ 4 } boxSize={ 4 } ml={ 1 } flexShrink={ 0 }/>;
  const hash = data.filecoin_robust_address || (addressFormat === 'bech32' ? toBech32Address(data.address_hash) : data.address_hash);

  const name = (
    <Text
      fontWeight={ 700 }
      overflow="hidden"
      whiteSpace="nowrap"
      textOverflow="ellipsis"
    >
      <span dangerouslySetInnerHTML={{ __html: highlightText(data.name + (data.symbol ? ` (${ data.symbol })` : ''), searchTerm) }}/>
    </Text>
  );

  const address = (
    <Text color="text.secondary" whiteSpace="nowrap" overflow="hidden">
      <HashStringShortenDynamic hash={ hash } noTooltip/>
    </Text>
  );

  const contractVerifiedIcon = data.is_smart_contract_verified && <IconSvg name="status/success" boxSize="14px" color="green.500" ml={ 1 } flexShrink={ 0 }/>;
  const additionalInfo = (
    <Text overflow="hidden" whiteSpace="nowrap" fontWeight={ 700 }>
      { data.token_type === 'ERC-20' && data.exchange_rate && `$${ Number(data.exchange_rate).toLocaleString() }` }
      { data.token_type !== 'ERC-20' && data.total_supply && `Items ${ Number(data.total_supply).toLocaleString() }` }
    </Text>
  );

  if (isMobile) {
    const templateCols = `1fr
    ${ (data.token_type === 'ERC-20' && data.exchange_rate) || (data.token_type !== 'ERC-20' && data.total_supply) ? ' auto' : '' }`;

    return (
      <>
        <Flex alignItems="center">
          { icon }
          { name }
          { data.certified && certifiedIcon }
          { data.is_verified_via_admin_panel && !data.certified && verifiedIcon }
        </Flex>
        <Grid templateColumns={ templateCols } alignItems="center" gap={ 2 }>
          <Flex alignItems="center" overflow="hidden">
            { address }
            { contractVerifiedIcon }
          </Flex>
          { additionalInfo }
        </Grid>
      </>
    );
  }

  return (
    <Grid templateColumns="228px 1fr auto" gap={ 2 }>
      <Flex alignItems="center">
        { icon }
        { name }
        { data.certified && certifiedIcon }
        { data.is_verified_via_admin_panel && !data.certified && verifiedIcon }
      </Flex>
      <Flex alignItems="center" overflow="hidden">
        { address }
        { contractVerifiedIcon }
      </Flex>
      { additionalInfo }
    </Grid>
  );
};

export default React.memo(SearchBarSuggestToken);
