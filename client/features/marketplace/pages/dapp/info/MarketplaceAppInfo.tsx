// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { MarketplaceApp } from 'client/features/marketplace/types/client';

import InfoButton from 'ui/shared/InfoButton';

import Content from './Content';

interface Props {
  data: MarketplaceApp | undefined;
  isLoading?: boolean;
}

const MarketplaceAppInfo = ({ data, isLoading }: Props) => {
  return (
    <InfoButton isLoading={ isLoading }>
      <Content data={ data }/>
    </InfoButton>
  );
};

export default React.memo(MarketplaceAppInfo);
