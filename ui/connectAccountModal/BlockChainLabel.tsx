import { Box, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import { blockchainMeta } from 'lib/contexts/ylide/constants';

export interface BlockChainLabelProps {
  blockchain: string;
}

export function BlockChainLabel({ blockchain }: BlockChainLabelProps) {
  const backgroundColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.100');
  return (
    <Box
      // background: var(--secondary-surface-color);
      // border-radius: 6px;
      // display: inline-block;
      // height: 24px;
      // vertical-align: middle;
      bg={ backgroundColor }
      borderRadius="6px"
      display="inline-block"
      height="24px"
      verticalAlign="middle"
    >
      <Box
        // grid-gap: 4px;
        // align-items: center;
        // display: grid;
        // font-size: 10px;
        // font-weight: 500;
        // grid-auto-flow: column;
        // height: 100%;
        // justify-content: center;
        // padding: 0 6px;
        gap={ 1 }
        alignItems="center"
        display="grid"
        fontSize="10px"
        fontWeight={ 500 }
        gridAutoFlow="column"
        height="100%"
        justifyContent="center"
        padding="0 6px"
      >
        { blockchainMeta[blockchain].logo(12) }
        <Box>{ blockchain.toUpperCase() }</Box>
      </Box>
    </Box>
  );
}
