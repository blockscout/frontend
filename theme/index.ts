import { extendTheme, Tooltip } from '@chakra-ui/react';

import typography from './foundations/typography';
import borders from './foundations/borders';
import colors from './foundations/colors';
import components from './components/index';

const overrides = {
  ...typography,
  ...borders,
  colors,
  components,
}

Tooltip.defaultProps = { ...Tooltip.defaultProps, hasArrow: true }

export default extendTheme(overrides);
