// SPDX-License-Identifier: LicenseRef-Blockscout

import { Text } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';
import type { ArbitrumTransactionMessageStatus } from 'src/features/rollup/arbitrum/types/api';

import TxEntity from 'src/slices/tx/components/entity/TxEntity';

import { layerLabels } from 'src/features/rollup/common/utils/layer';
import { parentChain } from 'src/features/rollup/common/utils/parent-chain-entity';

import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';
import VerificationSteps from 'src/shared/lifecycle/steps/VerificationSteps';
import { route } from 'src/shared/router/routes';

import { Link } from 'src/toolkit/chakra/link';

const WITHDRAWAL_STATUS_STEPS: Array<ArbitrumTransactionMessageStatus> = [
  'Syncing with base layer',
  'Settlement pending',
  'Waiting for confirmation',
  'Ready for relay',
  'Relayed',
];

interface Props {
  data: schemas['TransactionResponse'];
}

const TxDetailsWithdrawalStatusArbitrum = ({ data }: Props) => {

  const steps = React.useMemo(() => {
    if (!data.arbitrum?.message_related_info) {
      return [];
    }

    switch (data.arbitrum.message_related_info.message_status) {
      case 'Ready for relay':
      case 'Relayed': {
        const lastElementIndex = data.arbitrum.message_related_info.message_status === 'Relayed' ? Infinity : -1;

        return WITHDRAWAL_STATUS_STEPS.slice(0, lastElementIndex).map((step, index, array) => {
          if (index !== array.length - 1) {
            return step;
          }

          return {
            content: (
              <Link
                href={ route({ pathname: '/txn-withdrawals', query: { q: data.hash } }) }
              >
                { step }
              </Link>
            ),
            label: step,
          };
        });
      }

      default:
        return WITHDRAWAL_STATUS_STEPS;
    }
  }, [ data.arbitrum?.message_related_info, data.hash ]);

  if (!data.arbitrum || !data.arbitrum?.contains_message || !data.arbitrum?.message_related_info) {
    return null;
  }

  if (data.arbitrum.contains_message === 'outcoming') {
    return (
      <>
        <DetailedInfo.ItemLabel
          hint="Detailed status progress of the transaction"
        >
          Withdrawal status
        </DetailedInfo.ItemLabel>
        <DetailedInfo.ItemValue>
          { data.arbitrum.message_related_info.message_status ? (
            <VerificationSteps
              steps={ steps }
              currentStep={ data.arbitrum.message_related_info.message_status }
            />
          ) : <Text color="text.secondary">Could not determine</Text> }
        </DetailedInfo.ItemValue>
      </>
    );
  }
  return (
    <>
      <DetailedInfo.ItemLabel
        hint="The hash of the transaction that originated the message from the base layer"
      >
        Originating { layerLabels.parent } txn hash
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        { data.arbitrum.message_related_info.associated_l1_transaction_hash ?
          <TxEntity hash={ data.arbitrum.message_related_info.associated_l1_transaction_hash } chain={ parentChain }/> :
          <Text color="text.secondary">Waiting for confirmation</Text>
        }
      </DetailedInfo.ItemValue>
    </>
  );
};

export default React.memo(TxDetailsWithdrawalStatusArbitrum);
