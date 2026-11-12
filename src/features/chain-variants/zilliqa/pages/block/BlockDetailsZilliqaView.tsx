// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';

import { Skeleton } from 'src/toolkit/chakra/skeleton';

interface Props {
  data: Pick<schemas['BlockResponse'], 'zilliqa'>;
  isLoading: boolean;
}

const BlockDetailsZilliqaView = ({ data, isLoading }: Props) => {
  if (typeof data.zilliqa?.view !== 'number') {
    return null;
  }

  return (
    <>
      <DetailedInfo.ItemLabel
        hint="The iteration of the consensus round in which the block was proposed"
        isLoading={ isLoading }
      >
        View
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton loading={ isLoading }>
          { data.zilliqa.view }
        </Skeleton>
      </DetailedInfo.ItemValue>
    </>
  );
};

export default React.memo(BlockDetailsZilliqaView);
