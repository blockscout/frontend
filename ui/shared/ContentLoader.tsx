import { Box, Text, chakra } from '@chakra-ui/react';
import { keyframes } from '@chakra-ui/system';
import React from 'react';

const runnerAnimation = keyframes`
    0% { left: 0%; transform: translateX(-1%); }
    100% { left: '100%'; transform: translateX(-99%); }
`;

interface Props {
  className?: string;
  text?: string;
}

const ContentLoader = ({ className, text }: Props) => {
  return (
    <Box display="inline-block" className={ className }>
      <Box
        width="100%"
        height="6px"
        position="relative"
        _after={{
          content: `" "`,
          position: 'absolute',
          width: '60px',
          height: '6px',
          animation: `${ runnerAnimation } 700ms ease-in-out infinite alternate`,
          left: '100%',
          top: 0,
          backgroundColor: 'blue.300',
          borderRadius: 'full',
        }}
      />
      <Text mt={ 6 } variant="secondary">
        { text || 'Loading data, please wait...' }
      </Text>
    </Box>
  );
};

export default chakra(ContentLoader);
