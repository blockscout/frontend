import { Box, chakra } from '@chakra-ui/react';
import React from 'react';

import { Tooltip } from 'toolkit/chakra/tooltip';

import IconSvg from './IconSvg';

type Props = {
  iconSize: number;
  className?: string;
};

const ContractCertifiedLabel = ({ iconSize, className }: Props) => {
  return (
    <Tooltip content="This contract has been certified by the chain developers">
      <Box className={ className }>
        <IconSvg name="certified" color="green.500" boxSize={ iconSize } cursor="pointer"/>
      </Box>
    </Tooltip>
  );
};

export default chakra(ContractCertifiedLabel);
