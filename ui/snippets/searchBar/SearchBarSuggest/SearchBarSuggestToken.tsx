import { Grid, Text, Flex, Icon } from '@chakra-ui/react';
import React from 'react';

import type { SearchResultToken } from 'types/api/search';

import iconSuccess from 'icons/status/success.svg';
import highlightText from 'lib/highlightText';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import TokenLogo from 'ui/shared/TokenLogo';

interface Props {
  data: SearchResultToken;
  isMobile: boolean | undefined;
  searchTerm: string;
}

const SearchBarSuggestToken = ({ data, isMobile, searchTerm }: Props) => {
  const icon = <TokenLogo boxSize={ 6 } data={ data }/>;
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

  const contractVerifiedIcon = data.is_smart_contract_verified && <Icon as={ iconSuccess } color="green.500"/>;
  const additionalInfo = (
    <Text overflow="hidden" whiteSpace="nowrap" fontWeight={ 700 }>
      { data.token_type === 'ERC-20' && data.exchange_rate && `$${ Number(data.exchange_rate).toLocaleString() }` }
      { data.token_type !== 'ERC-20' && data.total_supply && `Items ${ Number(data.total_supply).toLocaleString() }` }
    </Text>
  );

  if (isMobile) {
    const templateCols = `1fr
    ${ data.is_smart_contract_verified ? ' auto' : '' }
    ${ (data.token_type === 'ERC-20' && data.exchange_rate) || (data.token_type !== 'ERC-20' && data.total_supply) ? ' auto' : '' }`;

    return (
      <>
        <Flex alignItems="center" gap={ 2 }>
          { icon }
          { name }
        </Flex>
        <Grid templateColumns={ templateCols } alignItems="center" gap={ 2 }>
          { address }
          { contractVerifiedIcon }
          { additionalInfo }
        </Grid>
      </>
    );
  }

  return (
    <Grid templateColumns="24px 200px 1fr auto" gap={ 2 }>
      { icon }
      { name }
      <Flex alignItems="center" gap={ 2 }>
        { address }
        { contractVerifiedIcon }
      </Flex>
      { additionalInfo }
    </Grid>
  );
};

export default React.memo(SearchBarSuggestToken);
