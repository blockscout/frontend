// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import React from 'react';

import type { TxInterpretationVariable } from 'src/features/tx-interpretation/common/types/api';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';
import TokenEntity from 'src/slices/token/components/entity/TokenEntity';

import EnsEntity from 'src/features/name-services/domains/components/EnsEntity';
import TxInterpretationDexTag from 'src/features/tx-interpretation/common/components/TxInterpretationDexTag';
import formatCurrencyValue from 'src/features/tx-interpretation/common/utils/format-currency-value';
import { NATIVE_COIN_SYMBOL_VAR_NAME, WEI_VAR_NAME } from 'src/features/tx-interpretation/common/utils/utils';

import config from 'src/config';
import Time from 'src/shared/date-and-time/Time';

import { Badge } from 'src/toolkit/chakra/badge';
import { SECOND } from 'src/toolkit/utils/consts';

import { useTxReceiptChainConfig } from '../useTxReceiptChainConfig';

const nameServicesFeature = config.features.nameServices;
const isEnsEnabled = nameServicesFeature.isEnabled && nameServicesFeature.ens.isEnabled;

const ENTITY_ICON = { marginRight: 1 };

const VALUE_STYLE = { textStyle: 'heading.lg', color: 'text.primary' } as const;

const Value = ({ children }: { readonly children: React.ReactNode }) => <chakra.span { ...VALUE_STYLE }>{ children }</chakra.span>;

interface Props {
  readonly name: string;
  readonly variable: TxInterpretationVariable | undefined;
}

const TxReceiptSentenceVariable = ({ name, variable }: Props) => {
  const { symbol, weiName } = useTxReceiptChainConfig().currency;

  if (name === NATIVE_COIN_SYMBOL_VAR_NAME) {
    return <Value>{ symbol || 'ETH' }</Value>;
  }

  if (name === WEI_VAR_NAME) {
    return <Value>{ weiName || 'wei' }</Value>;
  }

  if (!variable) {
    return null;
  }

  switch (variable.type) {
    case 'string':
      return variable.value;
    case 'currency':
      return <Value>{ formatCurrencyValue(variable.value) }</Value>;
    case 'timestamp':
      return <Time timestamp={ Number(variable.value) * SECOND } format="date_only" { ...VALUE_STYLE }/>;
    case 'address':
      return (
        <AddressEntity
          address={ variable.value }
          noLink
          noCopy
          truncation="constant"
          icon={ ENTITY_ICON }
          { ...VALUE_STYLE }
        />
      );
    case 'token':
      return (
        <TokenEntity
          token={ variable.value }
          noLink
          noCopy
          onlySymbol
          icon={ ENTITY_ICON }
          { ...VALUE_STYLE }
          w="auto"
        />
      );
    case 'domain':
      return isEnsEnabled ?
        <EnsEntity domain={ variable.value } noLink noCopy icon={ ENTITY_ICON } { ...VALUE_STYLE }/> :
        <Value>{ variable.value }</Value>;
    case 'method':
      return <Badge colorPalette={ variable.value === 'Multicall' ? 'teal' : 'gray' } truncated>{ variable.value }</Badge>;
    case 'dexTag':
      return <TxInterpretationDexTag value={ variable.value } noLink { ...VALUE_STYLE }/>;
    case 'external_link':
      return <Value>{ variable.value.name }</Value>;
    case 'link':
      return <Value>{ variable.value.name }</Value>;
  }
};

export default React.memo(TxReceiptSentenceVariable);
