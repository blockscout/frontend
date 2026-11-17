// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import getConfirmationDuration from 'src/slices/tx/utils/get-confirmation-duration';

import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';
import DetailedInfoTimestamp from 'src/shared/detailed-info/DetailedInfoTimestamp';
import TextSeparator from 'src/shared/texts/TextSeparator';

import { Skeleton } from 'src/toolkit/chakra/skeleton';

interface Props {
  data: Pick<schemas['TransactionResponse'], 'timestamp' | 'confirmation_duration'>;
  isLoading: boolean;
}

const TxDetailsTimestamp = ({ data, isLoading }: Props) => {
  if (!data.timestamp) {
    return null;
  }

  return (
    <>
      <DetailedInfo.ItemLabel
        hint="Date & time of transaction inclusion, including length of time for confirmation"
        isLoading={ isLoading }
      >
        Timestamp
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue multiRow>
        <DetailedInfoTimestamp timestamp={ data.timestamp } isLoading={ isLoading }/>
        { data.confirmation_duration && (
          <Flex alignItems="center">
            <TextSeparator hideBelow="lg"/>
            <Skeleton loading={ isLoading } color="text.secondary">
              <span>{ getConfirmationDuration(data.confirmation_duration) }</span>
            </Skeleton>
          </Flex>
        ) }
      </DetailedInfo.ItemValue>
    </>
  );
};

export default React.memo(TxDetailsTimestamp);
