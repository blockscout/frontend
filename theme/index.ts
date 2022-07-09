import { extendTheme } from '@chakra-ui/react';

import typography from './foundations/typography';
import borders from './foundations/borders';
import colors from './foundations/colors';
import components from './components/index';
import config from './config';

const overrides = {
  ...typography,
  ...borders,
  colors,
  components,
  config,
}

export default extendTheme(overrides);
