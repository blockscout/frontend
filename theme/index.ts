import { extendTheme } from '@chakra-ui/react';

import typography from './foundations/typography';
import borders from './foundations/borders';
import colors from './foundations/colors';

const overrides = {
  ...typography,
  ...borders,
  colors,
}

export default extendTheme(overrides);
