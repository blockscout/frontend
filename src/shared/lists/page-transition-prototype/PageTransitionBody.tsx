// SPDX-License-Identifier: LicenseRef-Blockscout

// PROTOTYPE — throwaway, see ./store.ts. One body per variant of the page-transition state.

import { Box, Center, HStack, Spinner, Text } from '@chakra-ui/react';
import React from 'react';

import { usePageTransitionPrototype } from './store';

interface Props {
  readonly isTransitioning?: boolean;
  readonly children: React.ReactNode;
}

const PageTransitionBody = ({ isTransitioning, children }: Props) => {
  const { variant } = usePageTransitionPrototype();
  const inert = isTransitioning ? 'none' : undefined;

  switch (variant) {
    case 'dim':
      return (
        <Box
          aria-busy={ isTransitioning || undefined }
          css={{
            '& tbody': { transition: 'opacity 150ms ease-in-out', opacity: isTransitioning ? 0.4 : 1, pointerEvents: inert },
            // list view (no table): dim the whole body
            '&:not(:has(table))': { transition: 'opacity 150ms ease-in-out', opacity: isTransitioning ? 0.4 : 1, pointerEvents: inert },
          }}
        >
          { children }
        </Box>
      );

    case 'progress':
      return (
        <Box
          aria-busy={ isTransitioning || undefined }
          css={{
            '& tbody': { pointerEvents: inert, cursor: isTransitioning ? 'progress' : undefined },
            '&:not(:has(table))': { pointerEvents: inert },
            '& thead::after': isTransitioning ? {
              content: '" "',
              position: 'absolute',
              left: 0,
              bottom: '-1px',
              width: '25%',
              height: '3px',
              borderRadius: 'full',
              backgroundColor: 'blue.300',
              animation: 'fromLeftToRight 700ms ease-in-out infinite alternate',
            } : undefined,
          }}
        >
          { children }
        </Box>
      );

    case 'overlay':
      return (
        <Box position="relative" aria-busy={ isTransitioning || undefined }>
          <Box
            css={{
              '& tbody, &:not(:has(table))': {
                transition: 'opacity 200ms ease-in-out, filter 200ms ease-in-out',
                opacity: isTransitioning ? 0.5 : 1,
                filter: isTransitioning ? 'blur(1.5px)' : 'none',
                pointerEvents: inert,
              },
            }}
          >
            { children }
          </Box>
          { isTransitioning && (
            <Box position="absolute" inset={ 0 } pointerEvents="none" zIndex={ 1 }>
              <Center position="sticky" top="40vh" pt={ 20 }>
                <HStack
                  gap={ 2 }
                  px={ 4 }
                  py={ 2 }
                  borderRadius="full"
                  borderWidth="1px"
                  borderColor={{ _light: 'gray.200', _dark: 'gray.700' }}
                  bg={{ _light: 'white', _dark: 'black' }}
                  boxShadow="0 4px 16px rgba(0, 0, 0, 0.15)"
                >
                  <Spinner size="sm"/>
                  <Text textStyle="sm" fontWeight={ 500 }>Loading page…</Text>
                </HStack>
              </Center>
            </Box>
          ) }
        </Box>
      );

    case 'skeleton':
      return <Box>{ children }</Box>;
  }
};

export default PageTransitionBody;
