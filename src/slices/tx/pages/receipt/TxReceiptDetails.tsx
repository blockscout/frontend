// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra, Flex, Separator } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import TxEntity from 'src/slices/tx/components/entity/TxEntity';
import TxFee from 'src/slices/tx/components/TxFee';

import Time from 'src/shared/date-and-time/Time';

import TxReceiptRow from './TxReceiptRow';
import { useTxReceiptChainConfig } from './useTxReceiptChainConfig';

interface RowValueProps {
  readonly data: schemas['TransactionResponse'];
}

interface ReceiptRow {
  readonly id: string;
  readonly label: string;
  readonly Value: React.ComponentType<RowValueProps>;
}

interface ReceiptRowGroup {
  readonly id: string;
  readonly rows: ReadonlyArray<ReceiptRow>;
}

const DateValue = ({ data }: RowValueProps) => {
  return data.timestamp ? <Time timestamp={ data.timestamp } format="date_only"/> : '-';
};

const TimeValue = ({ data }: RowValueProps) => {
  if (!data.timestamp) {
    return '-';
  }

  return (
    <>
      <Time timestamp={ data.timestamp } format="time_only"/>
      { ' ' }
      <Time timestamp={ data.timestamp } format="utc_offset" color="icon.secondary"/>
    </>
  );
};

const FeeValue = ({ data }: RowValueProps) => {
  return <TxFee tx={ data } accuracy={ 8 } usdColor="icon.secondary" justifyContent="flex-end"/>;
};

const ChainValue = () => {
  return useTxReceiptChainConfig().name;
};

const HashValue = ({ data }: RowValueProps) => {
  return <TxEntity hash={ data.hash } noIcon noLink noCopy truncation="constant" color="text.secondary"/>;
};

const ROW_GROUPS: ReadonlyArray<ReceiptRowGroup> = [
  {
    id: 'when',
    rows: [
      { id: 'date', label: 'Date', Value: DateValue },
      { id: 'time', label: 'Time', Value: TimeValue },
      { id: 'fee', label: 'Tx fee', Value: FeeValue },
    ],
  },
  {
    id: 'where',
    rows: [
      { id: 'chain', label: 'Chain', Value: ChainValue },
      { id: 'hash', label: 'Tx hash', Value: HashValue },
    ],
  },
];

interface Props {
  readonly data: schemas['TransactionResponse'];
  readonly isLoading: boolean;
}

const TxReceiptDetails = ({ data, isLoading }: Props) => {
  return (
    <Flex flexDir="column" gap={ 3 } px={ 1 } textStyle="sm" color="text.secondary">
      { ROW_GROUPS.map((group, index) => (
        <React.Fragment key={ group.id }>
          { index > 0 && <Separator borderColor="border.divider"/> }
          <chakra.dl display="flex" flexDir="column" gap={ 2 }>
            { group.rows.map(({ id, label, Value }) => (
              <TxReceiptRow key={ id } label={ label } isLoading={ isLoading }>
                <Value data={ data }/>
              </TxReceiptRow>
            )) }
          </chakra.dl>
        </React.Fragment>
      )) }
    </Flex>
  );
};

export default React.memo(TxReceiptDetails);
