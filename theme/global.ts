import type { StyleFunctionProps } from '@chakra-ui/theme-tools';
import { mode } from '@chakra-ui/theme-tools';

import colors from 'theme/foundations/colors';

import scrollbar from './foundations/scrollbar';
import addressEntity from './globals/address-entity';
import getDefaultTransitionProps from './utils/getDefaultTransitionProps';

const global = (props: StyleFunctionProps) => ({
  body: {
    bg: mode('white', colors.grayTrue[900])(props),
    ...getDefaultTransitionProps(),
    '-webkit-tap-highlight-color': 'transparent',
    'font-variant-ligatures': 'no-contextual',
  },
  mark: {
    bgColor: mode('green.100', colors.success[800])(props),
    color: 'inherit',
  },
  'svg *::selection': {
    color: 'none',
    background: 'none',
  },
  '*::selection': {
    color: 'none',
    background: colors.error[500],
  },
  'button .chakra-skeleton::selection': {
    color: (props.color === colors.error[500]) ? colors.error[500] : colors.grayTrue[200],
    background: colors.error[500],
  },
  form: {
    w: '100%',
  },
  ...scrollbar(props),
  ...addressEntity(props),
});

export default global;
