import { chakra, Tr, Td, Text, Flex, Icon, Box, Skeleton } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import type { SearchResultItem } from 'types/api/search';

import blockIcon from 'icons/block.svg';
import labelIcon from 'icons/publictags.svg';
import iconSuccess from 'icons/status/success.svg';
import txIcon from 'icons/transactions.svg';
import dayjs from 'lib/date/dayjs';
import highlightText from 'lib/highlightText';
import * as mixpanel from 'lib/mixpanel/index';
import { saveToRecentKeywords } from 'lib/recentSearchKeywords';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import LinkInternal from 'ui/shared/LinkInternal';
import { getItemCategory, searchItemTitles } from 'ui/shared/search/utils';
import TokenLogo from 'ui/shared/TokenLogo';

interface Props {
  data: SearchResultItem;
  searchTerm: string;
  isLoading?: boolean;
}

const SearchResultTableItem = ({ data, searchTerm, isLoading }: Props) => {

  const handleLinkClick = React.useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    saveToRecentKeywords(searchTerm);
    mixpanel.logEvent(mixpanel.EventTypes.SEARCH_QUERY, {
      'Search query': searchTerm,
      'Source page type': 'Search results',
      'Result URL': e.currentTarget.href,
    });
  }, [ searchTerm ]);

  const content = (() => {
    switch (data.type) {
      case 'token': {
        const name = data.name + (data.symbol ? ` (${ data.symbol })` : '');

        return (
          <>
            <Td fontSize="sm">
              <Flex alignItems="center">
                <TokenLogo boxSize={ 6 } data={ data } flexShrink={ 0 } isLoading={ isLoading }/>
                <LinkInternal
                  ml={ 2 }
                  href={ route({ pathname: '/token/[hash]', query: { hash: data.address } }) }
                  fontWeight={ 700 }
                  wordBreak="break-all"
                  overflow="hidden"
                  isLoading={ isLoading }
                  onClick={ handleLinkClick }
                >
                  <Skeleton
                    isLoaded={ !isLoading }
                    overflow="hidden"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                    dangerouslySetInnerHTML={{ __html: highlightText(name, searchTerm) }}
                  />
                </LinkInternal>
              </Flex>
            </Td>
            <Td fontSize="sm" verticalAlign="middle">
              <Skeleton isLoaded={ !isLoading } whiteSpace="nowrap" overflow="hidden" display="flex" alignItems="center">
                <Box overflow="hidden" whiteSpace="nowrap" w={ data.is_smart_contract_verified ? 'calc(100%-28px)' : 'unset' }>
                  <HashStringShortenDynamic hash={ data.address }/>
                </Box>
                { data.is_smart_contract_verified && <Icon as={ iconSuccess } color="green.500" ml={ 1 }/> }
              </Skeleton>
            </Td>
            <Td fontSize="sm" verticalAlign="middle" isNumeric>
              <Skeleton isLoaded={ !isLoading } whiteSpace="nowrap" overflow="hidden">
                <Text overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis" fontWeight={ 700 }>
                  { data.token_type === 'ERC-20' && data.exchange_rate && `$${ Number(data.exchange_rate).toLocaleString() }` }
                  { data.token_type !== 'ERC-20' && data.total_supply && `Items ${ Number(data.total_supply).toLocaleString() }` }
                </Text>
              </Skeleton>
            </Td>
          </>
        );
      }

      case 'contract':
      case 'address': {
        if (data.name) {
          const shouldHighlightHash = data.address.toLowerCase() === searchTerm.toLowerCase();

          return (
            <>
              <Td fontSize="sm">
                <Flex alignItems="center" overflow="hidden">
                  <AddressIcon address={{ hash: data.address, is_contract: data.type === 'contract', implementation_name: null }} mr={ 2 } flexShrink={ 0 }/>
                  <LinkInternal
                    href={ route({ pathname: '/address/[hash]', query: { hash: data.address } }) }
                    fontWeight={ 700 }
                    overflow="hidden"
                    whiteSpace="nowrap"
                    onClick={ handleLinkClick }
                  >
                    <Box as={ shouldHighlightHash ? 'mark' : 'span' } display="block">
                      <HashStringShortenDynamic hash={ data.address }/>
                    </Box>
                  </LinkInternal>
                  { data.is_smart_contract_verified && <Icon as={ iconSuccess } color="green.500" ml={ 1 }/> }
                </Flex>
              </Td>
              <Td colSpan={ 2 } fontSize="sm" verticalAlign="middle">
                <span dangerouslySetInnerHTML={{ __html: shouldHighlightHash ? data.name : highlightText(data.name, searchTerm) }}/>
              </Td>
            </>
          );
        }

        return (
          <Td colSpan={ 3 } fontSize="sm">
            <Address>
              <AddressIcon address={{ hash: data.address, is_contract: data.type === 'contract', implementation_name: null }} mr={ 2 } flexShrink={ 0 }/>
              <mark>
                <AddressLink hash={ data.address } type="address" fontWeight={ 700 } onClick={ handleLinkClick }/>
              </mark>
              { data.is_smart_contract_verified && <Icon as={ iconSuccess } color="green.500" ml={ 1 }/> }
            </Address>
          </Td>
        );
      }

      case 'label': {
        return (
          <>
            <Td fontSize="sm">
              <Flex alignItems="center">
                <Icon as={ labelIcon } boxSize={ 6 } mr={ 2 } color="gray.500"/>
                <LinkInternal
                  href={ route({ pathname: '/address/[hash]', query: { hash: data.address } }) }
                  fontWeight={ 700 }
                  wordBreak="break-all"
                  isLoading={ isLoading }
                  onClick={ handleLinkClick }
                >
                  <span dangerouslySetInnerHTML={{ __html: highlightText(data.name, searchTerm) }}/>
                </LinkInternal>
              </Flex>
            </Td>
            <Td fontSize="sm" verticalAlign="middle">
              <Flex alignItems="center" overflow="hidden">
                <Box overflow="hidden" whiteSpace="nowrap" w={ data.is_smart_contract_verified ? 'calc(100%-28px)' : 'unset' }>
                  <HashStringShortenDynamic hash={ data.address }/>
                </Box>
                { data.is_smart_contract_verified && <Icon as={ iconSuccess } color="green.500" ml={ 1 }/> }
              </Flex>
            </Td>
            <Td></Td>
          </>
        );
      }

      case 'block': {
        const shouldHighlightHash = data.block_hash.toLowerCase() === searchTerm.toLowerCase();

        return (
          <>
            <Td fontSize="sm">
              <Flex alignItems="center">
                <Icon as={ blockIcon } boxSize={ 6 } mr={ 2 } color="gray.500"/>
                <LinkInternal
                  fontWeight={ 700 }
                  href={ route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: String(data.block_hash) } }) }
                  onClick={ handleLinkClick }
                >
                  <Box as={ shouldHighlightHash ? 'span' : 'mark' }>{ data.block_number }</Box>
                </LinkInternal>
              </Flex>
            </Td>
            <Td fontSize="sm" verticalAlign="middle">
              <Box overflow="hidden" whiteSpace="nowrap" as={ shouldHighlightHash ? 'mark' : 'span' } display="block">
                <HashStringShortenDynamic hash={ data.block_hash }/>
              </Box>
            </Td>
            <Td fontSize="sm" verticalAlign="middle" isNumeric>
              <Text variant="secondary">{ dayjs(data.timestamp).format('llll') }</Text>
            </Td>
          </>
        );
      }

      case 'transaction': {
        return (
          <>
            <Td colSpan={ 2 } fontSize="sm">
              <Flex alignItems="center">
                <Icon as={ txIcon } boxSize={ 6 } mr={ 2 } color="gray.500"/>
                <chakra.mark overflow="hidden">
                  <AddressLink display="block" hash={ data.tx_hash } type="transaction" fontWeight={ 700 } onClick={ handleLinkClick } truncation="dynamic"/>
                </chakra.mark>
              </Flex>
            </Td>
            <Td fontSize="sm" verticalAlign="middle" isNumeric>
              <Text variant="secondary">{ dayjs(data.timestamp).format('llll') }</Text>
            </Td>
          </>
        );
      }
    }
  })();

  const category = getItemCategory(data);

  return (
    <Tr>
      { content }
      <Td fontSize="sm" textTransform="capitalize" verticalAlign="middle">
        <Skeleton isLoaded={ !isLoading } color="text_secondary" display="inline-block">
          <span>{ category ? searchItemTitles[category].itemTitle : '' }</span>
        </Skeleton>
      </Td>
    </Tr>
  );
};

export default React.memo(SearchResultTableItem);
