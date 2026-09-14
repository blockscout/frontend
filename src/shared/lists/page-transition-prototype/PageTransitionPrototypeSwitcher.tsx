// SPDX-License-Identifier: LicenseRef-Blockscout

// PROTOTYPE — throwaway, see ./store.ts. Floating bar: ←/→ (or arrow keys) cycles variants, latency chips
// set the fake request delay, the dot shows the list's current loading state.

import { Box, chakra, HStack, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import SpriteIcon from 'src/sprite/SpriteIcon';

import type { VariantKey } from './store';
import { LATENCIES, VARIANTS, isPrototypeEnabled, setPrototypeState, usePageTransitionPrototype } from './store';

const LIST_STATE_COLORS = {
  idle: '#4ade80',
  skeleton: '#facc15',
  transitioning: '#60a5fa',
};

const PageTransitionPrototypeSwitcher = () => {
  const router = useRouter();
  const { variant, latencyMs, listState } = usePageTransitionPrototype();

  const routerRef = React.useRef(router);
  React.useEffect(() => {
    routerRef.current = router;
  });

  const update = React.useCallback((patch: { variant?: VariantKey; latencyMs?: number }) => {
    const { pathname, query } = routerRef.current;
    const nextQuery = { ...query };
    if (patch.variant) {
      nextQuery.variant = patch.variant;
    }
    if (patch.latencyMs !== undefined) {
      nextQuery.latency = String(patch.latencyMs);
    }
    setPrototypeState(patch);
    routerRef.current.replace({ pathname, query: nextQuery }, undefined, { shallow: true, scroll: false });
  }, []);

  const index = VARIANTS.findIndex(({ key }) => key === variant);
  const current = VARIANTS[index];

  const cycle = React.useCallback((step: number) => {
    const nextIndex = (index + step + VARIANTS.length) % VARIANTS.length;
    update({ variant: VARIANTS[nextIndex].key });
  }, [ index, update ]);

  const handlePrevClick = React.useCallback(() => cycle(-1), [ cycle ]);
  const handleNextClick = React.useCallback(() => cycle(1), [ cycle ]);
  const handleLatencyClick = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    update({ latencyMs: Number(event.currentTarget.dataset.value) });
  }, [ update ]);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
        return;
      }
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [contenteditable]') || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }
      cycle(event.key === 'ArrowLeft' ? -1 : 1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [ cycle ]);

  if (!isPrototypeEnabled) {
    return null;
  }

  return (
    <Box
      position="fixed"
      bottom={ 5 }
      left="50%"
      transform="translateX(-50%)"
      zIndex={ 2000 }
      bg="#111"
      color="white"
      borderRadius="16px"
      border="1px solid rgba(255, 255, 255, 0.2)"
      boxShadow="0 8px 32px rgba(0, 0, 0, 0.35)"
      px={ 3 }
      py={ 2 }
      fontSize="13px"
      minW="440px"
    >
      <HStack justifyContent="space-between" gap={ 3 }>
        <chakra.button onClick={ handlePrevClick } aria-label="Previous variant" p={ 1 } cursor="pointer" _hover={{ opacity: 0.7 }}>
          <SpriteIcon name="arrows/east-mini" boxSize={ 5 }/>
        </chakra.button>
        <Box textAlign="center">
          <Text fontWeight={ 600 }>{ `${ String.fromCharCode(65 + index) } · ${ current.name }` }</Text>
          <Text opacity={ 0.65 } fontSize="12px">{ current.spec }</Text>
        </Box>
        <chakra.button onClick={ handleNextClick } aria-label="Next variant" p={ 1 } cursor="pointer" _hover={{ opacity: 0.7 }}>
          <SpriteIcon name="arrows/east-mini" boxSize={ 5 } transform="rotate(180deg)"/>
        </chakra.button>
      </HStack>
      <HStack justifyContent="space-between" mt={ 2 } pt={ 2 } borderTop="1px solid rgba(255, 255, 255, 0.12)" fontSize="12px">
        <HStack gap={ 1 }>
          <Text opacity={ 0.65 } mr={ 1 }>Latency</Text>
          { LATENCIES.map((value) => (
            <chakra.button
              key={ value }
              data-value={ value }
              onClick={ handleLatencyClick }
              px={ 2 }
              borderRadius="full"
              cursor="pointer"
              bg={ value === latencyMs ? 'rgba(255, 255, 255, 0.2)' : 'transparent' }
            >
              { value ? `${ value / 1000 }s` : 'off' }
            </chakra.button>
          )) }
        </HStack>
        <HStack gap={ 1.5 }>
          <Box boxSize="8px" borderRadius="full" bg={ LIST_STATE_COLORS[listState] }/>
          <Text fontFamily="mono">{ listState }</Text>
          <Text opacity={ 0.45 } ml={ 2 }>PROTOTYPE</Text>
        </HStack>
      </HStack>
    </Box>
  );
};

export default PageTransitionPrototypeSwitcher;
