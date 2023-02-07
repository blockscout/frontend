import type { StyleFunctionProps } from '@chakra-ui/theme-tools';
import { mode } from '@chakra-ui/theme-tools';

import getDefaultTransitionProps from './utils/getDefaultTransitionProps';

const global = (props: StyleFunctionProps) => ({
  body: {
    bg: mode('white', 'black')(props),
    ...getDefaultTransitionProps(),
    '-webkit-tap-highlight-color': 'transparent',
  },
  mark: {
    bgColor: 'yellow.200',
    color: 'inherit',
  },
  'svg *::selection': {
    color: 'none',
    background: 'none',
  },
  form: {
    w: '100%',
  },
});

export default global;
