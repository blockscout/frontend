// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';
import type { PaginationParams } from 'src/shared/pagination/types';
import type { AddressFungibleTokensItem } from 'src/slices/token/pages/address/types';
import type { TokenType } from 'src/slices/token/types/api';

import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';

import useIsMobile from 'src/shared/hooks/useIsMobile';
import DataList from 'src/shared/lists/DataList';
import Pagination from 'src/shared/pagination/Pagination';

import { TableContainerScrollable } from 'src/toolkit/chakra/table';

import AddressPortfolioTokensTable from '../portfolio/AddressPortfolioTokensTable';
import { FUNGIBLE_TOKEN_TYPES } from '../utils';
import AddressFungibleTokensFilter from './AddressFungibleTokensFilter';

type TokenBalance = Pick<schemas['TokenBalance'], 'token' | 'value'>;

const hasToken = (item: TokenBalance): item is TokenBalance & AddressFungibleTokensItem => Boolean(item.token);

type Props = {
  items: Array<TokenBalance> | undefined;
  isLoading: boolean;
  isTransitioning?: boolean;
  pagination: PaginationParams;
  isError: boolean;
  top?: number;
  tokenTypes: Array<TokenType>;
  onTokenTypesChange: (value: Array<TokenType>) => void;
  resetKey?: string;
};

const AddressFungibleTokens = ({ items, isLoading, isTransitioning, pagination, isError, top, tokenTypes, onTokenTypesChange, resetKey }: Props) => {
  const isMobile = useIsMobile();

  const tableItems = React.useMemo(() => items?.filter(hasToken), [ items ]);

  const actionBar = isMobile && pagination.isVisible && (
    <ActionBar mt={ -3 }>
      { FUNGIBLE_TOKEN_TYPES.length > 1 && <AddressFungibleTokensFilter value={ tokenTypes } onChange={ onTokenTypesChange }/> }
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  );

  const content = tableItems ? (
    <TableContainerScrollable>
      <AddressPortfolioTokensTable
        data={ tableItems }
        top={ top ?? (pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0) }
        isLoading={ isLoading }
        resetKey={ resetKey }
        hasAddToWallet
      />
    </TableContainerScrollable>
  ) : null;

  return (
    <DataList
      isError={ isError }
      itemsNum={ items?.length }
      emptyText="There are no tokens of selected type."
      actionBar={ actionBar }
      isTransitioning={ isTransitioning }
    >
      { content }
    </DataList>
  );

};

export default AddressFungibleTokens;
