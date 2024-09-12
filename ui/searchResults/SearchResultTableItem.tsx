import { chakra, Tr, Td, Text, Flex, Image, Box, Skeleton, useColorMode, Tag } from '@chakra-ui/react';
import React from 'react';
import xss from 'xss';

import type { SearchResultItem } from 'types/client/search';

import { route } from 'nextjs-routes';

import dayjs from 'lib/date/dayjs';
import highlightText from 'lib/highlightText';
import * as mixpanel from 'lib/mixpanel/index';
import { saveToRecentKeywords } from 'lib/recentSearchKeywords';
import { ADDRESS_REGEXP } from 'lib/validations/address';
import ContractCertifiedLabel from 'ui/shared/ContractCertifiedLabel';
import * as AddressEntity from 'ui/shared/entities/address/AddressEntity';
import * as BlobEntity from 'ui/shared/entities/blob/BlobEntity';
import * as BlockEntity from 'ui/shared/entities/block/BlockEntity';
import * as EnsEntity from 'ui/shared/entities/ens/EnsEntity';
import * as TokenEntity from 'ui/shared/entities/token/TokenEntity';
import * as TxEntity from 'ui/shared/entities/tx/TxEntity';
import * as UserOpEntity from 'ui/shared/entities/userOp/UserOpEntity';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import IconSvg from 'ui/shared/IconSvg';
import LinkExternal from 'ui/shared/links/LinkExternal';
import LinkInternal from 'ui/shared/links/LinkInternal';
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
                { data.is_verified_via_admin_panel && <IconSvg name="certified" boxSize={ 4 } ml={ 1 } color="green.500"/> }
              </Flex>
            </Td>
            <Td fontSize="sm" verticalAlign="middle">
              <Skeleton isLoaded={ !isLoading } whiteSpace="nowrap" overflow="hidden" display="flex" alignItems="center">
                <Box overflow="hidden" whiteSpace="nowrap" w={ data.is_smart_contract_verified ? 'calc(100%-28px)' : 'unset' }>
                  <HashStringShortenDynamic hash={ data.address }/>
                </Box>
                { data.is_smart_contract_verified && <IconSvg name="status/success" boxSize="14px" color="green.500" ml={ 1 } flexShrink={ 0 }/> }
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
        const shouldHighlightHash = ADDRESS_REGEXP.test(searchTerm);
        const addressName = data.name || data.ens_info?.name;
        const address = {
          hash: data.address,
          is_contract: data.type === 'contract',
          is_verified: data.is_smart_contract_verified,
          name: null,
          implementations: null,
          ens_domain_name: null,
        };
        const expiresText = data.ens_info?.expiry_date ? ` (expires ${ dayjs(data.ens_info.expiry_date).fromNow() })` : '';

        return (
          <>
            <Td fontSize="sm" colSpan={ addressName ? 1 : 3 }>
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
            { addressName && (
              <Td colSpan={ 2 } fontSize="sm" verticalAlign="middle">
                <Flex alignItems="center">
                  <Text
                    overflow="hidden"
                    whiteSpace="nowrap"
                    textOverflow="ellipsis"
                  >
                    <span dangerouslySetInnerHTML={{ __html: shouldHighlightHash ? xss(addressName) : highlightText(addressName, searchTerm) }}/>
                    { data.ens_info && (
                      data.ens_info.names_count > 1 ? (
                        <chakra.span color="text_secondary">
                          { data.ens_info.names_count > 39 ? '40+' : `+${ data.ens_info.names_count - 1 }` }
                        </chakra.span>
                      ) :
                        <chakra.span color="text_secondary">{ expiresText }</chakra.span>
                    ) }
                  </Text>
                  { data.certified && <ContractCertifiedLabel iconSize={ 5 } boxSize={ 5 } mx={ 1 }/> }
                </Flex>
              </Td>
            ) }
          </>
        );
      }

      case 'label': {
        return (
          <>
            <Td fontSize="sm">
              <Flex alignItems="center">
                <IconSvg name="publictags_slim" boxSize={ 6 } mr={ 2 } color="gray.500"/>
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
                { data.is_smart_contract_verified && <IconSvg name="status/success" boxSize="14px" color="green.500" ml={ 1 } flexShrink={ 0 }/> }
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
        const isFutureBlock = data.timestamp === undefined && !isLoading;
        const href = isFutureBlock ?
          route({ pathname: '/block/countdown/[height]', query: { height: String(data.block_number) } }) :
          route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: data.block_hash ?? String(data.block_number) } });

        return (
          <>
            <Td fontSize="sm">
              <BlockEntity.Container>
                <BlockEntity.Icon isLoading={ isLoading }/>
                <BlockEntity.Link
                  href={ href }
                  onClick={ handleLinkClick }
                  isLoading={ isLoading }
                >
                  <BlockEntity.Content
                    asProp={ shouldHighlightHash ? 'span' : 'mark' }
                    number={ Number(data.block_number) }
                    fontSize="sm"
                    lineHeight={ 5 }
                    fontWeight={ 700 }
                    isLoading={ isLoading }
                  />
                </BlockEntity.Link>
              </BlockEntity.Container>
            </Td>
            <Td fontSize="sm" verticalAlign="middle" colSpan={ isFutureBlock ? 2 : 1 }>
              { isFutureBlock ? (
                <Skeleton isLoaded={ !isLoading }>Learn estimated time for this block to be created.</Skeleton>
              ) : (
                <Flex columnGap={ 2 } alignItems="center">
                  { data.block_type === 'reorg' && !isLoading && <Tag flexShrink={ 0 }>Reorg</Tag> }
                  { data.block_type === 'uncle' && !isLoading && <Tag flexShrink={ 0 }>Uncle</Tag> }
                  <Skeleton isLoaded={ !isLoading } overflow="hidden" whiteSpace="nowrap" as={ shouldHighlightHash ? 'mark' : 'span' } display="block">
                    <HashStringShortenDynamic hash={ data.block_hash }/>
                  </Skeleton>
                </Flex>
              ) }
            </Td>
            { !isFutureBlock && (
              <Td fontSize="sm" verticalAlign="middle" isNumeric>
                <Skeleton isLoaded={ !isLoading } color="text_secondary">
                  <span>{ dayjs(data.timestamp).format('llll') }</span>
                </Skeleton>
              </Td>
            ) }
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

      case 'blob': {
        return (
          <Td colSpan={ 3 } fontSize="sm">
            <BlobEntity.Container>
              <BlobEntity.Icon/>
              <BlobEntity.Link
                isLoading={ isLoading }
                hash={ data.blob_hash }
                onClick={ handleLinkClick }
              >
                <BlobEntity.Content
                  asProp="mark"
                  hash={ data.blob_hash }
                  fontSize="sm"
                  lineHeight={ 5 }
                  fontWeight={ 700 }
                />
              </BlobEntity.Link>
            </BlobEntity.Container>
          </Td>
        );
      }

      case 'user_operation': {
        return (
          <>
            <Td colSpan={ 2 } fontSize="sm">
              <UserOpEntity.Container>
                <UserOpEntity.Icon/>
                <UserOpEntity.Link
                  isLoading={ isLoading }
                  hash={ data.user_operation_hash }
                  onClick={ handleLinkClick }
                >
                  <UserOpEntity.Content
                    asProp="mark"
                    hash={ data.user_operation_hash }
                    fontSize="sm"
                    lineHeight={ 5 }
                    fontWeight={ 700 }
                  />
                </UserOpEntity.Link>
              </UserOpEntity.Container>
            </Td>
            <Td fontSize="sm" verticalAlign="middle" isNumeric>
              <Text variant="secondary">{ dayjs(data.timestamp).format('llll') }</Text>
            </Td>
          </>
        );
      }

      case 'ens_domain': {
        const expiresText = data.ens_info?.expiry_date ? ` expires ${ dayjs(data.ens_info.expiry_date).fromNow() }` : '';
        return (
          <>
            <Td fontSize="sm">
              <EnsEntity.Container>
                <EnsEntity.Icon/>
                <LinkInternal
                  href={ route({ pathname: '/address/[hash]', query: { hash: data.address } }) }
                  fontWeight={ 700 }
                  wordBreak="break-all"
                  isLoading={ isLoading }
                  onClick={ handleLinkClick }
                  overflow="hidden"
                >
                  <Skeleton
                    isLoaded={ !isLoading }
                    dangerouslySetInnerHTML={{ __html: highlightText(data.ens_info.name, searchTerm) }}
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                  />
                </LinkInternal>
              </EnsEntity.Container>
            </Td>
            <Td>
              <Flex alignItems="center" overflow="hidden">
                <Box overflow="hidden" whiteSpace="nowrap" w={ data.is_smart_contract_verified ? 'calc(100%-28px)' : 'unset' }>
                  <HashStringShortenDynamic hash={ data.address }/>
                </Box>
                { data.is_smart_contract_verified && <IconSvg name="status/success" boxSize="14px" color="green.500" ml={ 1 } flexShrink={ 0 }/> }
              </Flex>
            </Td>
            <Td>
              { data.ens_info.names_count > 1 ?
                <chakra.span color="text_secondary"> ({ data.ens_info.names_count > 39 ? '40+' : `+${ data.ens_info.names_count - 1 }` })</chakra.span> :
                <chakra.span color="text_secondary">{ expiresText }</chakra.span> }
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
