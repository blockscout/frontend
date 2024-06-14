import React from 'react';
import type { AbiParameter } from 'viem';

import { matchArray } from '../utils';
import ItemArray from './ItemArray';
import ItemPrimitive from './ItemPrimitive';
import ItemTuple from './ItemTuple';

interface Props {
  abiParameter: AbiParameter;
  data: unknown;
  level?: number;
}

const Item = ({ abiParameter, data, level = 0 }: Props) => {

  const arrayMatch = React.useMemo(() => matchArray(abiParameter.type), [ abiParameter.type ]);
  if (arrayMatch) {
    if (!Array.isArray(data)) {
      return <ItemPrimitive abiParameter={ abiParameter } data={ data || '[ ]' } level={ level }/>;
    }
    return <ItemArray abiParameter={ abiParameter } data={ data } level={ level } arrayMatch={ arrayMatch }/>;
  }

  const tupleMatch = abiParameter.type.includes('tuple');
  if (tupleMatch) {
    return <ItemTuple abiParameter={ abiParameter } data={ data } level={ level }/>;
  }

  return <ItemPrimitive abiParameter={ abiParameter } data={ data } level={ level }/>;
};

export default React.memo(Item);
