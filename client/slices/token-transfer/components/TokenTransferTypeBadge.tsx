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
      content={ `Token type and transfer type are detected separately. This token classified as ${ tokenType } but emited ${ transferTokenType } events` }
      disabled={ !postfix }
    >
      <Badge colorPalette="orange" { ...rest }>{ `${ text }${ postfix }` }</Badge>
    </Tooltip>
  );
};

export default React.memo(TokenTransferTypeBadge);
