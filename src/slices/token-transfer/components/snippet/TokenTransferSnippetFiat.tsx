// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import type BigNumber from 'bignumber.js';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import TokenMultiplierTag from 'src/slices/token/components/TokenMultiplierTag';

import TokenValue from 'src/shared/values/entity/TokenValue';

interface Props {
  token: schemas['Token'];
  value: string;
  decimals: string | null;
  multiplier?: BigNumber;
}

const TokenTransferSnippetFiat = ({ token, value, decimals, multiplier }: Props) => {
  return (
    <TokenValue
      amount={ value }
      token={ token }
      decimals={ decimals }
      multiplier={ multiplier }
      accuracy={ 0 }
      startElement={ (
        <>
          <chakra.span color="text.secondary">for </chakra.span>
          { multiplier && <TokenMultiplierTag multiplier={ multiplier } mr={ 2 }/> }
        </>
      ) }
    />
  );
};

export default React.memo(TokenTransferSnippetFiat);
