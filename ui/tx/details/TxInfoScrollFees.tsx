import { Text } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { Transaction } from 'types/api/transaction';

import { currencyUnits } from 'lib/units';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { WEI_IN_GWEI } from 'toolkit/utils/consts';
import CurrencyValue from 'ui/shared/CurrencyValue';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import TextSeparator from 'ui/shared/TextSeparator';

type Props = {
  data: Transaction;
  isLoading: boolean;
};

export const TxInfoScrollFees = ({ data, isLoading }: Props) => {
  return (
    <>
      { data.scroll?.l1_fee !== undefined && (
        <>
          <DetailedInfo.ItemLabel

            hint="L1 fee that pays for rollup costs"
            isLoading={ isLoading }
          >
            L1 data fee
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <CurrencyValue
              value={ data.scroll?.l1_fee }
              currency={ currencyUnits.ether }
              exchangeRate={ data.exchange_rate }
              flexWrap="wrap"
            />
          </DetailedInfo.ItemValue>
        </>
      ) }

      { data.scroll?.l2_fee !== undefined && (
        <>
          <DetailedInfo.ItemLabel
            hint="L2 execution fee"
            isLoading={ isLoading }
          >
            Execution fee
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <CurrencyValue
              value={ data.scroll?.l2_fee.value }
              currency={ currencyUnits.ether }
              exchangeRate={ data.exchange_rate }
              flexWrap="wrap"
            />
          </DetailedInfo.ItemValue>
        </>
      ) }

      { data.scroll?.l1_fee_commit_scalar !== undefined && (
        <>
          <DetailedInfo.ItemLabel
            hint="Commitment scalar"
            isLoading={ isLoading }
          >
            L1 commit scalar
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <CurrencyValue
              value={ String(data.scroll?.l1_fee_commit_scalar) }
              currency={ currencyUnits.ether }
              exchangeRate={ data.exchange_rate }
              flexWrap="wrap"
            />
          </DetailedInfo.ItemValue>
        </>
      ) }

      { data.scroll?.l1_fee_overhead !== undefined && (
        <>
          <DetailedInfo.ItemLabel
            hint="Additional gas overhead of a data commitment transaction"
            isLoading={ isLoading }
          >
            L1 Fee Overhead
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <Skeleton loading={ isLoading }>
              <CurrencyValue
                value={ String(data.scroll?.l1_fee_overhead) }
                currency={ currencyUnits.ether }
                exchangeRate={ data.exchange_rate }
                flexWrap="wrap"
              />
            </Skeleton>
          </DetailedInfo.ItemValue>
        </>
      ) }
      { (data.scroll?.l1_base_fee !== undefined || data.scroll?.l1_fee_scalar !== undefined) && (
        <>
          <DetailedInfo.ItemLabel
            hint="L1 gas fees"
            isLoading={ isLoading }
          >
            L1 gas fees
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            { data.scroll?.l1_base_fee !== undefined && (
              <Skeleton loading={ isLoading }>
                <Text as="span" fontWeight="500">Base: </Text>
                <Text fontWeight="600" as="span">{ BigNumber(data.scroll?.l1_base_fee || 0).dividedBy(WEI_IN_GWEI).toFixed() }</Text>
              </Skeleton>
            ) }
            { data.scroll?.l1_fee_scalar !== undefined && (
              <Skeleton loading={ isLoading }>
                <TextSeparator/>
                <Text as="span" fontWeight="500">Scalar: </Text>
                <Text fontWeight="600" as="span">{ BigNumber(data.scroll?.l1_fee_scalar || 0).dividedBy(WEI_IN_GWEI).toFixed() }</Text>
              </Skeleton>
            ) }
          </DetailedInfo.ItemValue>
        </>
      ) }
      { (data.scroll?.l1_blob_base_fee !== undefined || data.scroll?.l1_fee_blob_scalar !== undefined) && (
        <>
          <DetailedInfo.ItemLabel
            hint="L1 blob fees"
            isLoading={ isLoading }
          >
            L1 blob fees
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            { data.scroll?.l1_blob_base_fee !== undefined && (
              <Skeleton loading={ isLoading }>
                <Text as="span" fontWeight="500">Base: </Text>
                <Text fontWeight="600" as="span">{ BigNumber(data.scroll?.l1_blob_base_fee || 0).dividedBy(WEI_IN_GWEI).toFixed() }</Text>
              </Skeleton>
            ) }
            { data.scroll?.l1_fee_blob_scalar !== undefined && (
              <Skeleton loading={ isLoading }>
                <TextSeparator/>
                <Text as="span" fontWeight="500">Scalar: </Text>
                <Text fontWeight="600" as="span">{ BigNumber(data.scroll?.l1_fee_blob_scalar || 0).dividedBy(WEI_IN_GWEI).toFixed() }</Text>
              </Skeleton>
            ) }
          </DetailedInfo.ItemValue>
        </>
      ) }
    </>
  );
};

export default TxInfoScrollFees;
