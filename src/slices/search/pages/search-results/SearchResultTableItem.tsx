// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra, Text, Flex, Box } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';
import xss from 'xss';

import type { AddressFormat } from 'src/slices/address/types/config';
import type { SearchResultItem } from 'src/slices/search/types/client';

import * as AddressEntity from 'src/slices/address/components/entity/AddressEntity';
import { toBech32Address } from 'src/slices/address/utils/bech32';
import { toAddressModel } from 'src/slices/address/utils/model';
import * as BlockEntity from 'src/slices/block/components/entity/BlockEntity';
import ContractCertifiedLabel from 'src/slices/contract/components/ContractCertifiedLabel';
import { saveToRecentKeywords } from 'src/slices/search/utils/recent-search-keywords';
import type { SearchResultAppItem } from 'src/slices/search/utils/search-categories';
import { getItemCategory, getSearchCategories } from 'src/slices/search/utils/search-categories';
import * as TokenEntity from 'src/slices/token/components/entity/TokenEntity';
import * as TxEntity from 'src/slices/tx/components/entity/TxEntity';

import * as TacOperationEntity from 'src/features/chain-variants/tac/components/TacOperationEntity';
import TacOperationStatus from 'src/features/chain-variants/tac/components/TacOperationStatus';
import * as BlobEntity from 'src/features/data-availability/components/entity/BlobEntity';
import * as EnsEntity from 'src/features/name-services/domains/components/EnsEntity';
import * as UserOpEntity from 'src/features/user-ops/components/entity/UserOpEntity';

import * as mixpanel from 'src/services/mixpanel';
import dayjs from 'src/shared/date-and-time/dayjs';
import Time from 'src/shared/date-and-time/Time';
import HashStringShortenDynamic from 'src/shared/texts/HashStringShortenDynamic';
import highlightText from 'src/shared/texts/highlight-text';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { useColorMode } from 'src/toolkit/chakra/color-mode';
import { Image } from 'src/toolkit/chakra/image';
import { Link } from 'src/toolkit/chakra/link';
import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'src/toolkit/chakra/table';
import { Tag } from 'src/toolkit/chakra/tag';
import { SECOND } from 'src/toolkit/utils/consts';
import { ADDRESS_REGEXP } from 'src/toolkit/utils/regexp';

import SearchResultMetadataTag from './SearchResultMetadataTag';

interface Props {
  data: SearchResultItem | SearchResultAppItem;
  searchTerm: string;
  isLoading?: boolean;
  addressFormat?: AddressFormat;
}

