import { Tooltip } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';
import type { AbiParameter } from 'viem';

import AddressEntity from 'ui/shared/entities/address/AddressEntity';

import { matchInt } from '../utils';
import ItemLabel from './ItemLabel';
import { printRowOffset } from './utils';

function castValueToString(value: unknown): string {
  switch (typeof value) {
    case 'string':
      return value;
    case 'boolean':
      return String(value);
    case 'undefined':
      return '';
    case 'number':
      return value.toLocaleString(undefined, { useGrouping: false });
    case 'bigint':
      return value.toString();
    default:
      return String(value);
  }
}

const INT_TOOLTIP_THRESHOLD = 10 ** 9;

interface Props {
  abiParameter: AbiParameter;
  data: unknown;
  level: number;
}

const ItemPrimitive = ({ abiParameter, data, level }: Props) => {

  const value = (() => {
    if (abiParameter.type === 'address' && typeof data === 'string') {
      return <AddressEntity address={{ hash: data }} noCopy noIcon display="inline-flex" maxW="100%"/>;
    }

    const intMatch = matchInt(abiParameter.type);
    if (intMatch && typeof data === 'bigint' && intMatch.max > INT_TOOLTIP_THRESHOLD && data > INT_TOOLTIP_THRESHOLD) {
      const dividedValue = BigNumber(data.toString()).div(BigNumber(INT_TOOLTIP_THRESHOLD));
      return (
        <Tooltip label={ dividedValue.toLocaleString() + ' ETH' }>
          <span>{ castValueToString(data) }</span>
        </Tooltip>
      );
    }

    return <span>{ castValueToString(data) }</span>;
  })();

  return (
    <p>
      <span>{ printRowOffset(level) }</span>
      <ItemLabel abiParameter={ abiParameter }/>
      { value }
    </p>
  );
};

export default React.memo(ItemPrimitive);
