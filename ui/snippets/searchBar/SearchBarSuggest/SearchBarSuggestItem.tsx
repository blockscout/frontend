import type { LinkProps as NextLinkProps } from 'next/link';
import NextLink from 'next/link';
import React from 'react';

import type { SearchResultItem } from 'types/client/search';

import { route } from 'nextjs-routes';

import SearchBarSuggestAddress from './SearchBarSuggestAddress';
import SearchBarSuggestBlob from './SearchBarSuggestBlob';
import SearchBarSuggestBlock from './SearchBarSuggestBlock';
import SearchBarSuggestBucket from './SearchBarSuggestBucket';
import SearchBarSuggestDomain from './SearchBarSuggestDomain';
import SearchBarSuggestGroup from './SearchBarSuggestGroup';
import SearchBarSuggestItemLink from './SearchBarSuggestItemLink';
import SearchBarSuggestLabel from './SearchBarSuggestLabel';
import SearchBarSuggestObject from './SearchBarSuggestObject';
import SearchBarSuggestToken from './SearchBarSuggestToken';
import SearchBarSuggestTx from './SearchBarSuggestTx';
import SearchBarSuggestUserOp from './SearchBarSuggestUserOp';

interface Props {
  data: SearchResultItem;
  isMobile: boolean | undefined;
  searchTerm: string;
  onClick: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  isFirst?: boolean;
}

const SearchBarSuggestItem = ({ data, isMobile, searchTerm, onClick, isFirst }: Props) => {
  if (data.type === 'transaction') {
    if (data['transaction_hash']) {
      data.tx_hash = data['transaction_hash'];
    }
  }

  const url = (() => {
    switch (data.type) {
      case 'token': {
        return route({ pathname: '/token/[hash]', query: { hash: data.address } });
      }
      case 'contract':
      case 'address':
      case 'label': {
        return route({ pathname: '/address/[hash]', query: { hash: data.address } });
      }
      case 'transaction': {
        return route({ pathname: '/tx/[hash]', query: { hash: data.transaction_hash } });
      }
      case 'block': {
        const isFutureBlock = data.timestamp === undefined;
        if (isFutureBlock) {
          return route({ pathname: '/block/countdown/[height]', query: { height: String(data.block_number) } });
        }

        return route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: String(data.block_hash) } });
      }
      case 'user_operation': {
        return route({ pathname: '/op/[hash]', query: { hash: data.user_operation_hash } });
      }
      case 'blob': {
        return route({ pathname: '/blobs/[hash]', query: { hash: data.blob_hash } });
      }
      case 'ens_domain': {
        return route({ pathname: '/address/[hash]', query: { hash: data.address } });
      }
      case 'buckets': {
        return route({ pathname: '/bucket-details/[address]', query: { address: data.bucket_id } });
      }
      case 'objects': {
        return route({ pathname: '/object-details/[address]', query: { address: data.object_id } });
      }
      case 'groups': {
        return route({ pathname: '/group-details/[address]', query: { address: data.group_id } });
      }
    }
  })();

  const content = (() => {
    switch (data.type) {
      case 'token': {
        return (
          <SearchBarSuggestToken
            data={ data }
            searchTerm={ searchTerm }
            isMobile={ isMobile }
          />
        );
      }
      case 'contract':
      case 'address': {
        return <SearchBarSuggestAddress data={ data } searchTerm={ searchTerm } isMobile={ isMobile } isFirst={ isFirst }/>;
      }
      case 'label': {
        return (
          <SearchBarSuggestLabel
            data={ data }
            searchTerm={ searchTerm }
            isMobile={ isMobile }
          />
        );
      }
      case 'block': {
        return <SearchBarSuggestBlock data={ data } searchTerm={ searchTerm } isMobile={ isMobile } isFirst={ isFirst }/>;
      }
      case 'transaction': {
        return <SearchBarSuggestTx data={ data } searchTerm={ searchTerm } isMobile={ isMobile } isFirst={ isFirst }/>;
      }
      case 'user_operation': {
        return <SearchBarSuggestUserOp data={ data } searchTerm={ searchTerm } isMobile={ isMobile }/>;
      }
      case 'blob': {
        return <SearchBarSuggestBlob data={ data } searchTerm={ searchTerm }/>;
      }
      case 'ens_domain': {
        return <SearchBarSuggestDomain data={ data } searchTerm={ searchTerm } isMobile={ isMobile }/>;
      }
      case 'buckets': {
        return <SearchBarSuggestBucket data={ data } searchTerm={ searchTerm } isFirst={ isFirst }></SearchBarSuggestBucket>;
      }
      case 'objects': {
        return <SearchBarSuggestObject data={ data } searchTerm={ searchTerm } isFirst={ isFirst }></SearchBarSuggestObject>;
      }
      case 'groups': {
        return <SearchBarSuggestGroup data={ data } searchTerm={ searchTerm } isFirst={ isFirst }></SearchBarSuggestGroup>;
      }
    }
  })();

  return (
    <NextLink href={ url as NextLinkProps['href'] } passHref legacyBehavior>
      <SearchBarSuggestItemLink onClick={ onClick } isFirst={ isFirst }>
        { content }
      </SearchBarSuggestItemLink>
    </NextLink>
  );
};

export default React.memo(SearchBarSuggestItem);
