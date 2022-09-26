import { Box, Icon, IconButton, chakra } from '@chakra-ui/react';
import React from 'react';

import eastArrow from 'icons/arrows/east-mini.svg';

interface Props {
  className?: string;
}

const PrevNext = ({ className }: Props) => {
  return (
    <Box className={ className }>
      <IconButton
        aria-label="prev"
        icon={ <Icon as={ eastArrow } boxSize={ 6 }/> }
        h={ 6 }
        borderRadius="sm"
        variant="subtle"
        colorScheme="gray"
      />
      <IconButton
        aria-label="next"
        icon={ <Icon as={ eastArrow }boxSize={ 6 } transform="rotate(180deg)"/> }
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
