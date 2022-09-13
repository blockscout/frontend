import { Tooltip } from '@chakra-ui/react';
import React from 'react';

interface Props {
  hash?: string;
}

const HashStringShorten = ({ hash = '' }: Props) => {
  return (
    <Tooltip label={ hash }>
      { hash.slice(0, 4) + '...' + hash.slice(-4) }
    </Tooltip>
  );
};

export default HashStringShorten;
