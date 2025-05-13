import BigNumber from 'bignumber.js';
import React from 'react';

import type { TokenHolder, TokenInfo } from 'types/api/token';

import { Skeleton } from 'toolkit/chakra/skeleton';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';
import Utilization from 'ui/shared/Utilization/Utilization';

interface Props {
  holder: TokenHolder;
  token: TokenInfo;
  isLoading?: boolean;
}

const TokenHoldersListItem = ({ holder, token, isLoading }: Props) => {
  const quantity = BigNumber(holder.value).div(BigNumber(10 ** Number(token.decimals))).dp(6).toFormat();

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

      { (token.type === 'ERC-1155' || token.type === 'ERC-404') && 'token_id' in holder && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>ID#</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <Skeleton loading={ isLoading } display="inline-block">
              { holder.token_id }
            </Skeleton>
          </ListItemMobileGrid.Value>
        </>
      ) }

      <ListItemMobileGrid.Label isLoading={ isLoading }>Quantity</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton loading={ isLoading } display="inline-block">
          { quantity }
        </Skeleton>
      </ListItemMobileGrid.Value>

      { token.total_supply && token.type !== 'ERC-404' && (
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
