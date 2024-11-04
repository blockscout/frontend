import { chakra, Box, Text, Flex } from '@chakra-ui/react';
import React from 'react';

import type { ItemsProps } from './types';
import type { SearchResultAddressOrContract } from 'types/api/search';

import { toBech32Address } from 'lib/address/bech32';
import dayjs from 'lib/date/dayjs';
import highlightText from 'lib/highlightText';
import ContractCertifiedLabel from 'ui/shared/ContractCertifiedLabel';
import * as AddressEntity from 'ui/shared/entities/address/AddressEntity';
import { ADDRESS_REGEXP } from 'ui/shared/forms/validators/address';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';

const SearchBarSuggestAddress = ({ data, isMobile, searchTerm, addressFormat }: ItemsProps<SearchResultAddressOrContract>) => {
  const shouldHighlightHash = ADDRESS_REGEXP.test(searchTerm);
  const hash = data.filecoin_robust_address || (addressFormat === 'bech32' ? toBech32Address(data.address) : data.address);

  const icon = (
    <AddressEntity.Icon
      address={{
        hash: data.address,
        is_contract: data.type === 'contract',
        name: '',
        is_verified: data.is_smart_contract_verified,
        ens_domain_name: null,
        implementations: null,
      }}
    />
  );
  const addressName = data.name || data.ens_info?.name;
  const expiresText = data.ens_info?.expiry_date ? ` (expires ${ dayjs(data.ens_info.expiry_date).fromNow() })` : '';

  const nameEl = addressName && (
    <Flex alignItems="center">
      <Text
        variant="secondary"
        overflow="hidden"
        whiteSpace="nowrap"
        textOverflow="ellipsis"
      >
        <chakra.span fontWeight={ 500 } dangerouslySetInnerHTML={{ __html: highlightText(addressName, searchTerm) }}/>
        { data.ens_info && (
          data.ens_info.names_count > 1 ?
            <span> ({ data.ens_info.names_count > 39 ? '40+' : `+${ data.ens_info.names_count - 1 }` })</span> :
            <span>{ expiresText }</span>
        ) }
      </Text>
      { data.certified && <ContractCertifiedLabel boxSize={ 5 } iconSize={ 5 } ml={ 1 }/> }
    </Flex>
  );
  const addressEl = <HashStringShortenDynamic hash={ hash } isTooltipDisabled/>;

  if (isMobile) {
    return (
      <>
        <Flex alignItems="center">
          { icon }
          <Box
            as={ shouldHighlightHash ? 'mark' : 'span' }
            display="block"
            overflow="hidden"
            whiteSpace="nowrap"
            fontWeight={ 700 }
          >
            { addressEl }
          </Box>
        </Flex>
        { nameEl }
      </>
    );
  }

  return (
    <Flex alignItems="center">
      <Flex alignItems="center" w="450px" mr={ 2 }>
        { icon }
        <Box
          as={ shouldHighlightHash ? 'mark' : 'span' }
          display="block"
          overflow="hidden"
          whiteSpace="nowrap"
          fontWeight={ 700 }
        >
          { addressEl }
        </Box>
      </Flex>
      { nameEl }
    </Flex>
  );
};

export default React.memo(SearchBarSuggestAddress);
