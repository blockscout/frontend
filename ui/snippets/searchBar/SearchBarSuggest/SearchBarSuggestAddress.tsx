import { chakra, Box, Text, Flex } from '@chakra-ui/react';
import React from 'react';

import type { SearchResultAddressOrContract } from 'types/api/search';

import dayjs from 'lib/date/dayjs';
import highlightText from 'lib/highlightText';
import ContractCertifiedLabel from 'ui/shared/ContractCertifiedLabel';
import * as AddressEntity from 'ui/shared/entities/address/AddressEntity';
import { ADDRESS_REGEXP } from 'ui/shared/forms/validators/address';
import IconSvg from 'ui/shared/IconSvg';
import { formatPubKey } from 'ui/storage/utils';

interface Props {
  data: SearchResultAddressOrContract;
  isMobile: boolean | undefined;
  searchTerm: string;
  isFirst?: boolean;
}

const SearchBarSuggestAddress = ({ data, isMobile, searchTerm, isFirst }: Props) => {
  const shouldHighlightHash = ADDRESS_REGEXP.test(searchTerm);

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
      { data.certified && <ContractCertifiedLabel boxSize={ 4 } iconSize={ 4 } ml={ 1 }/> }
    </Flex>
  );
  // const addressEl = <HashStringShortenDynamic hash={ data.address } isTooltipDisabled/>;
  const addressEl = (<Text color="#C15E97">{ formatPubKey(data.address, 9, 9) }</Text>);

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
    <Flex justifyContent="space-between">
      <Flex alignItems="center" minW={ 0 }>
        <IconSvg w="24px" h="24px" color="#DCD4FF" mr="8px" name="face"/>
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
      { /* <Text variant="secondary" textAlign="end" flexShrink={ 0 } ml="auto">{ date }</Text> */ }
      {
        isFirst ? (
          <Flex justifyContent="end" alignItems="center">
            <IconSvg transform="rotate(-180deg)" float="right" w="24px" h="24px" mr="8px" name="arrows/east"/>
          </Flex>
        ) : null
      }
    </Flex>
  );
};

export default React.memo(SearchBarSuggestAddress);
