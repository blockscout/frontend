import { Skeleton, Text, Icon, chakra } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { TxInterpretationResponse, TxInterpretationVariable } from 'types/api/txInterpretation';

import actionIcon from 'icons/action.svg';
import type { ResourceError } from 'lib/api/resources';
import dayjs from 'lib/date/dayjs';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';

import { extractVariables, getStringChunks } from './utils';

type Props = {
  query: UseQueryResult<TxInterpretationResponse, ResourceError>;
  className?: string;
}

const TxInterpretationElementByType = ({ type, value }: TxInterpretationVariable) => {
  switch (type) {
    case 'address':
      return <AddressEntity address={ value } truncation="constant" sx={{ ':not(:first-child)': { marginLeft: 1 } }}/>;
    case 'token':
      return <TokenEntity token={ value } onlySymbol width="fit-content" sx={{ ':not(:first-child)': { marginLeft: 1 } }}/>;
    case 'currency':
      return <Text>{ BigNumber(value).toFormat() }</Text>;
    case 'timestamp':
      // timestamp is in unix format
      return <Text>{ dayjs(Number(value) * 1000).format('llll') }</Text>;
    case 'string':
    default: {
      return <Text>{ value.toString() }</Text>;
    }
  }
};

const TxInterpretation = ({ query, className }: Props) => {
  if (!query.data?.data.summaries[0]) {
    return null;
  }

  const template = query.data.data.summaries[0].summary_template;
  const variables = query.data.data.summaries[0].summary_template_variables;

  const variablesNames = extractVariables(template);

  const chunks = getStringChunks(template);

  return (
    <Skeleton display="flex" flexWrap="wrap" alignItems="center" isLoaded={ !query.isPlaceholderData } className={ className }>
      <Icon as={ actionIcon } boxSize={ 5 } color="text_secondary" mr={ 2 }/>
      { chunks.map((chunk, index) => {
        return (
          <>
            <Text whiteSpace="pre">{ chunk }</Text>
            { index < chunks.length - 1 && <TxInterpretationElementByType { ...variables[variablesNames[index]] }/> }
          </>
        );
      }) }
    </Skeleton>
  );
};

export default chakra(TxInterpretation);
