import { Flex, Icon, Box, chakra, Skeleton } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import type { SearchResultItem } from 'types/api/search';

import blockIcon from 'icons/block.svg';
import labelIcon from 'icons/publictags.svg';
import txIcon from 'icons/transactions.svg';
import highlightText from 'lib/highlightText';
import * as mixpanel from 'lib/mixpanel/index';
import { saveToRecentKeywords } from 'lib/recentSearchKeywords';
import trimTokenSymbol from 'lib/token/trimTokenSymbol';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import LinkInternal from 'ui/shared/LinkInternal';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import TokenLogo from 'ui/shared/TokenLogo';

interface Props {
  data: SearchResultItem;
  searchTerm: string;
  isLoading?: boolean;
}

const SearchResultListItem = ({ data, searchTerm, isLoading }: Props) => {

  const handleLinkClick = React.useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    saveToRecentKeywords(searchTerm);
    mixpanel.logEvent(mixpanel.EventTypes.SEARCH_QUERY, {
      'Search query': searchTerm,
      'Source page type': 'Search results',
      'Result URL': e.currentTarget.href,
    });
  }, [ searchTerm ]);

  const firstRow = (() => {
    switch (data.type) {
      case 'token': {
        const name = data.name + (data.symbol ? ` (${ trimTokenSymbol(data.symbol) })` : '');

        return (
          <Flex alignItems="flex-start">
            <TokenLogo boxSize={ 6 } data={ data } flexShrink={ 0 } isLoading={ isLoading }/>
            <LinkInternal
              ml={ 2 }
              href={ route({ pathname: '/token/[hash]', query: { hash: data.address } }) }
              fontWeight={ 700 }
              wordBreak="break-all"
              isLoading={ isLoading }
              onClick={ handleLinkClick }
            >
              <Skeleton isLoaded={ !isLoading } dangerouslySetInnerHTML={{ __html: highlightText(name, searchTerm) }}/>
            </LinkInternal>
          </Flex>
        );
      }

      case 'contract':
      case 'address': {
        const shouldHighlightHash = data.address.toLowerCase() === searchTerm.toLowerCase();
        return (
          <Address>
            <AddressIcon address={{ hash: data.address, is_contract: data.type === 'contract', implementation_name: null }} mr={ 2 } flexShrink={ 0 }/>
            <Box as={ shouldHighlightHash ? 'mark' : 'span' } display="block" whiteSpace="nowrap" overflow="hidden">
              <AddressLink type="address" hash={ data.address } fontWeight={ 700 } display="block" w="100%" onClick={ handleLinkClick }/>
            </Box>
          </Address>
        );
      }

      case 'label': {
        return (
          <Flex alignItems="flex-start">
            <Icon as={ labelIcon } boxSize={ 6 } mr={ 2 } color="gray.500"/>
            <LinkInternal
              ml={ 2 }
              href={ route({ pathname: '/address/[hash]', query: { hash: data.address } }) }
              fontWeight={ 700 }
              wordBreak="break-all"
              isLoading={ isLoading }
              onClick={ handleLinkClick }
            >
              <span dangerouslySetInnerHTML={{ __html: highlightText(data.name, searchTerm) }}/>
            </LinkInternal>
          </Flex>
        );
      }

      case 'block': {
        const shouldHighlightHash = data.block_hash.toLowerCase() === searchTerm.toLowerCase();
        return (
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
        );
      }

      case 'transaction': {
        return (
          <Flex alignItems="center" overflow="hidden">
            <Icon as={ txIcon } boxSize={ 6 } mr={ 2 } color="gray.500"/>
            <chakra.mark display="block" overflow="hidden">
              <AddressLink hash={ data.tx_hash } type="transaction" fontWeight={ 700 } display="block" onClick={ handleLinkClick }/>
            </chakra.mark>
          </Flex>
        );
      }
    }
  })();

  const secondRow = (() => {
    switch (data.type) {
      case 'token': {
        return (
          <Skeleton isLoaded={ !isLoading }>
            <HashStringShortenDynamic hash={ data.address }/>
          </Skeleton>
        );
      }
      case 'block': {
        const shouldHighlightHash = data.block_hash.toLowerCase() === searchTerm.toLowerCase();
        return (
          <Box as={ shouldHighlightHash ? 'mark' : 'span' } display="block" w="100%" whiteSpace="nowrap" overflow="hidden">
            <HashStringShortenDynamic hash={ data.block_hash }/>
          </Box>
        );
      }
      case 'contract':
      case 'address': {
        const shouldHighlightHash = data.address.toLowerCase() === searchTerm.toLowerCase();
        return data.name ? <span dangerouslySetInnerHTML={{ __html: shouldHighlightHash ? data.name : highlightText(data.name, searchTerm) }}/> : null;
      }

      default:
        return null;
    }
  })();

  return (
    <ListItemMobile py={ 3 } fontSize="sm" rowGap={ 2 }>
      <Flex justifyContent="space-between" w="100%" overflow="hidden" lineHeight={ 6 }>
        { firstRow }
        <Skeleton isLoaded={ !isLoading } color="text_secondary" ml={ 8 } textTransform="capitalize">
          <span>{ data.type }</span>
        </Skeleton>
      </Flex>
      { Boolean(secondRow) && (
        <Box w="100%" overflow="hidden" whiteSpace="nowrap">
          { secondRow }
        </Box>
      ) }
    </ListItemMobile>
  );
};

export default SearchResultListItem;
