// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';
import type {
  TxInterpretationVariable,
  TxInterpretationVariableString,
} from 'src/features/tx-interpretation/common/types/api';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';
import TokenEntity from 'src/slices/token/components/entity/TokenEntity';

import EnsEntity from 'src/features/name-services/domains/components/EnsEntity';

import config from 'src/config';
import * as analytics from 'src/shared/analytics';
import dayjs from 'src/shared/date-and-time/dayjs';

import { Badge } from 'src/toolkit/chakra/badge';
import { Link } from 'src/toolkit/chakra/link';
import { SECOND } from 'src/toolkit/utils/consts';

import formatCurrencyValue from '../utils/format-currency-value';
import TxInterpretationDexTag from './TxInterpretationDexTag';

const nameServicesFeature = config.features.nameServices;

export type NonStringTxInterpretationVariable = Exclude<TxInterpretationVariable, TxInterpretationVariableString>;

interface Props {
  readonly variable?: NonStringTxInterpretationVariable;
  readonly addressDataMap?: Record<string, schemas['Address']>;
}

const TxInterpretationElementByType = ({ variable, addressDataMap }: Props) => {
  const onAddressClick = React.useCallback(() => {
    analytics.logEvent(analytics.EventTypes.TX_INTERPRETATION_INTERACTION, { Type: 'Address click' });
  }, []);

  const onTokenClick = React.useCallback(() => {
    analytics.logEvent(analytics.EventTypes.TX_INTERPRETATION_INTERACTION, { Type: 'Token click' });
  }, []);

  const onDomainClick = React.useCallback(() => {
    analytics.logEvent(analytics.EventTypes.TX_INTERPRETATION_INTERACTION, { Type: 'Domain click' });
  }, []);

  if (!variable) {
    return null;
  }

  const { type, value } = variable;
  switch (type) {
    case 'address': {
      return (
        <chakra.span display="inline-block" verticalAlign="top" _notFirst={{ marginLeft: 1 }}>
          <AddressEntity
            address={ addressDataMap?.[value.hash] || value }
            icon={{ marginRight: 1 }}
            truncation="constant"
            onClick={ onAddressClick }
            whiteSpace="initial"
          />
        </chakra.span>
      );
    }
    case 'token':
      return (
        <chakra.span display="inline-block" verticalAlign="top" _notFirst={{ marginLeft: 1 }}>
          <TokenEntity
            token={ value }
            icon={{ marginRight: 1 }}
            onlySymbol
            noCopy
            width="fit-content"
            _notFirst={{ marginLeft: 1 }}
            mr={ 2 }
            whiteSpace="initial"
            onClick={ onTokenClick }
          />
        </chakra.span>
      );
    case 'domain': {
      if (nameServicesFeature.isEnabled && nameServicesFeature.ens.isEnabled) {
        return (
          <chakra.span display="inline-block" verticalAlign="top" _notFirst={{ marginLeft: 1 }}>
            <EnsEntity
              domain={ value }
              icon={{ marginRight: 1 }}
              width="fit-content"
              _notFirst={{ marginLeft: 1 }}
              whiteSpace="initial"
              onClick={ onDomainClick }
            />
          </chakra.span>
        );
      }
      return <chakra.span color="text.secondary" whiteSpace="pre">{ value + ' ' }</chakra.span>;
    }
    case 'currency': {
      return <chakra.span>{ formatCurrencyValue(value) + ' ' }</chakra.span>;
    }
    case 'timestamp': {
      return <chakra.span color="text.secondary" whiteSpace="pre">{ dayjs(Number(value) * SECOND).format('MMM DD YYYY') }</chakra.span>;
    }
    case 'external_link': {
      return <Link external href={ value.link }>{ value.name }</Link>;
    }
    case 'method': {
      return (
        <Badge
          colorPalette={ value === 'Multicall' ? 'teal' : 'gray' }
          truncated
          ml={ 1 }
          mr={ 2 }
          verticalAlign="text-top"
        >
          { value }
        </Badge>
      );
    }
    case 'dexTag': {
      return <TxInterpretationDexTag value={ value } verticalAlign="top" _notFirst={{ marginLeft: 1 }} mr={ 2 }/>;
    }
    case 'link': {
      return <Link external href={ value.url }>{ value.name }</Link>;
    }
  }
};

export default TxInterpretationElementByType;
