import React from 'react';

import type { SearchResultItem } from 'types/client/search';
import type { AddressFormat } from 'types/views/address';

import { route } from 'nextjs-routes';

import SearchBarSuggestAddress from './SearchBarSuggestAddress';
import SearchBarSuggestBlob from './SearchBarSuggestBlob';
import SearchBarSuggestBlock from './SearchBarSuggestBlock';
import SearchBarSuggestDomain from './SearchBarSuggestDomain';
import SearchBarSuggestItemLink from './SearchBarSuggestItemLink';
import SearchBarSuggestLabel from './SearchBarSuggestLabel';
import SearchBarSuggestTacOperation from './SearchBarSuggestTacOperation';
import SearchBarSuggestToken from './SearchBarSuggestToken';
import SearchBarSuggestTx from './SearchBarSuggestTx';
import SearchBarSuggestUserOp from './SearchBarSuggestUserOp';

interface Props {
  data: SearchResultItem;
  isMobile: boolean | undefined;
  searchTerm: string;
  onClick: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  addressFormat?: AddressFormat;
}

const SearchBarSuggestItem = ({ data, isMobile, searchTerm, onClick, addressFormat }: Props) => {

  const url = (() => {
    switch (data.type) {
      case 'token': {
        return route({ pathname: '/token/[hash]', query: { hash: data.address_hash } });
      }
      case 'contract':
      case 'address':
      case 'label':
      case 'metadata_tag': {
        return route({ pathname: '/address/[hash]', query: { hash: data.address_hash } });
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
        return route({ pathname: '/address/[hash]', query: { hash: data.address_hash } });
      }
      case 'tac_operation': {
        return route({ pathname: '/operation/[id]', query: { id: data.tac_operation.operation_id } });
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
            addressFormat={ addressFormat }
          />
        );
      }
      case 'metadata_tag':
      case 'contract':
      case 'address': {
        return (
          <SearchBarSuggestAddress
            data={ data }
            searchTerm={ searchTerm }
            isMobile={ isMobile }
            addressFormat={ addressFormat }
          />
        );
      }
      case 'label': {
        return (
          <SearchBarSuggestLabel
            data={ data }
            searchTerm={ searchTerm }
            isMobile={ isMobile }
            addressFormat={ addressFormat }
          />
        );
      }
      case 'block': {
        return <SearchBarSuggestBlock data={ data } searchTerm={ searchTerm } isMobile={ isMobile }/>;
      }
      case 'transaction': {
        return <SearchBarSuggestTx data={ data } searchTerm={ searchTerm } isMobile={ isMobile }/>;
      }
      case 'user_operation': {
        return <SearchBarSuggestUserOp data={ data } searchTerm={ searchTerm } isMobile={ isMobile }/>;
      }
      case 'blob': {
        return <SearchBarSuggestBlob data={ data } searchTerm={ searchTerm }/>;
      }
      case 'ens_domain': {
        return <SearchBarSuggestDomain data={ data } searchTerm={ searchTerm } isMobile={ isMobile } addressFormat={ addressFormat }/>;
      }
      case 'tac_operation': {
        return <SearchBarSuggestTacOperation data={ data } searchTerm={ searchTerm } isMobile={ isMobile } addressFormat={ addressFormat }/>;
      }
    }
  })();

  return (
    <SearchBarSuggestItemLink onClick={ onClick } href={ url }>
      { content }
    </SearchBarSuggestItemLink>
  );
};

export default React.memo(SearchBarSuggestItem);
