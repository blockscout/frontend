import { Grid } from '@chakra-ui/react';
import React from 'react';

import type { Pool } from 'types/api/pools';

import Skeleton from 'ui/shared/chakra/Skeleton';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import DetailedInfoSponsoredItem from 'ui/shared/DetailedInfo/DetailedInfoSponsoredItem';
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
      templateColumns={{ base: 'minmax(0, 1fr)', lg: 'minmax(min-content, 200px) minmax(0, 1fr)' }}
      overflow="hidden"
    >
      <DetailedInfo.ItemLabel
        isLoading={ isPlaceholderData }
        hint="The base token in a liquidity pool pair"
      >
        Base token
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
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
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        isLoading={ isPlaceholderData }
        hint="The quote token in a liquidity pool pair"
      >
        Quote token
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
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
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        isLoading={ isPlaceholderData }
        hint="Fully Diluted Valuation: theoretical market cap if all tokens were in circulation"
      >
        FDV
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton isLoaded={ !isPlaceholderData }>
          ${ Number(data.fully_diluted_valuation_usd).toLocaleString(undefined, { maximumFractionDigits: 2, notation: 'compact' }) }
        </Skeleton>
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        isLoading={ isPlaceholderData }
        hint="Current market capitalization of the pool"
      >
        Market cap
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton isLoaded={ !isPlaceholderData }>
          ${ Number(data.market_cap_usd).toLocaleString(undefined, { maximumFractionDigits: 2, notation: 'compact' }) }
        </Skeleton>
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        isLoading={ isPlaceholderData }
        hint="Current liquidity of the pool"
      >
        Liquidity
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton isLoaded={ !isPlaceholderData }>
          ${ Number(data.liquidity).toLocaleString(undefined, { maximumFractionDigits: 2, notation: 'compact' }) }
        </Skeleton>
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        isLoading={ isPlaceholderData }
        hint="DEX where the pool is traded"
      >
        DEX
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton isLoaded={ !isPlaceholderData }>
          { data.dex.name }
        </Skeleton>
      </DetailedInfo.ItemValue>

      <DetailedInfoSponsoredItem isLoading={ isPlaceholderData }/>
    </Grid>
  );
};

export default PoolInfo;
