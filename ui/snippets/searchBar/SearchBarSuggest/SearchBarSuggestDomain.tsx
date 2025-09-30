import { Grid, Text, Flex } from '@chakra-ui/react';
import React from 'react';

import type { ItemsProps } from './types';
import type { SearchResultDomain } from 'types/api/search';

import { toBech32Address } from 'lib/address/bech32';
import dayjs from 'lib/date/dayjs';
import highlightText from 'lib/highlightText';
import * as EnsEntity from 'ui/shared/entities/ens/EnsEntity';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import IconSvg from 'ui/shared/IconSvg';

const SearchBarSuggestDomain = ({ data, isMobile, searchTerm, addressFormat }: ItemsProps<SearchResultDomain>) => {
  const icon = <EnsEntity.Icon protocol={ data.ens_info.protocol }/>;
  const hash = data.filecoin_robust_address || (addressFormat === 'bech32' ? toBech32Address(data.address_hash) : data.address_hash);

  const name = (
    <Text
      fontWeight={ 700 }
      overflow="hidden"
      whiteSpace="nowrap"
      textOverflow="ellipsis"
    >
      <span dangerouslySetInnerHTML={{ __html: highlightText(data.ens_info.name, searchTerm) }}/>
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

  const isContractVerified = data.is_smart_contract_verified && <IconSvg name="status/success" boxSize="14px" color="green.500" flexShrink={ 0 }/>;

  const expiresText = data.ens_info?.expiry_date ? ` expires ${ dayjs(data.ens_info.expiry_date).fromNow() }` : '';
  const ensNamesCount = data?.ens_info.names_count > 39 ? '40+' : `+${ data.ens_info.names_count - 1 }`;
  const additionalInfo = (
    <Text color="text.secondary" textAlign={ isMobile ? 'start' : 'end' }>
      { data?.ens_info.names_count > 1 ? ensNamesCount : expiresText }
    </Text>
  );

  if (isMobile) {
    return (
      <>
        <Flex alignItems="center" overflow="hidden">
          { icon }
          { name }
        </Flex>
        <Flex alignItems="center" overflow="hidden" gap={ 1 }>
          { address }
          { isContractVerified }
        </Flex>
        { additionalInfo }
      </>
    );
  }

  return (
    <Grid alignItems="center" gridTemplateColumns="228px minmax(auto, max-content) auto" gap={ 2 }>
      <Flex alignItems="center">
        { icon }
        { name }
      </Flex>
      <Flex alignItems="center" overflow="hidden" gap={ 1 }>
        { address }
        { isContractVerified }
      </Flex>
      { additionalInfo }
    </Grid>
  );
};

export default React.memo(SearchBarSuggestDomain);
