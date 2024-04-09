import { Box, chakra, Flex, Text } from '@chakra-ui/react';
import React from 'react';

import type { SearchResultAddressOrContractOrUniversalProfile } from 'types/api/search';

import dayjs from '../../../../lib/date/dayjs';
import highlightText from '../../../../lib/highlightText';
import { ADDRESS_REGEXP } from '../../../../lib/validations/address';
import * as AddressEntity from '../../../shared/entities/address/AddressEntity';
import { formattedLuksoName } from '../../../shared/entities/address/IdenticonUniversalProfileQuery';
import HashStringShortenDynamic from '../../../shared/HashStringShortenDynamic';

interface Props {
  data: SearchResultAddressOrContractOrUniversalProfile;
  isMobile: boolean | undefined;
  searchTerm: string;
}

const SearchBarSuggestAddress = ({ data, isMobile, searchTerm }: Props) => {
  const shouldHighlightHash = ADDRESS_REGEXP.test(searchTerm);
  const icon = (
    <AddressEntity.Icon
      address={{
        hash: data.address,
        is_contract: data.type === 'contract' || data.type === 'universal_profile',
        name: '',
        is_verified: data.is_smart_contract_verified,
        implementation_name: null,
        ens_domain_name: null,
      }}
    />
  );
  const addressName = data.name || data.ens_info?.name;
  const expiresText = data.ens_info?.expiry_date ? ` (expires ${ dayjs(data.ens_info.expiry_date).fromNow() })` : '';

  if (data.name === null) {
    data.name = '';
  }

  const highlightedText = data.type === 'universal_profile' ? data.address : data.name;

  const nameEl = addressName && (
    <Text
      variant="secondary"
      overflow="hidden"
      whiteSpace="nowrap"
      textOverflow="ellipsis"
    >
      <chakra.span fontWeight={ 500 } dangerouslySetInnerHTML={{ __html: highlightText(highlightedText, searchTerm) }}/>
      { data.ens_info &&
                (
                  data.ens_info.names_count > 1 ?
                    <span> ({ data.ens_info.names_count > 39 ? '40+' : `+${ data.ens_info.names_count - 1 }` })</span> :
                    <span>{ expiresText }</span>
                )
      }
    </Text>
  );

  const dynamicTitle = data.type === 'universal_profile' ? formattedLuksoName(data.address, data.name) : data.address;
  const addressEl = <HashStringShortenDynamic hash={ dynamicTitle } isTooltipDisabled/>;

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
