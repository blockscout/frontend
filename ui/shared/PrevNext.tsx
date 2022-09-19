import { Box, Icon, IconButton, chakra } from '@chakra-ui/react';
import React from 'react';

import leftArrow from 'icons/arrows/left-mini.svg';
import rightArrow from 'icons/arrows/right-mini.svg';

interface Props {
  className?: string;
}

const PrevNext = ({ className }: Props) => {
  return (
    <Box className={ className }>
      <IconButton
        aria-label="prev"
        icon={ <Icon as={ leftArrow } boxSize={ 6 }/> }
        h={ 6 }
        borderRadius="sm"
        variant="subtle"
        colorScheme="gray"
      />
      <IconButton
        aria-label="next"
        icon={ <Icon as={ rightArrow }boxSize={ 6 }/> }
        h={ 6 }
        borderRadius="sm"
        variant="subtle"
        colorScheme="gray"
        ml="10px"
      />
    </Box>
  );
};

export default chakra(PrevNext);
