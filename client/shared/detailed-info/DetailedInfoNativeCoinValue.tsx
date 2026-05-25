// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { Props as NativeCoinValueProps } from 'client/shared/values/entity/NativeCoinValue';
import NativeCoinValue from 'client/shared/values/entity/NativeCoinValue';

import { ItemValue } from './DetailedInfo';

interface Props extends NativeCoinValueProps {}

const DetailedInfoNativeCoinValue = ({ ...rest }: Props) => {
  return (
    <ItemValue multiRow>
      <NativeCoinValue
        accuracy={ 0 }
        flexWrap="wrap"
        rowGap={ 0 }
        { ...rest }
      />
    </ItemValue>
  );
};

export default React.memo(DetailedInfoNativeCoinValue);
