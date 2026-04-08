import { Grid, HStack } from '@chakra-ui/react';
import React from 'react';

import type { StatsBridgedTokenItem, StatsBridgedTokenRow } from '@blockscout/interchain-indexer-types';
import type { TokenInfo } from 'types/api/token';

import getItemIndex from 'lib/getItemIndex';
import { Skeleton } from 'toolkit/chakra/skeleton';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';

interface Props {
  data: StatsBridgedTokenRow;
  token: StatsBridgedTokenItem | undefined;
  index: number;
  page: number;
  isLoading?: boolean;
}

const BridgedTokensListItem = ({ data, token, index, page, isLoading }: Props) => {
  const tokenInfo: TokenInfo | undefined = React.useMemo(() => {
    if (!token) {
      return;
    }

    return {
      symbol: token.symbol ?? null,
      address_hash: token.token_address,
      type: 'ERC-20',
      name: token.name ?? null,
      decimals: String(token.decimals ?? '0'),
      holders_count: null,
      exchange_rate: null,
      total_supply: null,
      icon_url: token.icon_url ?? null,
      circulating_market_cap: null,
      reputation: null,
    };
  }, [ token ]);

  return (
    <ListItemMobile rowGap={ 3 } py={ 4 } fontSize="sm" alignItems="stretch">

      <HStack justifyContent="space-between">
        { tokenInfo ? (
          <TokenEntity
            token={ tokenInfo }
            isLoading={ isLoading }
            jointSymbol
            noCopy
            w="auto"
            textStyle="sm"
            fontWeight="700"
          />
        ) : <span>Unknown token</span> }
        <Skeleton loading={ isLoading } textStyle="sm" color="text.secondary" minW="24px" textAlign="right">
          <span>{ getItemIndex(index, page) }</span>
        </Skeleton>
      </HStack>
      { tokenInfo && (
        <AddressEntity
          address={{ hash: tokenInfo.address_hash }}
          isLoading={ isLoading }
          truncation="constant"
          link={{ variant: 'secondary' }}
          noIcon
          ml="28px"
        />
      ) }

      <Grid gridTemplateColumns="120px 1fr" columnGap={ 2 } rowGap={ 3 }>
        <Skeleton loading={ isLoading } fontWeight={ 500 }>
          <span>Out transfers</span>
        </Skeleton>
        <Skeleton loading={ isLoading }>
          <span>{ Number(data.output_transfers_count).toLocaleString() }</span>
        </Skeleton>
        <Skeleton loading={ isLoading } fontWeight={ 500 }>
          <span>In transfers</span>
        </Skeleton>
        <Skeleton loading={ isLoading }>
          <span>{ Number(data.input_transfers_count).toLocaleString() }</span>
        </Skeleton>
        <Skeleton loading={ isLoading } fontWeight={ 500 }>
          <span>Total transfers</span>
        </Skeleton>
        <Skeleton loading={ isLoading }>
          <span>{ Number(data.total_transfers_count).toLocaleString() }</span>
        </Skeleton>
      </Grid>
    </ListItemMobile>
  );
};

export default React.memo(BridgedTokensListItem);
