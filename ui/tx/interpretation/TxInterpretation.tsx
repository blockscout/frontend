import { Skeleton, Flex, Text, Icon, chakra } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { TxInterpretationSummary, TxInterpretationVariable } from 'types/api/txInterpretation';

import config from 'configs/app';
import actionIcon from 'icons/action.svg';
import dayjs from 'lib/date/dayjs';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';

import { extractVariables, getStringChunks, NATIVE_COIN_SYMBOL_VAR_NAME } from './utils';

type Props = {
  summary?: TxInterpretationSummary;
  isLoading?: boolean;
  className?: string;
}

const TxInterpretationElementByType = ({ variable }: { variable?: TxInterpretationVariable }) => {
  if (!variable) {
    return null;
  }

  const { type, value } = variable;
  switch (type) {
    case 'address':
      return <AddressEntity address={ value } truncation="constant" sx={{ ':not(:first-child)': { marginLeft: 1 } }}/>;
    case 'token':
      return <TokenEntity token={ value } onlySymbol width="fit-content" sx={{ ':not(:first-child)': { marginLeft: 1 } }}/>;
    case 'currency': {
      let numberString = '';
      if (BigNumber(value).isLessThan(0.1)) {
        numberString = BigNumber(value).toPrecision(2);
      } else if (BigNumber(value).isLessThan(10000)) {
        numberString = BigNumber(value).dp(2).toFormat();
      } else {
        numberString = BigNumber(value).dividedBy(1000).toFormat(2) + 'K';
      }
      return <Text>{ numberString + ' ' }</Text>;
    }
    case 'timestamp':
      // timestamp is in unix format
      return <Text>{ dayjs(Number(value) * 1000).format('llll') + ' ' }</Text>;
    case 'string':
    default: {
      return <Text>{ value.toString() + ' ' }</Text>;
    }
  }
};

const TxInterpretation = ({ summary, isLoading, className }: Props) => {
  if (!summary) {
    return null;
  }

  const template = summary.summary_template;
  const variables = summary.summary_template_variables;

  const variablesNames = extractVariables(template);

  const chunks = getStringChunks(template);

  return (
    <Skeleton display="flex" flexWrap="wrap" alignItems="center" isLoaded={ !isLoading } className={ className }>
      <Icon as={ actionIcon } boxSize={ 5 } color="text_secondary" mr={ 2 }/>
      { chunks.map((chunk, index) => {
        return (
          <Flex whiteSpace="pre" key={ chunk + index }>
            <Text>{ chunk.trim() + (chunk.trim() && variablesNames[index] ? ' ' : '') }</Text>
            { index < variablesNames.length && (
              variablesNames[index] === NATIVE_COIN_SYMBOL_VAR_NAME ?
                <Text>{ config.chain.currency.symbol + ' ' }</Text> :
                <TxInterpretationElementByType variable={ variables[variablesNames[index]] }/>
            ) }
          </Flex>
        );
      }) }
    </Skeleton>
  );
};

export default chakra(TxInterpretation);
