// SPDX-License-Identifier: LicenseRef-Blockscout

import BigNumber from 'bignumber.js';
import React from 'react';

import type { schemas } from '@blockscout/api-types';
import type { TokenHolder } from 'src/slices/token/types/api';
import { hasTokenIds, isConfidentialTokenType } from 'src/slices/token/utils/token-types';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';

import ListItemMobileGrid from 'src/shared/lists/ListItemMobileGrid';
import AssetValue from 'src/shared/values/entity/AssetValue';
import ConfidentialValue from 'src/shared/values/entity/ConfidentialValue';
import Utilization from 'src/shared/values/utilization/Utilization';

import { TruncatedText } from 'src/toolkit/components/truncation/TruncatedText';

interface Props {
  holder: TokenHolder;
  token: schemas['Token'];
  isLoading?: boolean;
}

const TokenHoldersListItem = ({ holder, token, isLoading }: Props) => {
  return (
    <ListItemMobileGrid.Container>
      <ListItemMobileGrid.Label isLoading={ isLoading }>Address</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <AddressEntity
          address={ holder.address }
          isLoading={ isLoading }
          fontWeight="700"
          maxW="100%"
        />
      </ListItemMobileGrid.Value>

      { (hasTokenIds(token.type)) && 'token_id' in holder && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>ID#</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <TruncatedText text={ holder.token_id } loading={ isLoading } w="100%"/>
          </ListItemMobileGrid.Value>
        </>
      ) }

      <ListItemMobileGrid.Label isLoading={ isLoading }>Quantity</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        { isConfidentialTokenType(token.type) ? (
          <ConfidentialValue loading={ isLoading }/>
        ) : (
          <AssetValue
            amount={ holder.value }
            decimals={ token.decimals ?? '0' }
            loading={ isLoading }
          />
        ) }
      </ListItemMobileGrid.Value>

      { token.total_supply && token.type !== 'ERC-404' && !isConfidentialTokenType(token.type) && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>Percentage</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <Utilization
              value={ BigNumber(holder.value).div(BigNumber(token.total_supply)).dp(4).toNumber() }
              colorScheme="green"
              isLoading={ isLoading }
              display="inline-flex"
            />
          </ListItemMobileGrid.Value>
        </>
      ) }

    </ListItemMobileGrid.Container>
  );
};

export default TokenHoldersListItem;
