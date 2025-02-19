import { Grid } from '@chakra-ui/react';
import React from 'react';

import type { Pool } from 'types/api/pools';

import Skeleton from 'ui/shared/chakra/Skeleton';
import * as DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import DetailsSponsoredItem from 'ui/shared/DetailsSponsoredItem';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';

type Props = {
  data: Pool;
  isPlaceholderData: boolean;
};

const PoolInfo = ({ data, isPlaceholderData }: Props) => {
  return (
    <Grid
      columnGap={ 8 }
      rowGap={{ base: 1, lg: 3 }}
      templateColumns={{ base: 'minmax(0, 1fr)', lg: 'minmax(min-content, 220px) minmax(0, 1fr)' }}
      overflow="hidden"
    >
      <DetailsInfoItem.Label
        isLoading={ isPlaceholderData }
        hint="The base token in a liquidity pool pair"
      >
        Base token
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <TokenEntity
          token={{
            type: 'ERC-20',
            address: data.base_token_address,
            name: data.base_token_symbol,
            symbol: data.base_token_symbol,
            icon_url: data.base_token_icon_url,
          }}
          isLoading={ isPlaceholderData }
        />
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        isLoading={ isPlaceholderData }
        hint="The quote token in a liquidity pool pair"
      >
        Quote token
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <TokenEntity
          token={{
            type: 'ERC-20',
            address: data.quote_token_address,
            name: data.quote_token_symbol,
            symbol: data.quote_token_symbol,
            icon_url: data.quote_token_icon_url,
          }}
          isLoading={ isPlaceholderData }
        />
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        isLoading={ isPlaceholderData }
        hint="Fully Diluted Valuation: theoretical market cap if all tokens were in circulation"
      >
        Base token FDV
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <Skeleton isLoaded={ !isPlaceholderData }>
          { data.base_token_fully_diluted_valuation_usd ?
            `$${ Number(data.base_token_fully_diluted_valuation_usd).toLocaleString(undefined, { maximumFractionDigits: 2, notation: 'compact' }) }` :
            'N/A'
          }
        </Skeleton>
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        isLoading={ isPlaceholderData }
        hint="Current market capitalization of the base token"
      >
        Base token market cap
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <Skeleton isLoaded={ !isPlaceholderData }>
          { data.base_token_market_cap_usd ?
            `$${ Number(data.base_token_market_cap_usd).toLocaleString(undefined, { maximumFractionDigits: 2, notation: 'compact' }) }` :
            'N/A'
          }
        </Skeleton>
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        isLoading={ isPlaceholderData }
        hint="Fully Diluted Valuation: theoretical market cap if all tokens were in circulation"
      >
        Quote token FDV
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <Skeleton isLoaded={ !isPlaceholderData }>
          { data.quote_token_fully_diluted_valuation_usd ?
            `$${ Number(data.quote_token_fully_diluted_valuation_usd).toLocaleString(undefined, { maximumFractionDigits: 2, notation: 'compact' }) }` :
            'N/A'
          }
        </Skeleton>
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        isLoading={ isPlaceholderData }
        hint="Current market capitalization of the base token"
      >
        Quote token market cap
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <Skeleton isLoaded={ !isPlaceholderData }>
          { data.quote_token_market_cap_usd ?
            `$${ Number(data.quote_token_market_cap_usd).toLocaleString(undefined, { maximumFractionDigits: 2, notation: 'compact' }) }` :
            'N/A'
          }
        </Skeleton>
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        isLoading={ isPlaceholderData }
        hint="Current liquidity of the pool"
      >
        Liquidity
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <Skeleton isLoaded={ !isPlaceholderData }>
          ${ Number(data.liquidity).toLocaleString(undefined, { maximumFractionDigits: 2, notation: 'compact' }) }
        </Skeleton>
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        isLoading={ isPlaceholderData }
        hint="DEX where the pool is traded"
      >
        DEX
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <Skeleton isLoaded={ !isPlaceholderData }>
          { data.dex.name }
        </Skeleton>
      </DetailsInfoItem.Value>

      <DetailsSponsoredItem isLoading={ isPlaceholderData }/>
    </Grid>
  );
};

export default PoolInfo;
