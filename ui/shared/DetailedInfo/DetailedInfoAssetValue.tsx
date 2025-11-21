import React from 'react';

import type { Props as AssetValueProps } from 'ui/shared/value/AssetValue';
import AssetValue from 'ui/shared/value/AssetValue';

import { ItemValue } from './DetailedInfo';

interface Props extends AssetValueProps {}

const DetailedInfoAssetValue = ({ ...rest }: Props) => {
  return (
    <ItemValue multiRow>
      <AssetValue
        accuracy={ 0 }
        accuracyUsd={ 0 }
        flexWrap="wrap"
        rowGap={ 0 }
        noTooltip
        { ...rest }
      />
    </ItemValue>
  );
};

export default React.memo(DetailedInfoAssetValue);
