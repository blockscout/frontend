import { Flex, chakra } from '@chakra-ui/react';
import React from 'react';
import type { AbiFunction } from 'viem';

import IconSvg from 'ui/shared/IconSvg';

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
        { data.map(({ type, name }, index) => {
          return (
            <React.Fragment key={ index }>
              <chakra.span fontWeight={ 500 }>{ name } </chakra.span>
              <span>{ name ? `(${ type })` : type }</span>
              { index < data.length - 1 && <span>, </span> }
            </React.Fragment>
          );
        }) }
      </p>
    </Flex>
  );
};

export default React.memo(ContractMethodOutputs);
