import type { StyleFunctionProps } from '@chakra-ui/theme-tools';
import { mode } from '@chakra-ui/theme-tools';

import scrollbar from './foundations/scrollbar';
import getDefaultTransitionProps from './utils/getDefaultTransitionProps';

const global = (props: StyleFunctionProps) => ({
  body: {
    bg: mode('white', 'black')(props),
    ...getDefaultTransitionProps(),
    WebkitTapHighlightColor: 'transparent',
    fontVariantLigatures: 'no-contextual',
  },
  mark: {
    bgColor: mode('green.100', 'green.800')(props),
    color: 'inherit',
  },
  'svg *::selection': {
    color: 'none',
    background: 'none',
  },
  form: {
    w: '100%',
  },
  ...scrollbar(props),
});

export default global;
