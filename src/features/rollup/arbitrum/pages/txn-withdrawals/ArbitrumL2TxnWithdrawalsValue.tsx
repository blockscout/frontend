// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { ArbitrumL2TxnWithdrawalsItem } from '../../types/api';
import type { TokenInfo } from 'src/slices/token/types/api';

import NativeCoinValue from 'src/shared/values/entity/NativeCoinValue';
import TokenValue from 'src/shared/values/entity/TokenValue';

import { Skeleton } from 'src/toolkit/chakra/skeleton';

interface Props {
  data: ArbitrumL2TxnWithdrawalsItem;
  loading?: boolean;
}

const ArbitrumL2TxnWithdrawalsValue = ({ data, loading }: Props) => {

  if (data.token) {
    const token: TokenInfo | null = {
      ...data.token,
      decimals: String(data.token.decimals),
      type: 'ERC-20',
      holders_count: null,
      exchange_rate: null,
      total_supply: null,
      circulating_market_cap: null,
      icon_url: null,
      reputation: null,
    };

    return (
      <TokenValue
        amount={ data.token.amount ?? '0' }
        token={ token }
        layer="L1"
        tokenEntityProps={{ noIcon: true }}
        loading={ loading }
      />
    );
  }

  if (data.callvalue && data.callvalue !== '0') {
    return (
      <NativeCoinValue
        amount={ data.callvalue }
        loading={ loading }
      />
    );
  }

  return <Skeleton loading={ loading }><span>-</span></Skeleton>;
};

export default React.memo(ArbitrumL2TxnWithdrawalsValue);
