// SPDX-License-Identifier: LicenseRef-Blockscout

import { Grid, HStack } from '@chakra-ui/react';
import React from 'react';

import type { ChainInfo, StatsBridgedTokenItem, StatsBridgedTokenRow } from '@blockscout/interchain-indexer-types';

import AddressEntityInterchain from 'src/slices/address/components/entity/AddressEntityInterchain';
import TokenEntityInterchain from 'src/slices/token/components/entity/TokenEntityInterchain';
import { toTokenModel } from 'src/slices/token/utils/model';

import getItemIndex from 'src/shared/lists/get-item-index';
import ListItemMobile from 'src/shared/lists/ListItemMobile';

import { Skeleton } from 'src/toolkit/chakra/skeleton';

interface Props {
  data: StatsBridgedTokenRow;
  tokenInfo?: StatsBridgedTokenItem;
  chainInfo?: ChainInfo;
  index: number;
  page: number;
  isLoading?: boolean;
}

const BridgedTokensListItem = ({ data, tokenInfo, chainInfo, index, page, isLoading }: Props) => {

  const tokenModel = React.useMemo(() => {
    if (!tokenInfo) {
      return;
    }

    return toTokenModel({
      ...tokenInfo,
      decimals: String(tokenInfo.decimals ?? '0'),
      address_hash: tokenInfo.token_address,
      type: 'ERC-20',
    });
  }, [ tokenInfo ]);

  return (
    <ListItemMobile rowGap={ 3 } alignItems="stretch">

      <HStack justifyContent="space-between">
        { tokenModel ? (
          <TokenEntityInterchain
            token={ tokenModel }
            chain={ chainInfo }
            isLoading={ isLoading }
            jointSymbol
            noCopy
            w="auto"
            textStyle="sm"
            fontWeight="700"
          />
        ) : <Skeleton loading={ isLoading } w="fit-content"><span>Unknown token</span></Skeleton> }
        <Skeleton loading={ isLoading } textStyle="sm" color="text.secondary" minW="24px" textAlign="right">
          <span>{ getItemIndex(index, page) }</span>
        </Skeleton>
      </HStack>
      { tokenModel && (
        <AddressEntityInterchain
          address={{ hash: tokenModel.address_hash }}
          chain={ chainInfo }
          isLoading={ isLoading }
          truncation="constant"
          link={{ variant: 'secondary' }}
          noIcon
          ml="28px"
        />
      ) }

      <Grid gridTemplateColumns="120px 1fr" columnGap={ 2 } rowGap={ 3 } textStyle="sm">
        <Skeleton loading={ isLoading } fontWeight={ 500 }>
          <span>Out transfers</span>
        </Skeleton>
        <Skeleton loading={ isLoading } color="text.secondary">
          <span>{ Number(data.output_transfers_count).toLocaleString() }</span>
        </Skeleton>
        <Skeleton loading={ isLoading } fontWeight={ 500 }>
          <span>In transfers</span>
        </Skeleton>
        <Skeleton loading={ isLoading } color="text.secondary">
          <span>{ Number(data.input_transfers_count).toLocaleString() }</span>
        </Skeleton>
        <Skeleton loading={ isLoading } fontWeight={ 500 }>
          <span>Total transfers</span>
        </Skeleton>
        <Skeleton loading={ isLoading } color="text.secondary">
          <span>{ Number(data.total_transfers_count).toLocaleString() }</span>
        </Skeleton>
      </Grid>
    </ListItemMobile>
  );
};

export default React.memo(BridgedTokensListItem);
