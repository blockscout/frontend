import { Box, Button, Heading, Icon, chakra } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import icon404 from 'icons/error-pages/404.svg';

interface Props {
  hash?: string;
  className?: string;
}

const AppErrorBlockConsensus = ({ hash, className }: Props) => {
  return (
    <Box className={ className }>
      <Icon as={ icon404 } width="200px" height="auto"/>
      <Heading mt={ 8 } size="2xl" fontFamily="body">Block removed due to chain reorganization</Heading>
      <Button
        mt={ 8 }
        size="lg"
        variant="outline"
        as="a"
        href={ hash ? route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: hash } }) : route({ pathname: '/' }) }
      >
        { hash ? 'View reorg' : 'Back to home' }
      </Button>
    </Box>
  );
};

export default chakra(AppErrorBlockConsensus);
