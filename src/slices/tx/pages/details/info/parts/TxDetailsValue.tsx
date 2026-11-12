// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import type { BatchRecipients } from 'src/features/chain-variants/eden/utils/batch-recipients';

import config from 'src/config';
import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';
import DetailedInfoNativeCoinValue from 'src/shared/detailed-info/DetailedInfoNativeCoinValue';

import { Link } from 'src/toolkit/chakra/link';

interface Props {
  data: Pick<schemas['TransactionResponse'], 'value' | 'exchange_rate' | 'historic_exchange_rate'>;
  isLoading: boolean;
  recipients: BatchRecipients;
  onRecipientsClick: () => void;
}

const TxDetailsValue = ({ data, isLoading, recipients, onRecipientsClick }: Props) => {
  if (config.slices.tx.hiddenFields?.value) {
    return null;
  }

  return (
    <>
      <DetailedInfo.ItemLabel
        hint="Value sent in the native token (and USD) if applicable"
        isLoading={ isLoading }
      >
        Value
      </DetailedInfo.ItemLabel>
      <DetailedInfoNativeCoinValue
        amount={ data.value }
        exchangeRate={ data.exchange_rate }
        historicalExchangeRate={ data.historic_exchange_rate }
        hasExchangeRateToggle
        loading={ isLoading }
        endContent={ recipients.hasMultipleRecipients ? (
          <Flex alignItems="center" whiteSpace="pre">
            <Text color="text.secondary">to </Text>
            <Link variant="primary" onClick={ onRecipientsClick }>
              { `${ recipients.count } recipients` }
            </Link>
          </Flex>
        ) : undefined }
      />
    </>
  );
};

export default React.memo(TxDetailsValue);
