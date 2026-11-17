// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';

import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';
import { route } from 'src/shared/router/routes';

import TxAllowedPeekers from './TxAllowedPeekers';

interface Props {
  data: Pick<schemas['TransactionResponse'], 'execution_node' | 'allowed_peekers'>;
  isLoading: boolean;
}

const TxDetailsSuave = ({ data, isLoading }: Props) => {
  return (
    <>
      { data.execution_node && (
        <>
          <DetailedInfo.ItemLabel
            hint="Node that carried out the confidential computation"
            isLoading={ isLoading }
          >
            Kettle
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <AddressEntity
              address={ data.execution_node }
              href={ route({ pathname: '/txs/kettle/[hash]', query: { hash: data.execution_node.hash } }) }
            />
          </DetailedInfo.ItemValue>
        </>
      ) }

      { data.allowed_peekers && data.allowed_peekers.length > 0 && (
        <TxAllowedPeekers items={ data.allowed_peekers }/>
      ) }
    </>
  );
};

export default React.memo(TxDetailsSuave);
