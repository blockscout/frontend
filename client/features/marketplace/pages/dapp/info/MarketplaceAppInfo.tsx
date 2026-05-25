// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { MarketplaceApp } from 'client/features/marketplace/types/client';

import InfoPopoverButton from 'client/shared/buttons/InfoPopoverButton';

import Content from './Content';

interface Props {
  data: MarketplaceApp | undefined;
  isLoading?: boolean;
}

const MarketplaceAppInfo = ({ data, isLoading }: Props) => {
  return (
    <InfoPopoverButton isLoading={ isLoading }>
      <Content data={ data }/>
    </InfoPopoverButton>
  );
};

export default React.memo(MarketplaceAppInfo);
