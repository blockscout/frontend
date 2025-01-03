import { Text } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { Transaction } from 'types/api/transaction';

import { WEI_IN_GWEI } from 'lib/consts';
import { currencyUnits } from 'lib/units';
import Skeleton from 'ui/shared/chakra/Skeleton';
import CurrencyValue from 'ui/shared/CurrencyValue';
import * as DetailsInfoItem from 'ui/shared/DetailsInfoItem';
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
          <DetailsInfoItem.Label

            hint="L1 fee that pays for rollup costs"
            isLoading={ isLoading }
          >
            L1 data fee
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <CurrencyValue
              value={ data.scroll?.l1_fee }
              currency={ currencyUnits.ether }
              exchangeRate={ data.exchange_rate }
              flexWrap="wrap"
            />
          </DetailsInfoItem.Value>
        </>
      ) }

      { data.scroll?.l2_fee !== undefined && (
        <>
          <DetailsInfoItem.Label
            hint="L2 execution fee"
            isLoading={ isLoading }
          >
            Execution fee
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <CurrencyValue
              value={ data.scroll?.l2_fee.value }
              currency={ currencyUnits.ether }
              exchangeRate={ data.exchange_rate }
              flexWrap="wrap"
            />
          </DetailsInfoItem.Value>
        </>
      ) }

      { data.scroll?.l1_fee_commit_scalar !== undefined && (
        <>
          <DetailsInfoItem.Label
            hint="Commitment scalar"
            isLoading={ isLoading }
          >
            L1 commit scalar
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <CurrencyValue
              value={ data.scroll?.l1_fee_commit_scalar }
              currency={ currencyUnits.ether }
              exchangeRate={ data.exchange_rate }
              flexWrap="wrap"
            />
          </DetailsInfoItem.Value>
        </>
      ) }

      { data.scroll?.l1_fee_overhead !== undefined && (
        <>
          <DetailsInfoItem.Label
            hint="Additional gas overhead of a data commitment transaction"
            isLoading={ isLoading }
          >
            L1 Fee Overhead
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <Skeleton isLoaded={ !isLoading }>
              <CurrencyValue
                value={ data.scroll?.l1_fee_overhead }
                currency={ currencyUnits.ether }
                exchangeRate={ data.exchange_rate }
                flexWrap="wrap"
              />
            </Skeleton>
          </DetailsInfoItem.Value>
        </>
      ) }
      { (data.scroll?.l1_base_fee !== undefined || data.scroll?.l1_fee_scalar !== undefined) && (
        <>
          <DetailsInfoItem.Label
            hint="L1 gas fees"
            isLoading={ isLoading }
          >
            L1 gas fees
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            { data.scroll?.l1_base_fee !== undefined && (
              <Skeleton isLoaded={ !isLoading }>
                <Text as="span" fontWeight="500">Base: </Text>
                <Text fontWeight="600" as="span">{ BigNumber(data.scroll?.l1_base_fee || 0).dividedBy(WEI_IN_GWEI).toFixed() }</Text>
              </Skeleton>
            ) }
            { data.scroll?.l1_fee_scalar !== undefined && (
              <Skeleton isLoaded={ !isLoading }>
                <TextSeparator/>
                <Text as="span" fontWeight="500">Scalar: </Text>
                <Text fontWeight="600" as="span">{ BigNumber(data.scroll?.l1_fee_scalar || 0).dividedBy(WEI_IN_GWEI).toFixed() }</Text>
              </Skeleton>
            ) }
          </DetailsInfoItem.Value>
        </>
      ) }
      { (data.scroll?.l1_blob_base_fee !== undefined || data.scroll?.l1_fee_blob_scalar !== undefined) && (
        <>
          <DetailsInfoItem.Label
            hint="L1 blob fees"
            isLoading={ isLoading }
          >
            L1 blob fees
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            { data.scroll?.l1_blob_base_fee !== undefined && (
              <Skeleton isLoaded={ !isLoading }>
                <Text as="span" fontWeight="500">Base: </Text>
                <Text fontWeight="600" as="span">{ BigNumber(data.scroll?.l1_blob_base_fee || 0).dividedBy(WEI_IN_GWEI).toFixed() }</Text>
              </Skeleton>
            ) }
            { data.scroll?.l1_fee_blob_scalar !== undefined && (
              <Skeleton isLoaded={ !isLoading }>
                <TextSeparator/>
                <Text as="span" fontWeight="500">Scalar: </Text>
                <Text fontWeight="600" as="span">{ BigNumber(data.scroll?.l1_fee_blob_scalar || 0).dividedBy(WEI_IN_GWEI).toFixed() }</Text>
              </Skeleton>
            ) }
          </DetailsInfoItem.Value>
        </>
      ) }
    </>
  );
};

export default TxInfoScrollFees;
