import { Tr, Td, Text, Flex, Icon, Image, Box, Skeleton, useColorMode, Tag } from '@chakra-ui/react';
import React from 'react';
import xss from 'xss';

import type { SearchResultItem } from 'types/api/search';

import { route } from 'nextjs-routes';

import labelIcon from 'icons/publictags_slim.svg';
import iconSuccess from 'icons/status/success.svg';
import verifiedToken from 'icons/verified_token.svg';
import dayjs from 'lib/date/dayjs';
import highlightText from 'lib/highlightText';
import * as mixpanel from 'lib/mixpanel/index';
import { saveToRecentKeywords } from 'lib/recentSearchKeywords';
import * as AddressEntity from 'ui/shared/entities/address/AddressEntity';
import * as BlockEntity from 'ui/shared/entities/block/BlockEntity';
import * as TokenEntity from 'ui/shared/entities/token/TokenEntity';
import * as TxEntity from 'ui/shared/entities/tx/TxEntity';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import LinkExternal from 'ui/shared/LinkExternal';
import LinkInternal from 'ui/shared/LinkInternal';
import type { SearchResultAppItem } from 'ui/shared/search/utils';
import { getItemCategory, searchItemTitles } from 'ui/shared/search/utils';

interface Props {
  data: SearchResultItem | SearchResultAppItem;
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

  const { colorMode } = useColorMode();

  const content = (() => {
    switch (data.type) {
      case 'token': {
        const name = data.name + (data.symbol ? ` (${ data.symbol })` : '');

        return (
          <>
            <Td fontSize="sm">
              <Flex alignItems="center">
                <TokenEntity.Icon token={{ ...data, type: data.token_type }} isLoading={ isLoading }/>
                <LinkInternal
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
                { data.is_verified_via_admin_panel && <Icon as={ verifiedToken } boxSize={ 4 } ml={ 1 } color="green.500"/> }
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
          const address = {
            hash: data.address,
            is_contract: data.type === 'contract',
            is_verified: data.is_smart_contract_verified,
            name: null,
            implementation_name: null,
          };

          return (
            <>
              <Td fontSize="sm">
                <AddressEntity.Container>
                  <AddressEntity.Icon address={ address }/>
                  <AddressEntity.Link
                    address={ address }
                    onClick={ handleLinkClick }
                  >
                    <AddressEntity.Content
                      asProp={ shouldHighlightHash ? 'mark' : 'span' }
                      address={ address }
                      fontSize="sm"
                      lineHeight={ 5 }
                      fontWeight={ 700 }
                    />
                  </AddressEntity.Link>
                  <AddressEntity.Copy address={ address }/>
                </AddressEntity.Container>
              </Td>
              <Td colSpan={ 2 } fontSize="sm" verticalAlign="middle">
                <span dangerouslySetInnerHTML={{ __html: shouldHighlightHash ? xss(data.name) : highlightText(data.name, searchTerm) }}/>
              </Td>
            </>
          );
        }

        const address = {
          hash: data.address,
          is_contract: data.type === 'contract',
          is_verified: data.is_smart_contract_verified,
          name: null,
          implementation_name: null,
        };

        return (
          <Td colSpan={ 3 } fontSize="sm">
            <AddressEntity.Container>
              <AddressEntity.Icon address={ address }/>
              <AddressEntity.Link
                address={ address }
                onClick={ handleLinkClick }
              >
                <AddressEntity.Content
                  asProp="mark"
                  address={ address }
                  fontSize="sm"
                  lineHeight={ 5 }
                  fontWeight={ 700 }
                />
              </AddressEntity.Link>
              <AddressEntity.Copy address={ address }/>
            </AddressEntity.Container>
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

      case 'app': {
        const title = <span dangerouslySetInnerHTML={{ __html: highlightText(data.app.title, searchTerm) }}/>;
        return (
          <>
            <Td fontSize="sm">
              <Flex alignItems="center">
                <Image
                  borderRadius="base"
                  boxSize={ 6 }
                  mr={ 2 }
                  src={ colorMode === 'dark' && data.app.logoDarkMode ? data.app.logoDarkMode : data.app.logo }
                  alt={ `${ data.app.title } app icon` }
                />
                { data.app.external ? (
                  <LinkExternal
                    href={ data.app.url }
                    fontWeight={ 700 }
                    wordBreak="break-all"
                    isLoading={ isLoading }
                    onClick={ handleLinkClick }
                  >
                    { title }
                  </LinkExternal>
                ) : (
                  <LinkInternal
                    href={ route({ pathname: '/apps/[id]', query: { id: data.app.id } }) }
                    fontWeight={ 700 }
                    wordBreak="break-all"
                    isLoading={ isLoading }
                    onClick={ handleLinkClick }
                  >
                    { title }
                  </LinkInternal>
                ) }
              </Flex>
            </Td>
            <Td fontSize="sm" verticalAlign="middle" colSpan={ 2 }>
              <Text
                overflow="hidden"
                whiteSpace="nowrap"
                textOverflow="ellipsis"
              >
                { data.app.description }
              </Text>
            </Td>
          </>
        );
      }

      case 'block': {
        const shouldHighlightHash = data.block_hash.toLowerCase() === searchTerm.toLowerCase();

        return (
          <>
            <Td fontSize="sm">
              <BlockEntity.Container>
                <BlockEntity.Icon/>
                <BlockEntity.Link
                  hash={ data.block_hash }
                  number={ Number(data.block_number) }
                  onClick={ handleLinkClick }
                >
                  <BlockEntity.Content
                    asProp={ shouldHighlightHash ? 'span' : 'mark' }
                    number={ Number(data.block_number) }
                    fontSize="sm"
                    lineHeight={ 5 }
                    fontWeight={ 700 }
                  />
                </BlockEntity.Link>
              </BlockEntity.Container>
            </Td>
            <Td fontSize="sm" verticalAlign="middle">
              <Flex columnGap={ 2 } alignItems="center">
                { data.block_type === 'reorg' && <Tag flexShrink={ 0 }>Reorg</Tag> }
                <Box overflow="hidden" whiteSpace="nowrap" as={ shouldHighlightHash ? 'mark' : 'span' } display="block">
                  <HashStringShortenDynamic hash={ data.block_hash }/>
                </Box>
              </Flex>
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
              <TxEntity.Container>
                <TxEntity.Icon/>
                <TxEntity.Link
                  isLoading={ isLoading }
                  hash={ data.tx_hash }
                  onClick={ handleLinkClick }
                >
                  <TxEntity.Content
                    asProp="mark"
                    hash={ data.tx_hash }
                    fontSize="sm"
                    lineHeight={ 5 }
                    fontWeight={ 700 }
                  />
                </TxEntity.Link>
              </TxEntity.Container>
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
