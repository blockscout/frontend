import { Grid, Text, Flex, Icon } from '@chakra-ui/react';
import React from 'react';

import type { SearchResultToken } from 'types/api/search';

import iconSuccess from 'icons/status/success.svg';
import verifiedToken from 'icons/verified_token.svg';
import highlightText from 'lib/highlightText';
import * as TokenEntity from 'ui/shared/entities/token/TokenEntity';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';

interface Props {
  data: SearchResultToken;
  isMobile: boolean | undefined;
  searchTerm: string;
}

const SearchBarSuggestToken = ({ data, isMobile, searchTerm }: Props) => {
  const icon = <TokenEntity.Icon token={{ ...data, type: data.token_type }}/>;
  const verifiedIcon = <Icon as={ verifiedToken } boxSize={ 4 } color="green.500" ml={ 1 }/>;
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
    <Text variant="secondary" whiteSpace="nowrap" overflow="hidden">
      <HashStringShortenDynamic hash={ data.address } isTooltipDisabled/>
    </Text>
  );

  const contractVerifiedIcon = data.is_smart_contract_verified && <Icon as={ iconSuccess } color="green.500" ml={ 1 }/>;
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
          { data.is_verified_via_admin_panel && verifiedIcon }
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
        { data.is_verified_via_admin_panel && verifiedIcon }
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
