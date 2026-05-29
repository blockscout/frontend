// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, chakra } from '@chakra-ui/react';
import React from 'react';

import SpriteIcon from 'src/sprite/SpriteIcon';

import { Tooltip } from 'src/toolkit/chakra/tooltip';

type Props = {
  iconSize: number;
  className?: string;
};

const ContractCertifiedLabel = ({ iconSize, className }: Props) => {
  return (
    <Tooltip content="This contract has been certified by the chain developers">
      <Flex className={ className }>
        <SpriteIcon name="certified" color="green.500" boxSize={ iconSize } cursor="pointer"/>
      </Flex>
    </Tooltip>
  );
};

export default chakra(ContractCertifiedLabel);
