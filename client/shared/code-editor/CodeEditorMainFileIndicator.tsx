// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, chakra } from '@chakra-ui/react';
import React from 'react';

import SpriteIcon from 'client/sprite/SpriteIcon';

import { Tooltip } from 'toolkit/chakra/tooltip';

interface Props {
  className?: string;
}

const CodeEditorMainFileIndicator = ({ className }: Props) => {
  return (
    <Tooltip content="The main file containing verified contract">
      <Box className={ className } >
        <SpriteIcon name="star_filled" boxSize={ 3 } display="block" color="green.500"/>
      </Box>
    </Tooltip>
  );
};

export default chakra(CodeEditorMainFileIndicator);
