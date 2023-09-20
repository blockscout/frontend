import { useColorModeValue, useToken, Box, chakra, Skeleton } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import React from 'react';

const Identicon = dynamic<{ bg: string; string: string; size: number }>(
  async() => {
    const lib = await import('react-identicons');
    return typeof lib === 'object' && 'default' in lib ? lib.default : lib;
  },
  {
    loading: () => <Skeleton w="100%" h="100%"/>,
    ssr: false,
  },
);

interface Props {
  className?: string;
  size: number;
  seed: string;
}

const IdenticonGithub = ({ size, seed }: Props) => {
  const bgColor = useToken('colors', useColorModeValue('gray.100', 'white'));

  return (
    <Box
      boxSize={ `${ size * 2 }px` }
      transformOrigin="left top"
      transform="scale(0.5)"
      borderRadius="full"
      overflow="hidden"
    >
      <Identicon
        bg={ bgColor }
        string={ seed }
        // the displayed size is doubled for retina displays and then scaled down
        size={ size * 2 }
      />
    </Box>
  );
};

export default React.memo(chakra(IdenticonGithub));
