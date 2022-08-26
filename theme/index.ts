import { extendTheme } from '@chakra-ui/react';

import components from './components/index';
import config from './config';
import borders from './foundations/borders';
import breakpoints from './foundations/breakpoints';
import colors from './foundations/colors';
import typography from './foundations/typography';
import global from './global';

const overrides = {
  ...typography,
  ...borders,
  colors,
  components,
  config,
  styles: {
    global,
  },
  breakpoints,
};

export default extendTheme(overrides);
