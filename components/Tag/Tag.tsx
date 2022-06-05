import React from 'react';

import { Box } from '@chakra-ui/react'

type Props = { children: React.ReactNode };

const Tag: React.FC<Props> = (props) => {
  return (
    <Box backgroundColor="gray.200" color="gray.600" borderRadius="4px" fontSize="xs" padding="2px 8px" width="fit-content">
      { props.children }
    </Box>
  )
}

export default Tag;
