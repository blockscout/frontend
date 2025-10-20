import { useToken } from '@chakra-ui/react';
import React from 'react';

import { useColorModeValue } from '../../../chakra/color-mode';

export function useDefaultLineColor() {
  const [ lineColor ] = useToken('colors', useColorModeValue('theme.graph.line._light', 'theme.graph.line._dark'));
  return React.useMemo(() => lineColor, [ lineColor ]);
}

export function useDefaultGradient() {
  const [ startColor ] = useToken('colors', useColorModeValue('theme.graph.gradient.start._light', 'theme.graph.gradient.start._dark'));
  const [ stopColor ] = useToken('colors', useColorModeValue('theme.graph.gradient.stop._light', 'theme.graph.gradient.stop._dark'));
  return React.useMemo(() => ({ startColor, stopColor }), [ startColor, stopColor ]);
}
