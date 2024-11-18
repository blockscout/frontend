import { chakra, Flex, Grid, Image, Box, Text, Skeleton, useColorMode, Tag } from '@chakra-ui/react';
import React from 'react';
import xss from 'xss';

import type { SearchResultItem } from 'types/client/search';
import type { AddressFormat } from 'types/views/address';

import { route } from 'nextjs-routes';

import { toBech32Address } from 'lib/address/bech32';
import dayjs from 'lib/date/dayjs';
import highlightText from 'lib/highlightText';
import * as mixpanel from 'lib/mixpanel/index';
import { saveToRecentKeywords } from 'lib/recentSearchKeywords';
import ContractCertifiedLabel from 'ui/shared/ContractCertifiedLabel';
import * as AddressEntity from 'ui/shared/entities/address/AddressEntity';
import * as BlobEntity from 'ui/shared/entities/blob/BlobEntity';
import * as BlockEntity from 'ui/shared/entities/block/BlockEntity';
import * as EnsEntity from 'ui/shared/entities/ens/EnsEntity';
import * as TokenEntity from 'ui/shared/entities/token/TokenEntity';
import * as TxEntity from 'ui/shared/entities/tx/TxEntity';
import * as UserOpEntity from 'ui/shared/entities/userOp/UserOpEntity';
import { ADDRESS_REGEXP } from 'ui/shared/forms/validators/address';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import IconSvg from 'ui/shared/IconSvg';
import LinkExternal from 'ui/shared/links/LinkExternal';
import LinkInternal from 'ui/shared/links/LinkInternal';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import type { SearchResultAppItem } from 'ui/shared/search/utils';
import { getItemCategory, searchItemTitles } from 'ui/shared/search/utils';

interface Props {
  data: SearchResultItem | SearchResultAppItem;
  searchTerm: string;
  isLoading?: boolean;
  addressFormat?: AddressFormat;
}

