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
  const name = data.name + (data.symbol ? ` (${ data.symbol })` : '');

  if (isMobile) {
    return (
      <>
        <Flex alignItems="center" justifyContent="space-between">
          <TokenLogo boxSize={ 6 } data={ data } flexShrink={ 0 }/>
          <Text
            fontWeight={ 700 }
            overflow="hidden"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
            ml={ 2 }
            flexGrow={ 1 }
          >
            <span dangerouslySetInnerHTML={{ __html: highlightText(name, searchTerm) }}/>
          </Text>
        </Flex>
        <Grid templateColumns="1fr auto auto" alignItems="center">
          <Text variant="secondary" whiteSpace="nowrap" overflow="hidden">
            <HashStringShortenDynamic hash={ data.address } isTooltipDisabled/>
          </Text>
          { data.is_smart_contract_verified && <Icon as={ iconSuccess } color="green.500" ml={ 2 }/> }
          { data.token_type === 'ERC-20' && data.exchange_rate && (
            <Text overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis"ml={ 2 } fontWeight={ 700 } maxW="200px">
              ${ Number(data.exchange_rate).toLocaleString() }
            </Text>
          ) }
          { data.token_type !== 'ERC-20' && data.total_supply && (
            <Text overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis"ml={ 2 } variant="secondary" maxW="200px" >
              Items { Number(data.total_supply).toLocaleString() }
            </Text>
          ) }
        </Grid>
      </>
    );
  }

  return (
    <Grid templateColumns="24px 200px 1fr auto">
      <TokenLogo boxSize={ 6 } data={ data }/>
      <Text
        fontWeight={ 700 }
        overflow="hidden"
        whiteSpace="nowrap"
        textOverflow="ellipsis"
        ml={ 2 }
        flexGrow={ 0 }
      >
        <span dangerouslySetInnerHTML={{ __html: highlightText(name, searchTerm) }}/>
      </Text>
      <Flex alignItems="center">
        <Text overflow="hidden" whiteSpace="nowrap" ml={ 2 } variant="secondary">
          <HashStringShortenDynamic hash={ data.address } isTooltipDisabled/>
        </Text>
        { data.is_smart_contract_verified && <Icon as={ iconSuccess } color="green.500" ml={ 2 }/> }
      </Flex>
      { data.token_type === 'ERC-20' && data.exchange_rate && (
        <Text overflow="hidden" whiteSpace="nowrap" ml={ 2 } fontWeight={ 700 }>
          ${ Number(data.exchange_rate).toLocaleString() }
        </Text>
      ) }
      { data.token_type !== 'ERC-20' && data.total_supply && (
        <Text overflow="hidden" whiteSpace="nowrap" ml={ 2 } variant="secondary">
          Items { Number(data.total_supply).toLocaleString() }
        </Text>
      ) }
    </Grid>
  );
};

export default React.memo(SearchBarSuggestToken);
