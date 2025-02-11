import { Text } from '@chakra-ui/react';
import React from 'react';

import type { ArbitrumTransactionMessageStatus, Transaction } from 'types/api/transaction';

import { route } from 'nextjs-routes';

import * as DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import LinkInternal from 'ui/shared/links/LinkInternal';
import VerificationSteps from 'ui/shared/verificationSteps/VerificationSteps';

const WITHDRAWAL_STATUS_STEPS: Array<ArbitrumTransactionMessageStatus> = [
  'Syncing with base layer',
  'Settlement pending',
  'Waiting for confirmation',
  'Ready for relay',
  'Relayed',
];

interface Props {
  data: Transaction;
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
              <LinkInternal
                href={ route({ pathname: '/txn-withdrawals', query: { q: data.hash } }) }
              >
                { step }
              </LinkInternal>
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
        <DetailsInfoItem.Label
          hint="Detailed status progress of the transaction"
        >
          Withdrawal status
        </DetailsInfoItem.Label>
        <DetailsInfoItem.Value>
          { data.arbitrum.message_related_info.message_status ? (
            <VerificationSteps
              steps={ steps as unknown as Array<ArbitrumTransactionMessageStatus> }
              currentStep={ data.arbitrum.message_related_info.message_status }
            />
          ) : <Text variant="secondary">Could not determine</Text> }
        </DetailsInfoItem.Value>
      </>
    );
  }
  return (
    <>
      <DetailsInfoItem.Label
        hint="The hash of the transaction that originated the message from the base layer"
      >
        Originating L1 txn hash
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        { data.arbitrum.message_related_info.associated_l1_transaction ?
          <TxEntityL1 hash={ data.arbitrum.message_related_info.associated_l1_transaction }/> :
          <Text variant="secondary">Waiting for confirmation</Text>
        }
      </DetailsInfoItem.Value>
    </>
  );
};

export default React.memo(TxDetailsWithdrawalStatusArbitrum);
