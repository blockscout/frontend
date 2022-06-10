import { extendTheme } from '@chakra-ui/react';

import typography from './foundations/typography';
import borders from '../theme/foundations/borders';
import colors from './foundations/colors';

const overrides = {
  ...typography,
  ...borders,
  colors,
}

export default extendTheme(overrides);
