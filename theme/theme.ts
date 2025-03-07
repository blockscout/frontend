import { extendTheme } from '@chakra-ui/react';

import components from './components/index';
import config from './config';
import borders from './foundations/borders';
import breakpoints from './foundations/breakpoints';
import colors from './foundations/colors';
import semanticTokens from './foundations/semanticTokens';
import transition from './foundations/transition';
import typography from './foundations/typography';
import zIndices from './foundations/zIndices';
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
  transition,
  zIndices,
  semanticTokens,
};

export default extendTheme(overrides);
