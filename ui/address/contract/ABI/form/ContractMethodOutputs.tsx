import { Flex, chakra } from '@chakra-ui/react';
import React from 'react';
import type { AbiFunction } from 'viem';

import IconSvg from 'ui/shared/IconSvg';

type ItemProps = AbiFunction['outputs'][number] & { isLast: boolean };

const Item = ({ isLast, ...item }: ItemProps) => {
  return (
    <>
      <chakra.span fontWeight={ 500 }>{ item.name } </chakra.span>
      <span>{ item.name ? `(${ item.type })` : item.type }</span>
      { 'components' in item && (
        <>
          <span>{ '{' }</span>
          { item.components.map((component, index) => (
            <Item
              key={ index }
              { ...component }
              isLast={ index === item.components.length - 1 }
            />
          )) }
          <span>{ '}' }</span>
        </>
      ) }
      { !isLast && <span>, </span> }
    </>
  );
};

interface Props {
  data: AbiFunction['outputs'];
}

const ContractMethodOutputs = ({ data }: Props) => {
  if (data.length === 0) {
    return null;
  }

  return (
    <Flex mt={ 3 } fontSize="sm">
      <IconSvg name="arrows/down-right" boxSize={ 5 } mr={ 1 }/>
      <p>
        { data.map((item, index) => <Item key={ index } { ...item } isLast={ index === data.length - 1 }/>) }
      </p>
    </Flex>
  );
};

export default React.memo(ContractMethodOutputs);
