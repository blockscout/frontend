// SPDX-License-Identifier: LicenseRef-Blockscout

import { VStack } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';

import AddressEntityInterop from 'src/features/op-interop/components/AddressEntityInterop';

import config from 'src/config';
import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';

const rollupFeature = config.features.rollup;
const isInteropEnabled = rollupFeature.isEnabled && rollupFeature.interopEnabled;

interface Props {
  data: Pick<schemas['TransactionResponse'], 'op_interop_messages'>;
  isLoading: boolean;
}

const TxDetailsInteropTarget = ({ data, isLoading }: Props) => {
  if (!isInteropEnabled || !data.op_interop_messages?.some((message) => message.target_address_hash)) {
    return null;
  }

  return (
    <>
      <DetailedInfo.ItemLabel
        isLoading={ isLoading }
        hint="The target address where this cross-chain transaction is executed"
      >
        Interop target
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <VStack gap={ 2 } w="100%" overflow="hidden" alignItems="flex-start">
          { data.op_interop_messages
            .map((message) => {
              if (!message.target_address_hash) {
                return null;
              }
              return message.relay_chain !== undefined ? (
                <AddressEntityInterop
                  key={ message.nonce }
                  chain={ message.relay_chain }
                  address={{ hash: message.target_address_hash }}
                  isLoading={ isLoading }
                  truncation="dynamic"
                  w="100%"
                />
              ) : (
                <AddressEntity
                  key={ message.nonce }
                  address={{ hash: message.target_address_hash }}
                  isLoading={ isLoading }
                  truncation="dynamic"
                  w="100%"
                />
              );
            }) }
        </VStack>
      </DetailedInfo.ItemValue>
    </>
  );
};

export default React.memo(TxDetailsInteropTarget);
