import { Flex, Grid } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { Transaction } from 'types/api/transaction';
import type { ExcludeUndefined } from 'types/utils';

import { currencyUnits } from 'lib/units';
import Tag from 'ui/shared/chakra/Tag';
import CurrencyValue from 'ui/shared/CurrencyValue';
import * as DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import DetailsInfoItemDivider from 'ui/shared/DetailsInfoItemDivider';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import LogDecodedInputData from 'ui/shared/logs/LogDecodedInputData';
import RawInputData from 'ui/shared/RawInputData';
import TxFee from 'ui/shared/tx/TxFee';
import TxDetailsGasPrice from 'ui/tx/details/TxDetailsGasPrice';
import TxDetailsOther from 'ui/tx/details/TxDetailsOther';

interface Props {
  data: ExcludeUndefined<Transaction['wrapped']>;
}

const TxDetailsWrapped = ({ data }: Props) => {
  return (
    <Grid columnGap={ 8 } rowGap={{ base: 3, lg: 3 }} templateColumns={{ base: 'minmax(0, 1fr)', lg: 'auto minmax(0, 1fr)' }}>
      <DetailsInfoItem.Label
        hint="Unique character string (TxID) assigned to every verified transaction"
      >
        Transaction hash
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value flexWrap="nowrap">
        <TxEntity hash={ data.hash } noIcon noLink noCopy={ false }/>
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        hint="Transaction method name"
      >
        Method
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <Tag colorScheme="gray">
          { data.method }
        </Tag>
      </DetailsInfoItem.Value>

      <DetailsInfoItemDivider/>

      { data.to && (
        <>
          <DetailsInfoItem.Label
            hint="Address (external or contract) receiving the transaction"
          >
            { data.to.is_contract ? 'Interacted with contract' : 'To' }
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <Flex flexWrap="nowrap" alignItems="center" maxW="100%">
              <AddressEntity address={ data.to }/>
            </Flex>
          </DetailsInfoItem.Value>
        </>
      ) }

      <DetailsInfoItemDivider/>

      <DetailsInfoItem.Label
        hint="Value sent in the native token (and USD) if applicable"
      >
        Value
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <CurrencyValue
          value={ data.value }
          currency={ currencyUnits.ether }
          flexWrap="wrap"
        />
      </DetailsInfoItem.Value>

      { data.fee.value !== null && (
        <>
          <DetailsInfoItem.Label
            hint="Total transaction fee"
          >
            Transaction fee
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <TxFee tx={ data } withUsd/>
          </DetailsInfoItem.Value>
        </>
      ) }

      <TxDetailsGasPrice gasPrice={ data.gas_price }/>

      { data.gas_limit && (
        <>
          <DetailsInfoItem.Label
            hint="Maximum amount of gas that can be used by the transaction"
          >
            Gas limit
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            { BigNumber(data.gas_limit).toFormat() }
          </DetailsInfoItem.Value>
        </>
      ) }

      <DetailsInfoItemDivider/>

      <TxDetailsOther type={ data.type } nonce={ data.nonce } position={ null }/>

      <DetailsInfoItem.Label
        hint="Binary data included with the transaction. See logs tab for additional info"
      >
        Raw input
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <RawInputData hex={ data.raw_input }/>
      </DetailsInfoItem.Value>

      { data.decoded_input && (
        <>
          <DetailsInfoItem.Label
            hint="Decoded input data"
          >
            Decoded input data
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <LogDecodedInputData data={ data.decoded_input }/>
          </DetailsInfoItem.Value>
        </>
      ) }
    </Grid>
  );
};

export default TxDetailsWrapped;
