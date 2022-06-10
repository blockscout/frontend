import { extendTheme } from '@chakra-ui/react';

import typography from './foundations/typography';
import borders from './foundations/borders';

const overrides = {
  ...typography,
  ...borders,
}

export default extendTheme(overrides);
