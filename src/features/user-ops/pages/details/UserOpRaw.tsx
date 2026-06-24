// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import RawDataSnippet from 'src/shared/data/RawDataSnippet';

import { Skeleton } from 'src/toolkit/chakra/skeleton';

type RawDataKey = keyof schemas['UserOperationRawV06'] | keyof schemas['UserOperationRawV07ToV09'];
// order is taken from the ERC-4337 standard
// eslint-disable-next-line max-len
const KEYS_ORDER: Array<RawDataKey> = [ 'sender', 'nonce', 'init_code', 'call_data', 'account_gas_limits', 'call_gas_limit', 'verification_gas_limit', 'pre_verification_gas', 'gas_fees', 'max_fee_per_gas', 'max_priority_fee_per_gas', 'paymaster_and_data', 'signature' ];

interface Props {
  rawData?: schemas['UserOperation']['raw'];
  isLoading?: boolean;
}

const UserOpRaw = ({ rawData, isLoading }: Props) => {
  if (!rawData) {
    return null;
  }

  const text = JSON.stringify(KEYS_ORDER.reduce((res: schemas['UserOperation']['raw'], key: RawDataKey) => {
    const value = rawData[key as keyof schemas['UserOperation']['raw']];
    if (value !== undefined) {
      res[key as keyof schemas['UserOperation']['raw']] = value;
    }
    return res;
  }, {} as schemas['UserOperation']['raw']), undefined, 4);

  return <Skeleton loading={ isLoading }><RawDataSnippet data={ text }/></Skeleton>;
};

export default UserOpRaw;
