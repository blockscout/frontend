import { chakra, Flex, Grid, Image, Box, Text, Skeleton, useColorMode, Tag } from '@chakra-ui/react';
import React from 'react';
import xss from 'xss';

import type { SearchResultItem } from 'types/api/search';

import { route } from 'nextjs-routes';

import dayjs from 'lib/date/dayjs';
import highlightText from 'lib/highlightText';
import * as mixpanel from 'lib/mixpanel/index';
import { saveToRecentKeywords } from 'lib/recentSearchKeywords';
import { ADDRESS_REGEXP } from 'lib/validations/address';
import * as AddressEntity from 'ui/shared/entities/address/AddressEntity';
import * as BlockEntity from 'ui/shared/entities/block/BlockEntity';
import * as TokenEntity from 'ui/shared/entities/token/TokenEntity';
import * as TxEntity from 'ui/shared/entities/tx/TxEntity';
import * as UserOpEntity from 'ui/shared/entities/userOp/UserOpEntity';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import IconSvg from 'ui/shared/IconSvg';
import LinkExternal from 'ui/shared/LinkExternal';
import LinkInternal from 'ui/shared/LinkInternal';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import type { SearchResultAppItem } from 'ui/shared/search/utils';
import { getItemCategory, searchItemTitles } from 'ui/shared/search/utils';

interface Props {
  data: SearchResultItem | SearchResultAppItem;
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
            { data.is_verified_via_admin_panel && <IconSvg name="verified_token" boxSize={ 4 } ml={ 1 } color="green.500"/> }
          </Flex>
        );
      }

      case 'contract':
      case 'address': {
        const shouldHighlightHash = ADDRESS_REGEXP.test(searchTerm);
        const address = {
          hash: data.address,
          is_contract: data.type === 'contract',
          is_verified: data.is_smart_contract_verified,
          name: null,
          implementation_name: null,
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
                address={ address }
                fontSize="sm"
                lineHeight={ 5 }
                fontWeight={ 700 }
              />
            </AddressEntity.Link>
            <AddressEntity.Copy address={ address }/>
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
        return (
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
                fontWeight={ 700 }
              />
            </BlockEntity.Link>
            { data.block_type === 'reorg' && <Tag ml={ 2 }>Reorg</Tag> }
            { data.block_type === 'uncle' && <Tag ml={ 2 }>Uncle</Tag> }
          </BlockEntity.Container>
        );
      }

      case 'transaction': {
        return (
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
    }
  })();

  const secondRow = (() => {
    switch (data.type) {
      case 'token': {
        const templateCols = `1fr
        ${ (data.token_type === 'ERC-20' && data.exchange_rate) || (data.token_type !== 'ERC-20' && data.total_supply) ? ' auto' : '' }`;

        return (
          <Grid templateColumns={ templateCols } alignItems="center" gap={ 2 }>
            <Skeleton isLoaded={ !isLoading } overflow="hidden" display="flex" alignItems="center">
              <Text whiteSpace="nowrap" overflow="hidden">
                <HashStringShortenDynamic hash={ data.address } isTooltipDisabled/>
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
        return (
          <>
            <Box as={ shouldHighlightHash ? 'mark' : 'span' } display="block" whiteSpace="nowrap" overflow="hidden" mb={ 1 }>
              <HashStringShortenDynamic hash={ data.block_hash }/>
            </Box>
            <Text variant="secondary" mr={ 2 }>{ dayjs(data.timestamp).format('llll') }</Text>
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
        return (
          <Flex alignItems="center">
            <Box overflow="hidden">
              <HashStringShortenDynamic hash={ data.address }/>
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
            sx={{
              display: '-webkit-box',
              '-webkit-box-orient': 'vertical',
              '-webkit-line-clamp': '3',
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
          <>
            <span dangerouslySetInnerHTML={{ __html: shouldHighlightHash ? xss(addressName) : highlightText(addressName, searchTerm) }}/>
            { data.ens_info &&
              (
                data.ens_info.names_count > 1 ?
                  <chakra.span color="text_secondary"> ({ data.ens_info.names_count > 39 ? '40+' : `+${ data.ens_info.names_count - 1 }` })</chakra.span> :
                  <chakra.span color="text_secondary">{ expiresText }</chakra.span>
              )
            }
          </>
        ) :
          null;
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
