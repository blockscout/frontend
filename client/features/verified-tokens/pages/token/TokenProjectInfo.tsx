// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { TokenVerifiedInfo } from 'client/features/verified-tokens/types/api';

import InfoPopoverButton from 'client/shared/buttons/InfoPopoverButton';

import Content, { hasContent } from './project-info/Content';

interface Props {
  data: TokenVerifiedInfo;
}

const TokenProjectInfo = ({ data }: Props) => {
  if (!hasContent(data)) {
    return null;
  }

  return (
    <InfoPopoverButton>
      <Content data={ data }/>
    </InfoPopoverButton>
  );
};

export default React.memo(TokenProjectInfo);
