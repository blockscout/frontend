// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { MarketplaceDapp } from '@blockscout/admin-rs-types';

import InfoPopoverButton from 'src/shared/buttons/InfoPopoverButton';

import Content from './Content';

interface Props {
  data: MarketplaceDapp | undefined;
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
