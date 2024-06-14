import { Box, chakra } from '@chakra-ui/react';
import React from 'react';
import type { AbiParameter } from 'viem';

import { matchArray, type MatchArray } from '../utils';
import ItemPrimitive from './ItemPrimitive';
import ItemTuple from './ItemTuple';
import { printRowOffset } from './utils';

interface Props {
  abiParameter: AbiParameter;
  data: Array<unknown>;
  level: number;
  arrayMatch: MatchArray;
}

const ItemArray = ({ abiParameter, data, level, arrayMatch }: Props) => {

  if (arrayMatch.isNested) {
    // TODO @tom2drum support nested arrays
    return <Box>nested array</Box>;
  }

  const type = arrayMatch.itemType;
  const internalType = matchArray(abiParameter.internalType || '')?.itemType;

  if (arrayMatch.itemType === 'tuple') {
    return (
      <p>
        <p>
          <span>{ printRowOffset(level) }</span>
          { abiParameter.name && <chakra.span fontWeight={ 500 }>{ abiParameter.name } </chakra.span> }
          <span>({ abiParameter.type }) : [</span>
        </p>
        { data.map((item, index) => (
          <ItemTuple
            key={ index }
            abiParameter={{ ...abiParameter, type, internalType }}
            data={ item }
            level={ level + 1 }
          />
        )) }
        <p>{ printRowOffset(level) }]</p>
      </p>
    );
  }

  return (
    <p>
      <p>
        <span>{ printRowOffset(level) }</span>
        { abiParameter.name && <chakra.span fontWeight={ 500 }>{ abiParameter.name } </chakra.span> }
        <span>({ abiParameter.type }) : [{ data.length === 0 ? ' ]' : '' }</span>
      </p>
      { data.map((item, index) => (
        <ItemPrimitive
          key={ index }
          abiParameter={{ ...abiParameter, type, internalType }}
          data={ item }
          level={ level + 1 }
        />
      )) }
      { data.length > 0 && <p>{ printRowOffset(level) }]</p> }
    </p>
  );
};

export default React.memo(ItemArray);
