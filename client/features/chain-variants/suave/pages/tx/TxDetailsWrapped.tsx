// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, Grid } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { Transaction } from 'client/slices/tx/types/api';
import type { ExcludeUndefined } from 'types/utils';

import AddressEntity from 'client/slices/address/components/entity/AddressEntity';
import LogDecodedInputData from 'client/slices/log/components/LogDecodedInputData';
import TxEntity from 'client/slices/tx/components/entity/TxEntity';
import TxFee from 'client/slices/tx/components/TxFee';
import TxDetailsGasPrice from 'client/slices/tx/pages/details/info/parts/TxDetailsGasPrice';
import TxDetailsOther from 'client/slices/tx/pages/details/info/parts/TxDetailsOther';

import { Badge } from 'toolkit/chakra/badge';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import DetailedInfoNativeCoinValue from 'ui/shared/DetailedInfo/DetailedInfoNativeCoinValue';
import RawInputData from 'ui/shared/RawInputData';

interface Props {
  data: ExcludeUndefined<Transaction['wrapped']>;
}

const TxDetailsWrapped = ({ data }: Props) => {
  return (
    <Grid columnGap={ 8 } rowGap={{ base: 3, lg: 3 }} templateColumns={{ base: 'minmax(0, 1fr)', lg: 'auto minmax(0, 1fr)' }}>
      <DetailedInfo.ItemLabel
        hint="Unique character string (TxID) assigned to every verified transaction"
      >
        Transaction hash
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <TxEntity hash={ data.hash } noIcon noLink/>
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint="Transaction method name"
      >
        Method
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Badge colorPalette="gray">
          { data.method }
        </Badge>
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemDivider/>

      { data.to && (
        <>
          <DetailedInfo.ItemLabel
            hint="Address (external or contract) receiving the transaction"
          >
            { data.to.is_contract ? 'Interacted with contract' : 'To' }
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <Flex flexWrap="nowrap" alignItems="center" maxW="100%">
              <AddressEntity address={ data.to }/>
            </Flex>
          </DetailedInfo.ItemValue>
        </>
      ) }

      <DetailedInfo.ItemDivider/>

      <DetailedInfo.ItemLabel
        hint="Value sent in the native token (and USD) if applicable"
      >
        Value
      </DetailedInfo.ItemLabel>
      <DetailedInfoNativeCoinValue amount={ data.value }/>

      { data.fee.value !== null && (
        <>
          <DetailedInfo.ItemLabel
            hint="Total transaction fee"
          >
            Transaction fee
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <TxFee tx={ data } hasExchangeRateToggle/>
          </DetailedInfo.ItemValue>
        </>
      ) }

      <TxDetailsGasPrice gasPrice={ data.gas_price }/>

      { data.gas_limit && (
        <>
          <DetailedInfo.ItemLabel
            hint="Maximum amount of gas that can be used by the transaction"
          >
            Gas limit
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            { BigNumber(data.gas_limit).toFormat() }
          </DetailedInfo.ItemValue>
        </>
      ) }

      <DetailedInfo.ItemDivider/>

      <TxDetailsOther type={ data.type } nonce={ data.nonce } position={ null }/>

      <DetailedInfo.ItemLabel
        hint="Binary data included with the transaction. See logs tab for additional info"
      >
        Raw input
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <RawInputData hex={ data.raw_input }/>
      </DetailedInfo.ItemValue>

      { data.decoded_input && (
        <>
          <DetailedInfo.ItemLabel
            hint="Decoded input data"
          >
            Decoded input data
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <LogDecodedInputData data={ data.decoded_input }/>
          </DetailedInfo.ItemValue>
        </>
      ) }
    </Grid>
  );
};

export default TxDetailsWrapped;
