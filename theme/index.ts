import { extendTheme } from '@chakra-ui/react';

import typography from './foundations/typography';
import borders from './foundations/borders';
import colors from './foundations/colors';
import components from './components/index';
import config from './config';
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
}

export default extendTheme(overrides);