const SearchResultListItem = ({ data, searchTerm, isLoading, addressFormat }: Props) => {

  const handleLinkClick = React.useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    saveToRecentKeywords(searchTerm);
    mixpanel.logEvent(mixpanel.EventTypes.SEARCH_QUERY, {
      'Search query': searchTerm,
      'Source page type': 'Search results',
      'Result URL': e.currentTarget.href,
    });
  }, [ searchTerm ]);

  const { colorMode } = useColorMode();

  const firstRow = (() => {
    switch (data.type) {
      case 'token': {
        const name = data.name + (data.symbol ? ` (${ data.symbol })` : '');

        return (
          <Flex alignItems="center" overflow="hidden">
            <TokenEntity.Icon token={{ ...data, type: data.token_type }} isLoading={ isLoading }/>
            <LinkInternal
              href={ route({ pathname: '/token/[hash]', query: { hash: data.address } }) }
              fontWeight={ 700 }
              wordBreak="break-all"
              isLoading={ isLoading }
              onClick={ handleLinkClick }
              overflow="hidden"
            >
              <Skeleton
                isLoaded={ !isLoading }
                dangerouslySetInnerHTML={{ __html: highlightText(name, searchTerm) }}
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
              />
            </LinkInternal>
            { data.is_verified_via_admin_panel && <IconSvg name="certified" boxSize={ 4 } ml={ 1 } color="green.500"/> }
          </Flex>
        );
      }

      case 'contract':
      case 'address': {
        const shouldHighlightHash = ADDRESS_REGEXP.test(searchTerm);
        const hash = addressFormat === 'bech32' ? toBech32Address(data.address) : data.address;

        const address = {
          hash: data.address,
          filecoin: {
            robust: data.filecoin_robust_address,
          },
          is_contract: data.type === 'contract',
          is_verified: data.is_smart_contract_verified,
          name: null,
          implementations: null,
          ens_domain_name: null,
        };

        return (
          <AddressEntity.Container>
            <AddressEntity.Icon address={ address }/>
            <AddressEntity.Link
              address={ address }
              onClick={ handleLinkClick }
            >
              <AddressEntity.Content
                asProp={ shouldHighlightHash ? 'mark' : 'span' }
                address={{ ...address, hash }}
                fontSize="sm"
                lineHeight={ 5 }
                fontWeight={ 700 }
              />
            </AddressEntity.Link>
            <AddressEntity.Copy address={{ ...address, hash }}/>
          </AddressEntity.Container>
        );
      }

      case 'label': {
        return (
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
        );
      }

      case 'app': {
        const title = <span dangerouslySetInnerHTML={{ __html: highlightText(data.app.title, searchTerm) }}/>;
        return (
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
        );
      }

      case 'block': {
        const shouldHighlightHash = data.block_hash.toLowerCase() === searchTerm.toLowerCase();
        const isFutureBlock = data.timestamp === undefined;
        const href = isFutureBlock ?
          route({ pathname: '/block/countdown/[height]', query: { height: String(data.block_number) } }) :
          route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: data.block_hash ?? String(data.block_number) } });

        return (
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
                fontWeight={ 700 }
                isLoading={ isLoading }
              />
            </BlockEntity.Link>
            { data.block_type === 'reorg' && !isLoading && <Tag ml={ 2 }>Reorg</Tag> }
            { data.block_type === 'uncle' && !isLoading && <Tag ml={ 2 }>Uncle</Tag> }
          </BlockEntity.Container>
        );
      }

      case 'transaction': {
        return (
          <TxEntity.Container>
            <TxEntity.Icon/>
            <TxEntity.Link
              isLoading={ isLoading }
              hash={ data.transaction_hash }
              onClick={ handleLinkClick }
            >
              <TxEntity.Content
                asProp="mark"
                hash={ data.transaction_hash }
                fontSize="sm"
                lineHeight={ 5 }
                fontWeight={ 700 }
              />
            </TxEntity.Link>
          </TxEntity.Container>
        );
      }

      case 'blob': {
        return (
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
        );
      }

      case 'user_operation': {
        return (
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
        );
      }

      case 'ens_domain': {
        return (
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
        );
      }
    }
  })();

  const secondRow = (() => {
    switch (data.type) {
      case 'token': {
        const templateCols = `1fr
        ${ (data.token_type === 'ERC-20' && data.exchange_rate) || (data.token_type !== 'ERC-20' && data.total_supply) ? ' auto' : '' }`;
        const hash = data.filecoin_robust_address || (addressFormat === 'bech32' ? toBech32Address(data.address) : data.address);

        return (
          <Grid templateColumns={ templateCols } alignItems="center" gap={ 2 }>
            <Skeleton isLoaded={ !isLoading } overflow="hidden" display="flex" alignItems="center">
              <Text whiteSpace="nowrap" overflow="hidden">
                <HashStringShortenDynamic hash={ hash } isTooltipDisabled/>
              </Text>
              { data.is_smart_contract_verified && <IconSvg name="status/success" boxSize="14px" color="green.500" ml={ 1 } flexShrink={ 0 }/> }
            </Skeleton>
            <Skeleton isLoaded={ !isLoading } overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis" fontWeight={ 700 }>
              { data.token_type === 'ERC-20' && data.exchange_rate && `$${ Number(data.exchange_rate).toLocaleString() }` }
              { data.token_type !== 'ERC-20' && data.total_supply && `Items ${ Number(data.total_supply).toLocaleString() }` }
            </Skeleton>
          </Grid>
        );
      }
      case 'block': {
        const shouldHighlightHash = data.block_hash.toLowerCase() === searchTerm.toLowerCase();
        const isFutureBlock = data.timestamp === undefined;

        if (isFutureBlock) {
          return <Skeleton isLoaded={ !isLoading }>Learn estimated time for this block to be created.</Skeleton>;
        }

        return (
          <>
            <Skeleton isLoaded={ !isLoading } as={ shouldHighlightHash ? 'mark' : 'span' } display="block" whiteSpace="nowrap" overflow="hidden" mb={ 1 }>
              <HashStringShortenDynamic hash={ data.block_hash }/>
            </Skeleton>
            <Skeleton isLoaded={ !isLoading } color="text_secondary" mr={ 2 }>
              <span>{ dayjs(data.timestamp).format('llll') }</span>
            </Skeleton>
          </>
        );
      }
      case 'transaction': {
        return (
          <Text variant="secondary">{ dayjs(data.timestamp).format('llll') }</Text>
        );
      }
      case 'user_operation': {

        return (
          <Text variant="secondary">{ dayjs(data.timestamp).format('llll') }</Text>
        );
      }
      case 'label': {
        const hash = data.filecoin_robust_address || (addressFormat === 'bech32' ? toBech32Address(data.address) : data.address);

        return (
          <Flex alignItems="center">
            <Box overflow="hidden">
              <HashStringShortenDynamic hash={ hash }/>
            </Box>
            { data.is_smart_contract_verified && <IconSvg name="status/success" boxSize="14px" color="green.500" ml={ 1 } flexShrink={ 0 }/> }
          </Flex>
        );
      }
      case 'app': {
        return (
          <Text
            overflow="hidden"
            textOverflow="ellipsis"
            style={{
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              display: '-webkit-box',
            }}
          >
            { data.app.description }
          </Text>
        );
      }
      case 'contract':
      case 'address': {
        const shouldHighlightHash = ADDRESS_REGEXP.test(searchTerm);
        const addressName = data.name || data.ens_info?.name;
        const expiresText = data.ens_info?.expiry_date ? ` (expires ${ dayjs(data.ens_info.expiry_date).fromNow() })` : '';

        return addressName ? (
          <Flex alignItems="center">
            <Text
              overflow="hidden"
              whiteSpace="nowrap"
              textOverflow="ellipsis"
            >
              <span dangerouslySetInnerHTML={{ __html: shouldHighlightHash ? xss(addressName) : highlightText(addressName, searchTerm) }}/>
              { data.ens_info && (
                data.ens_info.names_count > 1 ?
                  <chakra.span color="text_secondary"> ({ data.ens_info.names_count > 39 ? '40+' : `+${ data.ens_info.names_count - 1 }` })</chakra.span> :
                  <chakra.span color="text_secondary">{ expiresText }</chakra.span>
              ) }
            </Text>
            { data.certified && <ContractCertifiedLabel iconSize={ 5 } boxSize={ 5 } ml={ 1 }/> }
          </Flex>
        ) :
          null;
      }
      case 'ens_domain': {
        const expiresText = data.ens_info?.expiry_date ? ` expires ${ dayjs(data.ens_info.expiry_date).fromNow() }` : '';
        const hash = data.filecoin_robust_address || (addressFormat === 'bech32' ? toBech32Address(data.address) : data.address);

        return (
          <Flex alignItems="center" gap={ 3 }>
            <Box overflow="hidden">
              <HashStringShortenDynamic hash={ hash }/>
            </Box>
            {
              data.ens_info.names_count > 1 ?
                <chakra.span color="text_secondary"> ({ data.ens_info.names_count > 39 ? '40+' : `+${ data.ens_info.names_count - 1 }` })</chakra.span> :
                <chakra.span color="text_secondary">{ expiresText }</chakra.span>
            }
          </Flex>
        );
      }

      default:
        return null;
    }
  })();

  const category = getItemCategory(data);

  return (
    <ListItemMobile py={ 3 } fontSize="sm" rowGap={ 2 }>
      <Grid templateColumns="1fr auto" w="100%" overflow="hidden" lineHeight={ 6 }>
        { firstRow }
        <Skeleton isLoaded={ !isLoading } color="text_secondary" ml={ 8 } textTransform="capitalize">
          <span>{ category ? searchItemTitles[category].itemTitleShort : '' }</span>
        </Skeleton>
      </Grid>
      { Boolean(secondRow) && (
        <Box w="100%" overflow="hidden" whiteSpace={ data.type !== 'app' ? 'nowrap' : undefined }>
          { secondRow }
        </Box>
      ) }
    </ListItemMobile>
  );
};

export default SearchResultListItem;
