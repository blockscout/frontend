// SPDX-License-Identifier: LicenseRef-Blockscout

import { HStack } from '@chakra-ui/react';
import React from 'react';

import type { PaginationParams } from 'src/shared/pagination/types';
import type { NftTokenType, TokenType } from 'src/slices/token/types/api';

import AddressFungibleTokensFilter from 'src/slices/token/pages/address/fungible/AddressFungibleTokensFilter';
import AddressNftDisplayTypeRadio from 'src/slices/token/pages/address/nfts/AddressNftDisplayTypeRadio';
import AddressNftTypeFilter from 'src/slices/token/pages/address/nfts/AddressNftTypeFilter';
import type { TNftDisplayType } from 'src/slices/token/pages/address/useAddressNftQuery';

import Pagination from 'src/shared/pagination/Pagination';

interface Props {
  isNftTab: boolean;
  isMobile: boolean;
  pagination: PaginationParams;
  hasNftControls: boolean;
  nftDisplayType: TNftDisplayType;
  onNftDisplayTypeChange: (value: string) => void;
  nftTokenTypes: Array<NftTokenType> | undefined;
  onNftTokenTypesChange: (value: Array<NftTokenType>) => void;
  hasFungibleTokenFilter: boolean;
  fungibleTokenTypes: Array<TokenType> | undefined;
  onFungibleTokenTypesChange: (value: Array<TokenType>) => void;
}

const AddressTokensRightSlot = ({
  isNftTab,
  isMobile,
  pagination,
  hasNftControls,
  nftDisplayType,
  onNftDisplayTypeChange,
  nftTokenTypes,
  onNftTokenTypesChange,
  hasFungibleTokenFilter,
  fungibleTokenTypes,
  onFungibleTokenTypesChange,
}: Props) => {
  const showsNftControls = isNftTab && hasNftControls;
  const showsNftTypeFilter = showsNftControls && !(isMobile && pagination.isVisible);

  return (
    <>
      <HStack gap={ 3 }>
        { showsNftControls && <AddressNftDisplayTypeRadio value={ nftDisplayType } onChange={ onNftDisplayTypeChange }/> }
        { showsNftTypeFilter && <AddressNftTypeFilter value={ nftTokenTypes } onChange={ onNftTokenTypesChange }/> }
        { hasFungibleTokenFilter && <AddressFungibleTokensFilter value={ fungibleTokenTypes } onChange={ onFungibleTokenTypesChange }/> }
      </HStack>
      { pagination.isVisible && !isMobile && <Pagination { ...pagination }/> }
    </>
  );
};

export default React.memo(AddressTokensRightSlot);
