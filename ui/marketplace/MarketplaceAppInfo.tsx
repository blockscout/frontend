import React from 'react';

import type { MarketplaceAppOverview } from 'types/client/marketplace';

import InfoButton from 'ui/shared/InfoButton';

import Content from './MarketplaceAppInfo/Content';

interface Props {
  data: MarketplaceAppOverview | undefined;
}

const MarketplaceAppInfo = ({ data }: Props) => {
  return (
    <InfoButton>
      <Content data={ data }/>
    </InfoButton>
  );
};

export default React.memo(MarketplaceAppInfo);
