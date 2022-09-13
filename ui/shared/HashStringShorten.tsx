import { Tooltip } from '@chakra-ui/react';
import React from 'react';

interface Props {
  address: string;
}

const HashStringShorten = ({ address }: Props) => {
  return (
    <Tooltip label={ address }>
      { address.slice(0, 4) + '...' + address.slice(-4) }
    </Tooltip>
  );
};

export default HashStringShorten;
