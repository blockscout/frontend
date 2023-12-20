import { Box, chakra, Tooltip } from '@chakra-ui/react';
import React from 'react';

import IconSvg from 'ui/shared/IconSvg';

interface Props {
  className?: string;
}

const CodeEditorMainFileIndicator = ({ className }: Props) => {
  return (
    <Tooltip label="The main file containing verified contract">
      <Box className={ className } >
        <IconSvg name="star_filled" boxSize={ 3 } display="block" color="green.500"/>
      </Box>
    </Tooltip>
  );
};

export default chakra(CodeEditorMainFileIndicator);
