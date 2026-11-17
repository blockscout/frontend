// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { Props as NativeCoinValueProps } from 'src/shared/values/entity/NativeCoinValue';
import NativeCoinValue from 'src/shared/values/entity/NativeCoinValue';

import { ItemValue } from './DetailedInfo';

interface Props extends NativeCoinValueProps {
  endContent?: React.ReactNode;
}

const DetailedInfoNativeCoinValue = ({ endContent, ...rest }: Props) => {
  return (
    <ItemValue multiRow columnGap={ 1 }>
      <NativeCoinValue
        accuracy={ 0 }
        flexWrap="wrap"
        rowGap={ 0 }
        { ...rest }
      />
      { endContent }
    </ItemValue>
  );
};

export default React.memo(DetailedInfoNativeCoinValue);
