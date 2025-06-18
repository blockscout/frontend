import { VStack } from '@chakra-ui/react';
import React from 'react';

import type { Transaction } from 'types/api/transaction';

import config from 'configs/app';
import { Badge } from 'toolkit/chakra/badge';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import AddressFromTo from 'ui/shared/address/AddressFromTo';
import CurrencyValue from 'ui/shared/CurrencyValue';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TxStatus from 'ui/shared/statusTag/TxStatus';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import TxFee from 'ui/shared/tx/TxFee';
import TxWatchListTags from 'ui/shared/tx/TxWatchListTags';
import TxAdditionalInfo from 'ui/txs/TxAdditionalInfo';

import TxTranslationType from './TxTranslationType';
import TxType from './TxType';

type Props = {
  tx: Transaction;
  showBlockInfo: boolean;
  currentAddress?: string;
  enableTimeIncrement?: boolean;
  isLoading?: boolean;
  animation?: string;
};

const TxsTableItem = ({ tx, showBlockInfo, currentAddress, enableTimeIncrement, isLoading, animation }: Props) => {
  const dataTo = tx.to ? tx.to : tx.created_contract;

  return (
    <TableRow key={ tx.hash } animation={ animation }>
      <TableCell pl={ 4 }>
        <TxAdditionalInfo tx={ tx } isLoading={ isLoading }/>
      </TableCell>
      <TableCell pr={ 4 }>
        <VStack alignItems="start" lineHeight="24px">
          <TxEntity
            hash={ tx.hash }
            isLoading={ isLoading }
            fontWeight="bold"
            noIcon
            maxW="100%"
            truncation="constant_long"
          />
          <TimeWithTooltip
            timestamp={ tx.timestamp }
            enableIncrement={ enableTimeIncrement }
            isLoading={ isLoading }
            color="text.secondary"
          />
        </VStack>
      </TableCell>
      <TableCell>
        <VStack alignItems="start">
          { tx.translation ? (
            <TxTranslationType
              types={ tx.transaction_types }
              isLoading={ isLoading || tx.translation.isLoading }
              translatationType={ tx.translation.data?.type }
            />
          ) :
            <TxType types={ tx.transaction_types } isLoading={ isLoading }/>
          }
          <TxStatus status={ tx.status } errorText={ tx.status === 'error' ? tx.result : undefined } isLoading={ isLoading }/>
          <TxWatchListTags tx={ tx } isLoading={ isLoading }/>
        </VStack>
      </TableCell>
      <TableCell whiteSpace="nowrap">
        { tx.method && (
          <Badge colorPalette={ tx.method === 'Multicall' ? 'teal' : 'gray' } loading={ isLoading } truncated>
            <span>{ tx.method }</span>
          </Badge>
        ) }
      </TableCell>
      { showBlockInfo && (
        <TableCell>
          { tx.block_number && (
            <BlockEntity
              isLoading={ isLoading }
              number={ tx.block_number }
              noIcon
              textStyle="sm"
              fontWeight={ 500 }
            />
          ) }
        </TableCell>
      ) }
      <TableCell>
        <AddressFromTo
          from={ tx.from }
          to={ dataTo }
          current={ currentAddress }
          isLoading={ isLoading }
          mt="2px"
          mode="compact"
        />
      </TableCell>
      { !config.UI.views.tx.hiddenFields?.value && (
        <TableCell isNumeric>
          <CurrencyValue value={ tx.value } accuracy={ 8 } isLoading={ isLoading } wordBreak="break-word"/>
        </TableCell>
      ) }
      { !config.UI.views.tx.hiddenFields?.tx_fee && (
        <TableCell isNumeric maxW="220px">
          <TxFee
            tx={ tx }
            accuracy={ 8 }
            isLoading={ isLoading }
            withCurrency={ Boolean(tx.celo || tx.stability_fee) }
            justifyContent="end"
            wordBreak="break-word"
          />
        </TableCell>
      ) }
    </TableRow>
  );
};

export default React.memo(TxsTableItem);
