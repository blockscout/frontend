import { Box, Tooltip, chakra } from '@chakra-ui/react';
import React from 'react';

import colors from 'theme/foundations/colors';

import IconSvg from './IconSvg';

type Props = {
  iconSize: number;
  className?: string;
};

const ContractCertifiedLabel = ({ iconSize, className }: Props) => {
  return (
    <Tooltip label="This contract has been certified by the chain developers">
      <Box className={ className }>
        <IconSvg name="certified" color={ colors.success[500] } boxSize={ iconSize } cursor="pointer"/>
      </Box>
    </Tooltip>
  );
};

export default chakra(ContractCertifiedLabel);
