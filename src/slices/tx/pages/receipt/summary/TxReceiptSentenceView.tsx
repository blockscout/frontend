// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra, Flex } from '@chakra-ui/react';
import React from 'react';

import type { SentenceSummary } from './types';

import { Skeleton } from 'src/toolkit/chakra/skeleton';

import TxReceiptParties from './TxReceiptParties';
import TxReceiptSentenceVariable from './TxReceiptSentenceVariable';
import TxReceiptSummaryPanel from './TxReceiptSummaryPanel';

interface Props {
  readonly summary: SentenceSummary;
  readonly isLoading: boolean;
}

const TxReceiptSentenceView = ({ summary, isLoading }: Props) => {
  const { actionType, template: { chunks, variablesNames }, variables, from, to, connector } = summary;

  return (
    <TxReceiptSummaryPanel
      action={ null }
      parties={ <TxReceiptParties from={ from } to={ to } connector={ connector } isLoading={ isLoading }/> }
      isLoading={ isLoading }
    >
      <Skeleton loading={ isLoading } color="text.secondary" overflowWrap="anywhere">
        { actionType && <chakra.h3 textStyle="heading.md" mb={ 2 }>{ actionType }</chakra.h3> }
        <Flex gap={ 2 } alignItems="center" flexWrap="wrap" justifyContent="center" textStyle="heading.md">
          { chunks.map((chunk, index) => (
            <React.Fragment key={ chunk + index }>
              { chunk }
              { index < variablesNames.length && <TxReceiptSentenceVariable name={ variablesNames[index] } variable={ variables[variablesNames[index]] }/> }
            </React.Fragment>
          )) }
        </Flex>
      </Skeleton>
    </TxReceiptSummaryPanel>
  );
};

export default React.memo(TxReceiptSentenceView);
