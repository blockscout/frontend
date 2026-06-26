// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type * as contractsInfo from '@blockscout/contracts-info-types';

import InfoPopoverButton from 'src/shared/buttons/InfoPopoverButton';

import Content, { hasContent } from './project-info/Content';

interface Props {
  data: contractsInfo.TokenInfo;
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
