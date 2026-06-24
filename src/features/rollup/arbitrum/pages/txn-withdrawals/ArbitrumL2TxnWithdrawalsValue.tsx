// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import { toTokenModel } from 'src/slices/token/utils/model';

import NativeCoinValue from 'src/shared/values/entity/NativeCoinValue';
import TokenValue from 'src/shared/values/entity/TokenValue';

import { Skeleton } from 'src/toolkit/chakra/skeleton';

interface Props {
  data: schemas['ArbitrumWithdrawal'];
  loading?: boolean;
}

const ArbitrumL2TxnWithdrawalsValue = ({ data, loading }: Props) => {

  if (data.token) {
    const token = toTokenModel({
      ...data.token,
      address_hash: data.token.address_hash ?? '',
      decimals: String(data.token.decimals),
      type: 'ERC-20',
    });

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