const SearchResultTableItem = ({ data, searchTerm, isLoading, addressFormat }: Props) => {

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
        const hash = data.filecoin_robust_address || (addressFormat === 'bech32' ? toBech32Address(data.address_hash) : data.address_hash);

        return (
          <>
            <TableCell>
              <Flex alignItems="center">
                <TokenEntity.Icon token={{ ...data, type: data.token_type }} isLoading={ isLoading }/>
                <Link
                  href={ route({ pathname: '/token/[hash]', query: { hash: data.address_hash } }) }
                  fontWeight={ 700 }
                  wordBreak="break-all"
                  overflow="hidden"
                  loading={ isLoading }
                  onClick={ handleLinkClick }
                >
                  <Skeleton
                    loading={ isLoading }
                    overflow="hidden"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                    dangerouslySetInnerHTML={{ __html: highlightText(name, searchTerm) }}
                  />
                </Link>
                { data.certified && <ContractCertifiedLabel iconSize={ 4 } boxSize={ 4 } ml={ 1 }/> }
                { data.is_verified_via_admin_panel && !data.certified && <SpriteIcon name="certified" boxSize={ 4 } ml={ 1 } color="green.500"/> }
                { data.reputation && <TokenEntity.Reputation value={ data.reputation }/> }
              </Flex>
            </TableCell>
            <TableCell verticalAlign="middle">
              <Skeleton loading={ isLoading } whiteSpace="nowrap" overflow="hidden" display="flex" alignItems="center">
                <Box overflow="hidden" whiteSpace="nowrap" w={ data.is_smart_contract_verified ? 'calc(100%-28px)' : 'unset' }>
                  <HashStringShortenDynamic hash={ hash }/>
                </Box>
                { data.is_smart_contract_verified && <SpriteIcon name="status/success" boxSize="14px" color="green.500" ml={ 1 } flexShrink={ 0 }/> }
              </Skeleton>
            </TableCell>
            <TableCell verticalAlign="middle" isNumeric>
              <Skeleton loading={ isLoading } whiteSpace="nowrap" overflow="hidden">
                <Text overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis" fontWeight={ 700 }>
                  { data.token_type === 'ERC-20' && data.exchange_rate && `$${ Number(data.exchange_rate).toLocaleString() }` }
                  { data.token_type !== 'ERC-20' && data.total_supply && `Items ${ Number(data.total_supply).toLocaleString() }` }
                </Text>
              </Skeleton>
            </TableCell>
          </>
        );
      }

      case 'metadata_tag':
      case 'contract':
      case 'address': {
        const shouldHighlightHash = ADDRESS_REGEXP.test(searchTerm);
        const addressName = data.name || data.ens_info?.name;
        const address = toAddressModel({
          hash: data.address_hash,
          filecoin: {
            robust: data.filecoin_robust_address ?? null,
            actor_type: null,
            id: null,
          },
          is_contract: data.type === 'contract' || data.is_smart_contract_address,
          is_verified: data.is_smart_contract_verified,
        });
        const expiresText = data.ens_info?.expiry_date ? ` (expires ${ dayjs(data.ens_info.expiry_date).fromNow() })` : '';
        const hash = addressFormat === 'bech32' ? toBech32Address(data.address_hash) : data.address_hash;

        return (
          <>
            <TableCell colSpan={ (addressName || data.type === 'metadata_tag') ? 1 : 3 } verticalAlign="middle">
              <AddressEntity.Container>
                <AddressEntity.Icon address={ address }/>
                <AddressEntity.Link
                  address={ address }
                  onClick={ handleLinkClick }
                >
                  <AddressEntity.Content
                    asProp={ shouldHighlightHash ? 'mark' : 'span' }
                    address={{ ...address, hash }}
                    textStyle="sm"
                    fontWeight={ 700 }
                  />
                </AddressEntity.Link>
                <AddressEntity.Copy address={{ ...address, hash }}/>
              </AddressEntity.Container>
            </TableCell>
            { addressName && (
              <TableCell colSpan={ data.type === 'metadata_tag' ? 1 : 2 } verticalAlign="middle">
                <Flex alignItems="center">
                  <Text
                    overflow="hidden"
                    whiteSpace="nowrap"
                    textOverflow="ellipsis"
                  >
                    <span dangerouslySetInnerHTML={{ __html: shouldHighlightHash ? xss(addressName) : highlightText(addressName, searchTerm) }}/>
                    { data.ens_info && (
                      data.ens_info.names_count > 1 ? (
                        <chakra.span color="text.secondary">
                          { data.ens_info.names_count > 39 ? '40+' : `+${ data.ens_info.names_count - 1 }` }
                        </chakra.span>
                      ) :
                        <chakra.span color="text.secondary">{ expiresText }</chakra.span>
                    ) }
                  </Text>
                  { data.certified && <ContractCertifiedLabel iconSize={ 4 } boxSize={ 4 } mx={ 1 }/> }
                </Flex>
              </TableCell>
            ) }
            { data.type === 'metadata_tag' && (
              <TableCell colSpan={ addressName ? 1 : 2 } verticalAlign="middle" textAlign="right">
                <SearchResultMetadataTag metadata={ data.metadata } addressHash={ hash } searchTerm={ searchTerm }/>
              </TableCell>
            ) }
          </>
        );
      }

      case 'label': {
        const hash = data.filecoin_robust_address || (addressFormat === 'bech32' ? toBech32Address(data.address_hash) : data.address_hash);

        return (
          <>
            <TableCell>
              <Flex alignItems="center">
                <SpriteIcon name="publictags" boxSize={ 6 } mr={ 2 } color="icon.primary"/>
                <Link
                  href={ route({ pathname: '/address/[hash]', query: { hash: data.address_hash } }) }
                  fontWeight={ 700 }
                  wordBreak="break-all"
                  loading={ isLoading }
                  onClick={ handleLinkClick }
                >
                  <span dangerouslySetInnerHTML={{ __html: highlightText(data.name, searchTerm) }}/>
                </Link>
              </Flex>
            </TableCell>
            <TableCell verticalAlign="middle">
              <Flex alignItems="center" overflow="hidden">
                <Box overflow="hidden" whiteSpace="nowrap" w={ data.is_smart_contract_verified ? 'calc(100%-28px)' : 'unset' }>
                  <HashStringShortenDynamic hash={ hash }/>
                </Box>
                { data.is_smart_contract_verified && <SpriteIcon name="status/success" boxSize="14px" color="green.500" ml={ 1 } flexShrink={ 0 }/> }
              </Flex>
            </TableCell>
            <TableCell/>
          </>
        );
      }

      case 'app': {
        const title = <span dangerouslySetInnerHTML={{ __html: highlightText(data.app.title, searchTerm) }}/>;
        return (
          <>
            <TableCell>
              <Flex alignItems="center">
                <Image
                  borderRadius="base"
                  boxSize={ 6 }
                  mr={ 2 }
                  src={ colorMode === 'dark' && data.app.logoDarkMode ? data.app.logoDarkMode : data.app.logo }
                  alt={ `${ data.app.title } app icon` }
                />
                <Link
                  href={ route({ pathname: '/apps/[id]/info', query: { id: data.app.id } }) }
                  fontWeight={ 700 }
                  wordBreak="break-all"
                  loading={ isLoading }
                  onClick={ handleLinkClick }
                >
                  { title }
                </Link>
              </Flex>
            </TableCell>
            <TableCell verticalAlign="middle" colSpan={ 2 }>
              <Text
                overflow="hidden"
                whiteSpace="nowrap"
                textOverflow="ellipsis"
              >
                { data.app.description }
              </Text>
            </TableCell>
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
            <TableCell>
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
                    textStyle="sm"
                    fontWeight={ 700 }
                    isLoading={ isLoading }
                  />
                </BlockEntity.Link>
              </BlockEntity.Container>
            </TableCell>
            <TableCell fontSize="sm" verticalAlign="middle" colSpan={ isFutureBlock ? 2 : 1 }>
              { isFutureBlock ? (
                <Skeleton loading={ isLoading }>Learn estimated time for this block to be created.</Skeleton>
              ) : (
                <Flex columnGap={ 2 } alignItems="center">
                  { data.block_type === 'reorg' && !isLoading && <Tag flexShrink={ 0 }>Reorg</Tag> }
                  { data.block_type === 'uncle' && !isLoading && <Tag flexShrink={ 0 }>Uncle</Tag> }
                  <Skeleton loading={ isLoading } overflow="hidden" whiteSpace="nowrap" display="block">
                    <HashStringShortenDynamic hash={ data.block_hash } as={ shouldHighlightHash ? 'mark' : 'span' }/>
                  </Skeleton>
                </Flex>
              ) }
            </TableCell>
            { !isFutureBlock && data.timestamp && (
              <TableCell fontSize="sm" verticalAlign="middle" isNumeric>
                <Skeleton loading={ isLoading } color="text.secondary">
                  <Time timestamp={ data.timestamp } format="lll_s"/>
                </Skeleton>
              </TableCell>
            ) }
          </>
        );
      }

      case 'transaction': {
        return (
          <>
            <TableCell colSpan={ 2 } fontSize="sm">
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
                    textStyle="sm"
                    fontWeight={ 700 }
                  />
                </TxEntity.Link>
              </TxEntity.Container>
            </TableCell>
            <TableCell fontSize="sm" verticalAlign="middle" isNumeric>
              <Time timestamp={ data.timestamp } color="text.secondary" format="lll_s"/>
            </TableCell>
          </>
        );
      }

      case 'zetaChainCCTX': {
        return (
          <>
            <TableCell colSpan={ 2 } fontSize="sm">
              <TxEntity.Container>
                <SpriteIcon name="interop" boxSize={ 5 } marginRight={ 1 } color="text.secondary"/>
                <TxEntity.Link
                  isLoading={ isLoading }
                  hash={ data.cctx.index }
                  href={ route({ pathname: '/cc/tx/[hash]', query: { hash: data.cctx.index } }) }
                  onClick={ handleLinkClick }
                >
                  <TxEntity.Content
                    asProp={ data.cctx.index === searchTerm ? 'mark' : 'span' }
                    hash={ data.cctx.index }
                    textStyle="sm"
                    fontWeight={ 700 }
                  />
                </TxEntity.Link>
              </TxEntity.Container>
            </TableCell>
            <TableCell fontSize="sm" verticalAlign="middle" isNumeric>
              <Time timestamp={ Number(data.cctx.last_update_timestamp) * SECOND } color="text.secondary" format="lll_s"/>
            </TableCell>
          </>
        );
      }

      case 'tac_operation': {
        return (
          <>
            <TableCell colSpan={ 2 } fontSize="sm">
              <TacOperationEntity.Container>
                <TacOperationEntity.Icon type={ data.tac_operation.type }/>
                <TacOperationEntity.Link
                  isLoading={ isLoading }
                  id={ data.tac_operation.operation_id }
                  onClick={ handleLinkClick }
                >
                  <TacOperationEntity.Content
                    asProp="mark"
                    id={ data.tac_operation.operation_id }
                    textStyle="sm"
                    fontWeight={ 700 }
                    mr={ 2 }
                  />
                </TacOperationEntity.Link>
                <TacOperationStatus status={ data.tac_operation.type }/>
              </TacOperationEntity.Container>
            </TableCell>
            <TableCell fontSize="sm" verticalAlign="middle" isNumeric>
              <Time timestamp={ data.tac_operation.timestamp } color="text.secondary" format="lll_s"/>
            </TableCell>
          </>
        );
      }

      case 'blob': {
        return (
          <TableCell colSpan={ 3 } fontSize="sm">
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
                  textStyle="sm"
                  fontWeight={ 700 }
                />
              </BlobEntity.Link>
            </BlobEntity.Container>
          </TableCell>
        );
      }

      case 'user_operation': {
        return (
          <>
            <TableCell colSpan={ 2 } fontSize="sm">
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
                    textStyle="sm"
                    fontWeight={ 700 }
                  />
                </UserOpEntity.Link>
              </UserOpEntity.Container>
            </TableCell>
            <TableCell fontSize="sm" verticalAlign="middle" isNumeric>
              <Time timestamp={ data.timestamp } color="text.secondary" format="lll_s"/>
            </TableCell>
          </>
        );
      }

      case 'ens_domain': {
        const expiresText = data.ens_info?.expiry_date ? ` expires ${ dayjs(data.ens_info.expiry_date).fromNow() }` : '';
        const hash = data.filecoin_robust_address || (addressFormat === 'bech32' && data.address_hash ? toBech32Address(data.address_hash) : data.address_hash);

        return (
          <>
            <TableCell fontSize="sm">
              <EnsEntity.Container>
                <EnsEntity.Icon
                  protocol={ data.ens_info.protocol }
                  protocolDapp={{
                    url: data.ens_info.protocol_dapp_url,
                    logo: data.ens_info.protocol_dapp_logo,
                  }}/>
                <Link
                  href={ data.address_hash ?
                    route({ pathname: '/address/[hash]', query: { hash: data.address_hash } }) :
                    route({ pathname: '/name-services/domains/[name]', query: { name: data.ens_info.name } })
                  }
                  fontWeight={ 700 }
                  wordBreak="break-all"
                  loading={ isLoading }
                  onClick={ handleLinkClick }
                  overflow="hidden"
                >
                  <Skeleton
                    loading={ isLoading }
                    dangerouslySetInnerHTML={{ __html: highlightText(data.ens_info.name, searchTerm) }}
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                  />
                </Link>
              </EnsEntity.Container>
            </TableCell>
            <TableCell>
              <Flex alignItems="center" overflow="hidden">
                { hash && (
                  <Box overflow="hidden" whiteSpace="nowrap" w={ data.is_smart_contract_verified ? 'calc(100%-28px)' : 'unset' }>
                    <HashStringShortenDynamic hash={ hash }/>
                  </Box>
                ) }
                { data.is_smart_contract_verified && <SpriteIcon name="status/success" boxSize="14px" color="green.500" ml={ 1 } flexShrink={ 0 }/> }
              </Flex>
            </TableCell>
            <TableCell>
              { data.ens_info.names_count > 1 ?
                <chakra.span color="text.secondary"> ({ data.ens_info.names_count > 39 ? '40+' : `+${ data.ens_info.names_count - 1 }` })</chakra.span> :
                <chakra.span color="text.secondary">{ expiresText }</chakra.span> }
            </TableCell>
          </>
        );
      }
    }
  })();

  const category = React.useMemo(() => getItemCategory(data), [ data ]);
  const searchCategories = React.useMemo(() => getSearchCategories(), []);

  return (
    <TableRow>
      { content }
      <TableCell fontSize="sm" textTransform="capitalize" verticalAlign="middle">
        <Skeleton loading={ isLoading } color="text.secondary" display="inline-block">
          <span>{ category ? searchCategories.find(({ id }) => id === category)?.itemTitle : '' }</span>
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(SearchResultTableItem);
