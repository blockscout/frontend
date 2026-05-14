// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { TokenTransfer } from '../types/api';
import type { TokenInfo } from 'client/slices/token/types/api';

import { Badge, type BadgeProps } from 'toolkit/chakra/badge';
import { Tooltip } from 'toolkit/chakra/tooltip';

interface Props extends BadgeProps {
  methodType: TokenTransfer['type'];
  tokenType?: TokenInfo['type'];
  transferTokenType?: TokenTransfer['token_type'];
}

const TokenTransferTypeBadge = ({ methodType, tokenType, transferTokenType, ...rest }: Props) => {
  const postfix = tokenType && transferTokenType && tokenType !== transferTokenType ? `: ${ transferTokenType }` : '';

  const text = (() => {
    switch (methodType) {
      case 'token_minting':
        return 'Minting';
      case 'token_burning':
        return 'Burning';
      case 'token_spawning':
        return 'Creating';
      case 'token_transfer':
        return 'Transfer';
    }
  })();

  return (
    <Tooltip
      // eslint-disable-next-line max-len
      content={ `Token type and transfer type are detected separately. This token is classified as ${ tokenType } but emitted ${ transferTokenType } Transfer events` }
      disabled={ !postfix }
    >
      <Badge colorPalette="orange" { ...rest }>{ `${ text }${ postfix }` }</Badge>
    </Tooltip>
  );
};

export default React.memo(TokenTransferTypeBadge);
