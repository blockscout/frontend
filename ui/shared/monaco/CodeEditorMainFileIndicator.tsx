import { Box, chakra, Icon, Tooltip } from '@chakra-ui/react';
import React from 'react';

import iconStar from 'icons/star_filled.svg';

interface Props {
  className?: string;
}

const CodeEditorMainFileIndicator = ({ className }: Props) => {
  return (
    <Tooltip label="The main file containing verified contract">
      <Box className={ className } >
        <Icon as={ iconStar } boxSize={ 3 } display="block" color="green.500"/>
      </Box>
    </Tooltip>
  );
};

export default chakra(CodeEditorMainFileIndicator);
