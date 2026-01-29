import { Text } from '@chakra-ui/react';
import React from 'react';

import type { Transaction } from 'types/api/transaction';

import { Skeleton } from 'toolkit/chakra/skeleton';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import DetailedInfoNativeCoinValue from 'ui/shared/DetailedInfo/DetailedInfoNativeCoinValue';
import TextSeparator from 'ui/shared/TextSeparator';
import NativeCoinValue from 'ui/shared/value/NativeCoinValue';

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
          <DetailedInfoNativeCoinValue
            amount={ data.scroll?.l1_fee }
            exchangeRate={ data.exchange_rate }
            loading={ isLoading }
          />
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
          <DetailedInfoNativeCoinValue
            amount={ data.scroll?.l2_fee.value }
            exchangeRate={ data.exchange_rate }
            loading={ isLoading }
          />
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
          <DetailedInfoNativeCoinValue
            amount={ String(data.scroll?.l1_fee_commit_scalar) }
            exchangeRate={ data.exchange_rate }
            loading={ isLoading }
          />
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
          <DetailedInfoNativeCoinValue
            amount={ String(data.scroll?.l1_fee_overhead) }
            exchangeRate={ data.exchange_rate }
            loading={ isLoading }
          />
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
                <NativeCoinValue
                  amount={ String(data.scroll?.l1_base_fee || 0) }
                  units="gwei"
                  unitsTooltip="wei"
                  noSymbol
                  fontWeight="600"
                />
              </Skeleton>
            ) }
            { data.scroll?.l1_fee_scalar !== undefined && (
              <Skeleton loading={ isLoading }>
                <TextSeparator/>
                <Text as="span" fontWeight="500">Scalar: </Text>
                <NativeCoinValue
                  amount={ String(data.scroll?.l1_fee_scalar || 0) }
                  units="gwei"
                  unitsTooltip="wei"
                  noSymbol
                  fontWeight="600"
                />
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
                <NativeCoinValue
                  amount={ String(data.scroll?.l1_blob_base_fee || 0) }
                  units="gwei"
                  unitsTooltip="wei"
                  noSymbol
                  fontWeight="600"
                />
              </Skeleton>
            ) }
            { data.scroll?.l1_fee_blob_scalar !== undefined && (
              <Skeleton loading={ isLoading }>
                <TextSeparator/>
                <Text as="span" fontWeight="500">Scalar: </Text>
                <NativeCoinValue
                  amount={ String(data.scroll?.l1_fee_blob_scalar || 0) }
                  units="gwei"
                  unitsTooltip="wei"
                  noSymbol
                  fontWeight="600"
                />
              </Skeleton>
            ) }
          </DetailedInfo.ItemValue>
        </>
      ) }
    </>
  );
};

export default TxInfoScrollFees;
