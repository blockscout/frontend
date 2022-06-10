import type { ComponentMultiStyleConfig } from '@chakra-ui/theme';
import { cssVar } from '@chakra-ui/theme-tools';

const $width = cssVar('switch-track-width');
const $height = cssVar('switch-track-height');

const Switch: ComponentMultiStyleConfig = {
  parts: [ ],
  sizes: {
    md: {
      container: {
        [$width.variable]: '38px',
        [$height.variable]: '18px',
      },
    },
  },
  baseStyle: {
    track: {
      p: '1px',
    },
  },
}

export default Switch;
