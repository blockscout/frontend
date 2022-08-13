import { Box } from '@chakra-ui/react';
import React from 'react';

import type { NetworkLink } from './types';

type Props = NetworkLink;

const NetworkMenuLink = ({ name }: Props) => {
  return <Box>{ name }</Box>;
};

export default React.memo(NetworkMenuLink);
