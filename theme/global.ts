import type { StyleFunctionProps } from '@chakra-ui/theme-tools';
import { mode } from '@chakra-ui/theme-tools';

import scrollbar from './foundations/scrollbar';
import addressEntity from './globals/address-entity';
import getDefaultTransitionProps from './utils/getDefaultTransitionProps';

const global = (props: StyleFunctionProps) => ({
  body: {
    bg: mode('white', 'black')(props),
    ...getDefaultTransitionProps(),
    '-webkit-tap-highlight-color': 'transparent',
    'font-variant-ligatures': 'no-contextual',
  },
  'body::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: mode('url("/icons/blessnet/colour_butterflies.png")', 'url("/icons/blessnet/colour_butterflies.png")')(props),
    backgroundRepeat: mode('repeat', 'repeat')(props), //leaving options to change depending on a theme
    backgroundSize: mode('750px 650px', '750px 650px')(props), //leaving options to change depending on a theme
    opacity: 0.2, // Control transparency of the background image
    filter: 'grayscale(0.6)', // Control gradient of the background image
    zIndex: -1, // Keep it behind the content
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
  ...addressEntity(props),
});

export default global;
