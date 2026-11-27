// SPDX-License-Identifier: LicenseRef-Blockscout

import { HStack } from '@chakra-ui/react';
import React from 'react';

import type { PaginationParams } from 'src/shared/pagination/types';
import type { NftTokenType } from 'src/slices/token/types/api';

import ActionBar from 'src/shell/page/action-bar/ActionBar';

import { useMultichainContext } from 'src/features/multichain/context';

import useIsMobile from 'src/shared/hooks/useIsMobile';
import Pagination from 'src/shared/pagination/Pagination';

import type { TNftDisplayType } from '../useAddressNftQuery';
import AddressNftDisplayTypeRadio from './AddressNftDisplayTypeRadio';
import AddressNftTypeFilter from './AddressNftTypeFilter';

export interface NftDisplayTypeSwitch {
  readonly value: TNftDisplayType;
  readonly onChange: (value: string) => void;
}

interface Props {
  tokenTypes: Array<NftTokenType> | undefined;
  onTokenTypesChange: (value: Array<NftTokenType>) => void;
  pagination: PaginationParams;
  displayTypeSwitch: NftDisplayTypeSwitch | undefined;
}

const AddressNftsActionBar = ({ tokenTypes, onTokenTypesChange, pagination, displayTypeSwitch }: Props) => {
  const isMobile = useIsMobile();
  const multichainContext = useMultichainContext();

  if (!displayTypeSwitch && !(isMobile && pagination.isVisible)) {
    return null;
  }

  return (
    <ActionBar mt={ multichainContext ? -6 : -3 }>
      <HStack gap={{ base: 3, lg: 6 }}>
        <AddressNftTypeFilter value={ tokenTypes } onChange={ onTokenTypesChange }/>
        { displayTypeSwitch && <AddressNftDisplayTypeRadio value={ displayTypeSwitch.value } onChange={ displayTypeSwitch.onChange }/> }
      </HStack>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  );
};

export default React.memo(AddressNftsActionBar);
