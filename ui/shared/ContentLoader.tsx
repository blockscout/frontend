import { Box, Text, chakra } from '@chakra-ui/react';
import React from 'react';

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
          animation: `fromLeftToRight 700ms ease-in-out infinite alternate`,
          left: '0%',
          top: 0,
          backgroundColor: 'blue.300',
          borderRadius: 'full',
        }}
      />
      <Text mt={ 6 } color="text.secondary">
        { text || 'Loading data, please wait...' }
      </Text>
    </Box>
  );
};

export default chakra(ContentLoader);
