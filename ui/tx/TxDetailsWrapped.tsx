import { Flex, Grid } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { Transaction } from 'types/api/transaction';
import type { ExcludeUndefined } from 'types/utils';

import config from 'configs/app';
import Tag from 'ui/shared/chakra/Tag';
import CurrencyValue from 'ui/shared/CurrencyValue';
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import DetailsInfoItemDivider from 'ui/shared/DetailsInfoItemDivider';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import LogDecodedInputData from 'ui/shared/logs/LogDecodedInputData';
import RawInputData from 'ui/shared/RawInputData';
import TxDetailsGasPrice from 'ui/tx/details/TxDetailsGasPrice';
import TxDetailsOther from 'ui/tx/details/TxDetailsOther';

interface Props {
  data: ExcludeUndefined<Transaction['wrapped']>;
}

const TxDetailsWrapped = ({ data }: Props) => {
  return (
    <Grid columnGap={ 8 } rowGap={{ base: 3, lg: 3 }} templateColumns={{ base: 'minmax(0, 1fr)', lg: 'auto minmax(0, 1fr)' }}>
      <DetailsInfoItem
        title="Transaction hash"
        hint="Unique character string (TxID) assigned to every verified transaction"
        flexWrap="nowrap"
      >
        <TxEntity hash={ data.hash } noIcon noLink noCopy={ false }/>
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Method"
        hint="Transaction method name"
      >
        <Tag colorScheme="gray">
          { data.method }
        </Tag>
      </DetailsInfoItem>

      <DetailsInfoItemDivider/>

      <DetailsInfoItem
        title={ data.to?.is_contract ? 'Interacted with contract' : 'To' }
        hint="Address (external or contract) receiving the transaction"
        flexWrap={{ base: 'wrap', lg: 'nowrap' }}
        columnGap={ 3 }
      >
        <Flex flexWrap="nowrap" alignItems="center" maxW="100%">
          <AddressEntity address={ data.to }/>
        </Flex>
      </DetailsInfoItem>

      <DetailsInfoItemDivider/>

      <DetailsInfoItem
        title="Value"
        hint="Value sent in the native token (and USD) if applicable"
      >
        <CurrencyValue
          value={ data.value }
          currency={ config.chain.currency.symbol }
          flexWrap="wrap"
        />
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Transaction fee"
        hint="Total transaction fee"
      >
        <CurrencyValue
          value={ data.fee.value }
          currency={ config.chain.currency.symbol }
          flexWrap="wrap"
        />
      </DetailsInfoItem>
      <TxDetailsGasPrice gasPrice={ data.gas_price }/>
      { data.gas_limit && (
        <DetailsInfoItem
          title="Gas limit"
          hint="Maximum amount of gas that can be used by the transaction"
        >
          { BigNumber(data.gas_limit).toFormat() }
        </DetailsInfoItem>
      ) }

      <DetailsInfoItemDivider/>

      <TxDetailsOther type={ data.type } nonce={ data.nonce } position={ null }/>
      <DetailsInfoItem
        title="Raw input"
        hint="Binary data included with the transaction. See logs tab for additional info"
      >
        <RawInputData hex={ data.raw_input }/>
      </DetailsInfoItem>
      { data.decoded_input && (
        <DetailsInfoItem
          title="Decoded input data"
          hint="Decoded input data"
        >
          <LogDecodedInputData data={ data.decoded_input }/>
        </DetailsInfoItem>
      ) }
    </Grid>
  );
};

export default TxDetailsWrapped;
