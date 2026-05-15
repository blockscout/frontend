// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { TokenVerifiedInfo } from 'client/features/verified-tokens/types/api';

import InfoButton from 'ui/shared/InfoButton';

import Content, { hasContent } from './project-info/Content';

interface Props {
  data: TokenVerifiedInfo;
}

const TokenProjectInfo = ({ data }: Props) => {
  if (!hasContent(data)) {
    return null;
  }

  return (
    <InfoButton>
      <Content data={ data }/>
    </InfoButton>
  );
};

export default React.memo(TokenProjectInfo);
